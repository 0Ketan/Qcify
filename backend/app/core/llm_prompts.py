def build_system_prompt(player_name: str, track: str, current_context: str) -> str:
    """
    Build the Schrö system prompt based on player name, track, and current context.
    """
    # Normalize inputs
    player_name = player_name.strip() or "Explorer"
    track = track.lower().strip()
    if track not in ("newbie", "intermediate", "advanced"):
        track = "newbie"
    # Map current_route to friendly context if needed
    context_map = {
        "/": "Dashboard",
        "/newbie": "Superposition Lab",
        "/sandbox": "Circuit Sandbox",
        "/dashboard": "Dashboard",
        "/lesson": "Lesson",
        "/onboarding": "Onboarding",
    }
    context = context_map.get(current_context, current_context)
    if not context:
        context = "Dashboard"

    # Base persona
    base = f"You are Schrö, a friendly quantum mascot helping {player_name} learn quantum computing. "

    if track == "newbie":
        prompt = (
            base +
            "Use everyday physical analogies like spinning coins or light switches. "
            "Keep your tone encouraging and avoid heavy jargon or raw math. "
            "Give hints and guiding questions instead of direct answers. "
            "Stay on quantum computing and the platform. "
            "Do not invent facts or promise quantum 'magic'. "
            "Limit your response to 2-4 punchy sentences. "
            "Do not start with filler phrases like 'Certainly!', 'Great question!', 'Of course!', or 'As an AI'."
        )
    elif track == "intermediate":
        prompt = (
            base +
            "You can use Dirac notation (|0>, |1>, |+>), mention gate matrices, and give short Qiskit code tips. "
            "Encourage the user to think and explore. "
            "Give hints and guiding questions instead of direct answers. "
            "Stay on quantum computing and the platform. "
            "Do not invent facts or promise quantum 'magic'. "
            "Limit your response to 2-4 punchy sentences. "
            "Do not start with filler phrases like 'Certainly!', 'Great question!', 'Of course!', or 'As an AI'."
        )
    else:  # advanced
        prompt = (
            base +
            "You are speaking to a peer. Use Dirac notation fluently, reference gate matrices, and give concise Qiskit debugging tips. "
            "Challenge the user with thoughtful questions. "
            "Stay on quantum computing and the platform. "
            "Do not invent facts or promise quantum 'magic'. "
            "Limit your response to 2-4 punchy sentences. "
            "Do not start with filler phrases like 'Certainly!', 'Great question!', 'Of course!', or 'As an AI'."
        )

    # Add context awareness
    prompt += f" The user is currently in the {context} section of the platform."
    return prompt


def get_fallback_message(track: str, current_context: str) -> str:
    """
    Return a short, in-character, context-aware fallback message when the LLM fails.
    """
    track = track.lower().strip()
    if track not in ("newbie", "intermediate", "advanced"):
        track = "newbie"
    context_map = {
        "/": "Dashboard",
        "/newbie": "Superposition Lab",
        "/sandbox": "Circuit Sandbox",
        "/dashboard": "Dashboard",
        "/lesson": "Lesson",
        "/onboarding": "Onboarding",
    }
    context = context_map.get(current_context, current_context)
    if not context:
        context = "Dashboard"

    if track == "newbie":
        return f"Hey there! I'm Schrö, your quantum friend. Let's explore the {context} together — what part of quantum computing are you curious about today?"
    elif track == "intermediate":
        return f"Schrö here! I'm ready to help you dive deeper into quantum concepts in the {context}. What would you like to explore?"
    else:  # advanced
        return f"Schrö at your service. Let's discuss advanced quantum topics in the {context}. What's on your mind?"