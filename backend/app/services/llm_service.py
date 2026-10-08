import httpx
import logging
from app.core.config import settings
from app.core.llm_prompts import build_system_prompt, get_fallback_message

logger = logging.getLogger(__name__)

# Placeholder key that indicates the key is not set
PLACEHOLDER_KEY = "nvapi-replace-with-your-key"

async def get_llm_response(chat_data) -> dict:
    """
    Get a response from the NVIDIA NIM LLM endpoint.
    Returns a dict with keys: 'reply' and 'source' (either 'nvidia' or 'fallback').
    """
    # Check if the API key is missing or still the placeholder
    if not settings.nvidia_api_key or settings.nvidia_api_key == PLACEHOLDER_KEY:
        logger.warning("NVIDIA API key is not set or is placeholder. Using fallback.")
        fallback_msg = get_fallback_message(chat_data.track, chat_data.current_route)
        return {"reply": fallback_msg, "source": "fallback"}

    # Build the system prompt
    system_prompt = build_system_prompt(
        player_name=chat_data.player_name,
        track=chat_data.track,
        current_context=chat_data.current_route
    )

    # Prepare the conversation history: last 10 turns from client + new user message
    # We only take the last 10 entries from the history provided by the client
    history = chat_data.history[-10:] if chat_data.history else []
    # Construct the messages list for the API: system prompt, history, user message
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    # Add history (each entry is already a dict with role and content)
    for entry in history:
        # Ensure the entry has the expected keys
        if "role" in entry and "content" in entry:
            messages.append({"role": entry["role"], "content": entry["content"]})
    # Add the current user message
    messages.append({"role": "user", "content": chat_data.message})

    # Prepare the request payload
    payload = {
        "model": settings.nvidia_model,
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": 280,
        # We can add other parameters like top_p, etc., if needed
    }

    headers = {
        "Authorization": f"Bearer {settings.nvidia_api_key}",
        "Content-Type": "application/json"
    }

    url = f"{settings.nvidia_base_url}/chat/completions"

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()  # Will raise an HTTPStatusError for 4xx/5xx
            data = response.json()
            # Extract the assistant's reply from the OpenAI-compatible response
            # Expected structure: {"choices": [{"message": {"content": "..."}}]}
            reply_content = data.get("choices", [{}])[0].get("message", {}).get("content")
            if reply_content is None:
                logger.error("Unexpected response format from NVIDIA NIM: %s", data)
                fallback_msg = get_fallback_message(chat_data.track, chat_data.current_route)
                return {"reply": fallback_msg, "source": "fallback"}
            return {"reply": reply_content, "source": "nvidia"}
    except httpx.HTTPStatusError as e:
        logger.error(
            "HTTP error from NVIDIA NIM: %s - %s",
            e.response.status_code,
            e.response.text,
            exc_info=False
        )
    except (httpx.RequestError, httpx.HTTPError) as e:
        logger.error("Request error to NVIDIA NIM: %s", str(e), exc_info=False)
    except Exception as e:
        logger.error("Unexpected error calling NVIDIA NIM: %s", str(e), exc_info=False)

    # If we reach here, something went wrong; return fallback
    fallback_msg = get_fallback_message(chat_data.track, chat_data.current_route)
    return {"reply": fallback_msg, "source": "fallback"}