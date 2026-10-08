import re
from typing import Optional, List
from app.core.config import settings
from app.core.llm_prompts import SCHRO_SYSTEM_PROMPT, HINT_LADDER_TEMPLATES
from app.schemas.chat_data import MascotChatRequest, MascotChatResponse, HintResponse

class LLMService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None

    async def get_schro_reply(self, request: MascotChatRequest) -> MascotChatResponse:
        user_msg = request.message.strip().lower()

        # If live Gemini client configured, try calling it
        if self.client:
            try:
                prompt = f"{SCHRO_SYSTEM_PROMPT}\n\nContext: {request.context}\nUser: {request.message}\nSchrö:"
                response = self.client.models.generate_content(
                    model=settings.default_model,
                    contents=prompt
                )
                text = response.text
                expression = self._detect_expression(text)
                return MascotChatResponse(
                    reply=text,
                    expression=expression,
                    hint_available=True
                )
            except Exception:
                pass # Fall back to built-in knowledge brain

        # Pedagogical offline quantum knowledge engine
        reply, expression = self._offline_schro_brain(request.message, request.context)
        return MascotChatResponse(
            reply=reply,
            expression=expression,
            hint_available=True
        )

    def get_hint(self, topic: str, step: int) -> HintResponse:
        clean_topic = topic.lower().strip()
        ladder = HINT_LADDER_TEMPLATES.get(clean_topic, HINT_LADDER_TEMPLATES["superposition"])
        index = min(max(step - 1, 0), len(ladder) - 1)
        hint_text = ladder[index]
        has_next = index < (len(ladder) - 1)
        
        expr = "thinking" if index == 0 else ("encouraging" if index == 1 else "excited")
        return HintResponse(
            topic=clean_topic,
            step=index + 1,
            hint=hint_text,
            expression=expr,
            has_next=has_next
        )

    def _detect_expression(self, text: str) -> str:
        t = text.lower()
        if any(w in t for w in ["congrats", "amazing", "eureka", "star", "awesome", "bingo"]):
            return "excited"
        elif any(w in t for w in ["keep going", "nice try", "you got this", "close", "proud"]):
            return "encouraging"
        elif any(w in t for w in ["hmm", "consider", "ponder", "wonder", "why"]):
            return "thinking"
        elif any(w in t for w in ["purr", "great", "welcome", "hello", "hi"]):
            return "happy"
        return "idle"

    def _offline_schro_brain(self, query: str, context: str) -> (str, str):
        q = query.lower()

        if any(w in q for w in ["hello", "hi", "hey", "who are you"]):
            return (
                "Meowdy! 🐾 I'm Schrö, your quantum companion! Right now I'm simultaneously napping in a cardboard box and teaching you the mysteries of the universe. What quantum concept shall we explore?",
                "happy"
            )

        if "superposition" in q or "coin" in q:
            return (
                "Imagine tossing a shiny gold coin onto a glass lab table. While it's spinning in mid-air, is it heads or tails? Both and neither! "
                "In quantum terms, a qubit in superposition exists as |ψ⟩ = α|0⟩ + β|1⟩ with probability amplitudes α and β until observation collapses the wave function! 🌀",
                "encouraging"
            )

        if "hadamard" in q or "h gate" in q:
            return (
                "The Hadamard (H) gate is our ultimate quantum coin flipper! "
                "Apply an H gate to a definite |0⟩ state, and *poof* — it lands into equal superposition |+⟩ = (|0⟩ + |1⟩)/√2! Try dragging one onto Wire 0 in the Sandbox! 🔮",
                "excited"
            )

        if "entanglement" in q or "bell" in q or "spooky" in q:
            return (
                "Einstein called it 'spooky action at a distance'! Entanglement connects two qubits so intimately that measuring one instantaneously tells you the exact state of the other — even if one is on Earth and the other is on Mars! Try building a Bell State with an H gate followed by a CNOT! 🔗✨",
                "excited"
            )

        if "cnot" in q or "cx" in q:
            return (
                "CNOT (Controlled-NOT) is the quantum equivalent of an IF statement! If the control qubit is |1⟩, it flips the target qubit from |0⟩ to |1⟩ (or vice versa). If the control is |0⟩, it purrs quietly and changes nothing! 🎯",
                "thinking"
            )

        if "bloch" in q or "sphere" in q:
            return (
                "The Bloch Sphere is a geometric wonderland! Think of it as a globe where the North Pole is |0⟩, the South Pole is |1⟩, and the entire equator represents all the infinite superpositions with different phases! 🌐",
                "encouraging"
            )

        if "hint" in q:
            return (
                "Need a hint? Check the Hint Ladder below or ask me about any specific gate! Remember: classical computers think in light switches (0 or 1); quantum computers think in infinite probability waves! 💡",
                "thinking"
            )

        return (
            f"Fascinating quantum question! When exploring {context}, remember that observation fundamentally changes the system. "
            "Try assembling a small circuit in the Sandbox and hitting 'Run Simulation' to watch the probability histogram in real time! 🐾",
            "encouraging"
        )

llm_service = LLMService()
