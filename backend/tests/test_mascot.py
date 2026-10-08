import pytest
from unittest.mock import AsyncMock, patch
from app.schemas.chat_data import ChatRequest
from app.services.llm_service import get_llm_response

# Test the build_system_prompt and get_fallback_message functions
def test_build_system_prompt_newbie():
    from app.core.llm_prompts import build_system_prompt
    prompt = build_system_prompt("Alice", "newbie", "/newbie")
    assert "Schrö" in prompt
    assert "Alice" in prompt
    assert "Superposition Lab" in prompt
    assert "everyday physical analogies" in prompt
    assert "spinning coins" in prompt
    assert "Do not start with filler phrases" in prompt

def test_build_system_prompt_intermediate():
    from app.core.llm_prompts import build_system_prompt
    prompt = build_system_prompt("Bob", "intermediate", "/")
    assert "Schrö" in prompt
    assert "Bob" in prompt
    assert "Dashboard" in prompt
    assert "Dirac notation" in prompt
    assert "gate matrices" in prompt

def test_build_system_prompt_advanced():
    from app.core.llm_prompts import build_system_prompt
    prompt = build_system_prompt("Charlie", "advanced", "/sandbox")
    assert "Schrö" in prompt
    assert "Charlie" in prompt
    assert "Circuit Sandbox" in prompt
    assert "speaking to a peer" in prompt
    assert "concise Qiskit debugging tips" in prompt

def test_get_fallback_message():
    from app.core.llm_prompts import get_fallback_message
    msg_newbie = get_fallback_message("newbie", "/newbie")
    assert "Schrö" in msg_newbie
    assert "Superposition Lab" in msg_newbie
    assert "quantum friend" in msg_newbie

    msg_intermediate = get_fallback_message("intermediate", "/")
    assert "Schrö" in msg_intermediate
    assert "Dashboard" in msg_intermediate
    assert "dive deeper" in msg_intermediate

    msg_advanced = get_fallback_message("advanced", "/sandbox")
    assert "Schrö" in msg_advanced
    assert "Circuit Sandbox" in msg_advanced
    assert "advanced quantum topics" in msg_advanced

# Test the LLM service with mocked httpx
@pytest.mark.asyncio
async def test_get_llm_response_fallback_no_key():
    from app.core.config import Settings
    # Temporarily override the settings
    original_settings = Settings
    # We'll create a mock settings object
    class MockSettings:
        nvidia_api_key = None
        nvidia_base_url = "https://test.com"
        nvidia_model = "test-model"
    # Patch the settings in the llm_service module
    with patch('app.services.llm_service.settings', MockSettings()):
        chat_data = ChatRequest(
            message="Hello",
            history=[],
            player_name="Test",
            track="newbie",
            current_route="/"
        )
        result = await get_llm_response(chat_data)
        assert result["source"] == "fallback"
        assert "Schrö" in result["reply"]

@pytest.mark.asyncio
async def test_get_llm_response_fallback_placeholder_key():
    from app.core.config import Settings
    class MockSettings:
        nvidia_api_key = "nvapi-replace-with-your-key"
        nvidia_base_url = "https://test.com"
        nvidia_model = "test-model"
    with patch('app.services.llm_service.settings', MockSettings()):
        chat_data = ChatRequest(
            message="Hello",
            history=[],
            player_name="Test",
            track="newbie",
            current_route="/"
        )
        result = await get_llm_response(chat_data)
        assert result["source"] == "fallback"

@pytest.mark.asyncio
async def test_get_llm_response_success():
    from app.core.config import Settings
    class MockSettings:
        nvidia_api_key = "fake-key"
        nvidia_base_url = "https://integrate.api.nvidia.com/v1"
        nvidia_model = "meta/llama-3.3-70b-instruct"
    with patch('app.services.llm_service.settings', MockSettings()):
        # Mock the httpx.AsyncClient
        mock_response = AsyncMock()
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "choices": [{
                "message": {
                    "content": "This is a test response from the LLM."
                }
            }]
        }
        mock_client = AsyncMock()
        mock_client.__aenter__.return_value.post.return_value = mock_response
        with patch('app.services.llm_service.httpx.AsyncClient', return_value=mock_client):
            chat_data = ChatRequest(
                message="Test message",
                history=[],
                player_name="Test",
                track="newbie",
                current_route="/"
            )
            result = await get_llm_response(chat_data)
            assert result["source"] == "nvidia"
            assert result["reply"] == "This is a test response from the LLM."

@pytest.mark.asyncio
async def test_get_llm_response_http_error():
    from app.core.config import Settings
    import httpx
    class MockSettings:
        nvidia_api_key = "fake-key"
        nvidia_base_url = "https://integrate.api.nvidia.com/v1"
        nvidia_model = "meta/llama-3.3-70b-instruct"
    with patch('app.services.llm_service.settings', MockSettings()):
        # Mock the httpx.AsyncClient to raise an HTTPStatusError
        mock_response = AsyncMock()
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "404 Not Found", request=AsyncMock(), response=AsyncMock(status_code=404)
        )
        mock_client = AsyncMock()
        mock_client.__aenter__.return_value.post.return_value = mock_response
        with patch('app.services.llm_service.httpx.AsyncClient', return_value=mock_client):
            chat_data = ChatRequest(
                message="Test message",
                history=[],
                player_name="Test",
                track="newbie",
                current_route="/"
            )
            result = await get_llm_response(chat_data)
            assert result["source"] == "fallback"
            assert "Schrö" in result["reply"]

# Test the endpoint
def test_chat_endpoint():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)

    # Test with valid data
    response = client.post("/mascot/chat", json={
        "message": "Hello",
        "history": [],
        "player_name": "Alice",
        "track": "newbie",
        "current_route": "/"
    })
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "source" in data
    assert data["source"] in ("nvidia", "fallback")

    # Test with invalid track
    response = client.post("/mascot/chat", json={
        "message": "Hello",
        "history": [],
        "player_name": "Alice",
        "track": "invalid",
        "current_route": "/"
    })
    assert response.status_code == 422

    # Test with empty message
    response = client.post("/mascot/chat", json={
        "message": "",
        "history": [],
        "player_name": "Alice",
        "track": "newbie",
        "current_route": "/"
    })
    assert response.status_code == 422

    # Test with history truncation (more than 10)
    long_history = [{"role": "user", "content": f"msg{i}"} for i in range(15)]
    response = client.post("/mascot/chat", json={
        "message": "New message",
        "history": long_history,
        "player_name": "Alice",
        "track": "newbie",
        "current_route": "/"
    })
    assert response.status_code == 200