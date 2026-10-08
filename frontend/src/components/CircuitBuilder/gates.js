export const AVAILABLE_GATES = [
  { name: 'H', label: 'Hadamard', desc: 'Creates 50/50 superposition', color: '#7C5CFF' },
  { name: 'X', label: 'Pauli-X', desc: 'Bit flip (NOT gate)', color: '#22D3EE' },
  { name: 'Y', label: 'Pauli-Y', desc: 'Bit & phase flip', color: '#34D399' },
  { name: 'Z', label: 'Pauli-Z', desc: 'Phase flip (π rotation)', color: '#FBBF24' },
  { name: 'S', label: 'Phase (S)', desc: 'π/2 phase rotation', color: '#F472B6' },
  { name: 'T', label: 'T Gate', desc: 'π/4 phase rotation', color: '#A78BFA' },
  { name: 'CNOT', label: 'CNOT', desc: 'Controlled NOT (entanglement)', color: '#E879F9', is2Qubit: true }
];

