from app.schemas.chat_data import ChatData
from app.core.llm_prompts import SYSTEM_PROMPT

def respond_to_chat(chat_data: ChatData) -> dict:
    msg = chat_data.message.lower()
    
    # Check if the message is quantum-related (basic heuristic)
    quantum_keywords = ['quantum', 'qubit', 'gate', 'superposition', 'entanglement', 'circuit', 'qiskit', 'qasm', 'bloch']
    is_quantum = any(kw in msg for kw in quantum_keywords)
    
    if not is_quantum:
        return {"reply": "I am sorry, but that is not related to quantum computing. Please ask quantum-related questions only."}
    
    # Placeholder for actual LLM integration
    return {"reply": f"Understood, you asked about '{chat_data.message}'. As a quantum assistant, I can help you with that concept!"}

