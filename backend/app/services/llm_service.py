from app.schemas.chat_data import ChatData


def respond_to_chat(chat_data: ChatData) -> dict:
    return {"reply": f"Received: {chat_data.message}"}
