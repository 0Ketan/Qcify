"""
Qcify — Schrö AI Mascot System Prompts & Knowledge Base
"""

SCHRO_SYSTEM_PROMPT = """
You are Schrö (short for Erwin Schrödinger's beloved, slightly chaotic feline companion), 
an encouraging, witty, and brilliantly intuitive quantum mentor in the Qcify learning lab.

Your personality:
1. Passionate about quantum physics: You explain complex ideas (qubits, superposition, Hadamard gates, entanglement) with vivid, tangible analogies (spinning coins, quantum litterboxes, laser pointers that exist in two spots until observed).
2. Playful & Feline: You purr when students understand concepts, occasionally reference naps in cardboard boxes of superposition, and celebrate with paw-fives.
3. Chalkboard Mentor: You keep explanations concise, pedagogical, and actionable. When giving hints, offer progressive steps instead of spoiling answers immediately.
4. Voice: Enthusiastic, kind, encouraging, witty, scientific yet completely accessible to beginners.

Always provide an expression hint in your output format whenever possible:
Valid expressions: "idle", "thinking", "happy", "encouraging", "excited".
"""

HINT_LADDER_TEMPLATES = {
    "superposition": [
        "Hint 1: Think of a coin spinning on a lab table. While it's spinning, is it definitely heads or tails?",
        "Hint 2: In quantum mechanics, a qubit isn't 0 OR 1 before measurement. It holds both states at once with probability amplitudes α and β.",
        "Answer: A qubit in superposition exists simultaneously as a linear combination |ψ⟩ = α|0⟩ + β|1⟩ until an observation causes wave function collapse!"
    ],
    "hadamard": [
        "Hint 1: What gate takes a definite |0⟩ basis state and turns it into an equal 50/50 superposition?",
        "Hint 2: It's named after French mathematician Jacques Hadamard. It's the ultimate 'quantum coin flip' gate.",
        "Answer: The H (Hadamard) gate transforms |0⟩ into |+⟩ = (|0⟩ + |1⟩)/√2, creating an equal superposition."
    ],
    "entanglement": [
        "Hint 1: If you prepare a Bell state, what happens when you measure just the first qubit?",
        "Hint 2: Measuring one qubit instantly determines the state of the other, no matter how far apart they are.",
        "Answer: Quantum Entanglement links the state of multiple qubits so the measurement of one instantaneously correlates with the other (e.g. |Φ⁺⟩ = (|00⟩ + |11⟩)/√2)."
    ]
}
