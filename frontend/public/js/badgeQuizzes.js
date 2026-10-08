/**
 * Qcify — Badge Quizzes Repository & Controller
 * 
 * Provides:
 * - 8 Normal Quizzes (to earn Small Badges)
 * - 8 Secret Quizzes (deep-dive challenges to elevate Small Badges to MASTERED)
 * - Scientific questions, answers, formulas, and in-depth explanations
 */

const BadgeQuizzes = (function () {

  const QUIZZES = {
    // ============================================================
    // TOPIC 1: TRANSITION FROM CLASSICAL TO QUANTUM
    // ============================================================

    // --- 1. QUBIT ---
    'qubit': {
      normal: {
        title: 'Qubit Fundamentals Quiz',
        description: 'Prove your understanding of two-level quantum states and measurement probabilities.',
        questions: [
          {
            question: 'What mathematical entity represents a pure qubit state in standard Dirac notation?',
            options: [
              'A continuous real wave equation ψ(x, t)',
              'A normalized unit vector |ψ⟩ = α|0⟩ + β|1⟩ in ℂ²',
              'A 3×3 stochastic classical probability matrix',
              'An unconstrained complex scalar'
            ],
            correct: 1,
            explanation: 'A pure qubit is defined as a normalized state vector in a two-dimensional complex Hilbert space: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.'
          },
          {
            question: 'If a qubit is prepared in state |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩, what is the probability of measuring |0⟩ in the computational basis?',
            options: [
              '50%',
              '25%',
              '75%',
              '100%'
            ],
            correct: 1,
            explanation: 'According to the Born rule, the probability P(0) = |⟨0|ψ⟩|² = |1/2|² = 1/4 = 25%.'
          },
          {
            question: 'Unlike classical bits that store 0 or 1 deterministically, what physical property allows a qubit to hold continuous probability amplitudes before measurement?',
            options: [
              'Thermal excitation',
              'Quantum coherence & superposition',
              'Magnetic hysteresis',
              'Electrical capacitance'
            ],
            correct: 1,
            explanation: 'Coherent quantum superposition enables linear combinations of basis states with well-defined relative phase before wavefunction collapse.'
          }
        ]
      },
      secret: {
        title: 'Qubit Mastery: Global Phase & Normalization Challenge',
        description: 'A deep challenge on state indistinguishability, complex phases, and state preservation.',
        questions: [
          {
            question: 'Two state vectors are given as |ψ₁⟩ = (|0⟩ + |1⟩)/√2 and |ψ₂⟩ = e^(iπ/4) · (|0⟩ + |1⟩)/√2. Are they physically distinguishable by any valid quantum measurement?',
            options: [
              'Yes, their interference pattern differs by 45°',
              'No, states differing only by a global phase factor e^(iθ) represent identical physical density operators',
              'Yes, but only using projective measurements in the Y basis',
              'Only if measured at absolute zero temperature'
            ],
            correct: 1,
            explanation: 'Global phase factors e^(iθ) cancel out in all expectation values ⟨ψ|M|ψ⟩ and density matrices ρ = |ψ⟩⟨ψ|, making them physically indistinguishable.'
          },
          {
            question: 'Given |ψ⟩ = α|0⟩ + β|1⟩ with α = (1 + i)/2, what must |β| equal to satisfy quantum state normalization?',
            options: [
              '1/4',
              '1/√2',
              '1/2',
              '√3/2'
            ],
            correct: 1,
            explanation: '|α|² = (1² + 1²)/2² = 2/4 = 1/2. Normalization requires |α|² + |β|² = 1, so |β|² = 1/2, meaning |β| = 1/√2.'
          },
          {
            question: 'What fundamental quantum theorem prohibits the creation of an identical copy of an arbitrary unknown pure quantum state |ψ⟩?',
            options: [
              'The Heisenberg Uncertainty Principle',
              'The No-Cloning Theorem',
              'Bell’s Inequality',
              'The Pauli Exclusion Principle'
            ],
            correct: 1,
            explanation: 'Wootters and Zurek (1982) proved the No-Cloning Theorem directly from the linearity of unitary quantum mechanics.'
          }
        ]
      }
    },

    // --- 2. SUPERPOSITION ---
    'superposition': {
      normal: {
        title: 'Superposition Principles Quiz',
        description: 'Test your understanding of constructive interference and basis transformations.',
        questions: [
          {
            question: 'Which single-qubit quantum gate creates an equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 when acting on initial ground state |0⟩?',
            options: [
              'Pauli-X Gate',
              'Hadamard (H) Gate',
              'Phase-S Gate',
              'Identity Gate'
            ],
            correct: 1,
            explanation: 'The Hadamard gate maps |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ − |1⟩)/√2, generating equal superposition.'
          },
          {
            question: 'What is the key difference between a quantum superposition and a classical probabilistic mixture (e.g., a hidden coin flip)?',
            options: [
              'Superpositions only work at room temperature',
              'Quantum superpositions exhibit interference effects caused by complex amplitude phases',
              'Classical mixtures have negative probabilities',
              'Superpositions cannot be measured'
            ],
            correct: 1,
            explanation: 'Quantum amplitudes can interfere destructively or constructively depending on relative phase θ, whereas classical probabilities are real and non-negative.'
          },
          {
            question: 'If |ψ⟩ = (1/√2)|0⟩ − (1/√2)|1⟩, what is this state in standard basis notation?',
            options: [
              '|+⟩ state',
              '|−⟩ state',
              '|i⟩ state',
              '|0⟩ state'
            ],
            correct: 1,
            explanation: '|−⟩ is defined as (|0⟩ − |1⟩)/√2, which has an eigenvalue of −1 with respect to the Pauli-X operator.'
          }
        ]
      },
      secret: {
        title: 'Superposition Mastery: Interference & Relative Phase',
        description: 'Rigorous calculation of phase-induced interference and state evolution.',
        questions: [
          {
            question: 'If we apply a Hadamard gate to state |−⟩ = (|0⟩ − |1⟩)/√2, what exact deterministic computational basis state is produced?',
            options: [
              '|0⟩',
              '|1⟩',
              '(|0⟩ + |1⟩)/√2',
              'A 50/50 random mixture'
            ],
            correct: 1,
            explanation: 'H|−⟩ = H(H|1⟩) = H²|1⟩ = I|1⟩ = |1⟩, because H is its own inverse (H† = H = H⁻¹).'
          },
          {
            question: 'In state |ψ(θ)⟩ = (|0⟩ + e^(iθ)|1⟩)/√2, what measurement basis reveals interference patterns dependent on the relative phase θ?',
            options: [
              'The standard computational Z basis (|0⟩, |1⟩)',
              'Measurements in the equatorial plane, such as the X basis (|+⟩, |−⟩)',
              'Any energy eigenvalue measurement',
              'No measurement can reveal relative phase'
            ],
            correct: 1,
            explanation: 'Measuring in the X basis gives probability |⟨+|ψ⟩|² = |(1 + e^(iθ))/2|² = (1 + cos θ)/2, oscillating with θ.'
          },
          {
            question: 'For an n-qubit register initialized to |0⟩^(⊗n), applying an n-fold Hadamard transform H^(⊗n) places the register in an equal superposition of how many orthogonal states?',
            options: [
              'n states',
              '2n states',
              '2ⁿ states',
              'n² states'
            ],
            correct: 2,
            explanation: 'H^(⊗n)|0...0⟩ = 2^(-n/2) ∑_{x=0}^{2^n-1} |x⟩, creating a coherent superposition across all 2ⁿ basis states.'
          }
        ]
      }
    },

    // --- 3. BLOCH SPHERE ---
    'bloch-sphere': {
      normal: {
        title: 'Bloch Sphere Geometry Quiz',
        description: 'Explore the 3D spherical visualization of single-qubit pure states.',
        questions: [
          {
            question: 'On the standard Bloch sphere, which locations correspond to computational basis states |0⟩ and |1⟩?',
            options: [
              'East and West poles on the equator',
              'North pole (+Z) and South pole (−Z)',
              'Center of the sphere',
              'Any points on the prime meridian'
            ],
            correct: 1,
            explanation: 'By convention, the north pole (θ = 0) represents |0⟩ and the south pole (θ = π) represents |1⟩.'
          },
          {
            question: 'What angles (θ, φ) on the Bloch sphere parametrize the state |+⟩ = (|0⟩ + |1⟩)/√2?',
            options: [
              'θ = 0, φ = 0',
              'θ = π/2, φ = 0 (lying on the equator along the +X axis)',
              'θ = π, φ = π/2',
              'θ = π/4, φ = π'
            ],
            correct: 1,
            explanation: 'Since |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩, |+⟩ has cos(θ/2) = 1/√2 ⇒ θ = π/2 and e^(iφ) = 1 ⇒ φ = 0.'
          },
          {
            question: 'Where do mixed (decohered) quantum states lie with respect to the Bloch sphere?',
            options: [
              'Directly on the outer unit surface (radius r = 1)',
              'Inside the interior of the sphere (radius r < 1)',
              'Outside the sphere at r > 1',
              'Mixed states cannot be represented'
            ],
            correct: 1,
            explanation: 'Pure states lie on the surface (Tr(ρ²) = 1, r = 1), while mixed states lie strictly inside the Bloch ball (Tr(ρ²) < 1, r < 1).'
          }
        ]
      },
      secret: {
        title: 'Bloch Sphere Mastery: Rotations & Unitary Coordinates',
        description: 'Master Euler angles, SU(2) rotations, and state projections.',
        questions: [
          {
            question: 'A Pauli-Z gate acts on the Bloch vector as what geometric transformation?',
            options: [
              'A 90° rotation around the X-axis',
              'A 180° (π radian) rotation around the Z-axis',
              'A reflection across the XY equatorial plane',
              'An inversion through the origin'
            ],
            correct: 1,
            explanation: 'The unitary operator R_z(π) = exp(-i π/2 σ_z) = -i Z rotates the Bloch vector by π radians around the z-axis.'
          },
          {
            question: 'What is the Bloch vector (r_x, r_y, r_z) coordinates of the state |i⟩ = (|0⟩ + i|1⟩)/√2?',
            options: [
              '(1, 0, 0)',
              '(0, 1, 0)',
              '(0, 0, 1)',
              '(0, -1, 0)'
            ],
            correct: 1,
            explanation: '⟨i|σ_x|i⟩ = 0, ⟨i|σ_y|i⟩ = 1, ⟨i|σ_z|i⟩ = 0. Thus, |i⟩ points directly along the positive Y-axis: (0, 1, 0).'
          },
          {
            question: 'If two pure states |ψ⟩ and |φ⟩ are orthogonal (⟨ψ|φ⟩ = 0), what is the geometric angle between their Bloch vectors on the sphere?',
            options: [
              '90° (orthogonal)',
              '180° (diametrically opposite / antipodal)',
              '45°',
              '0°'
            ],
            correct: 1,
            explanation: 'The inner product satisfies |⟨ψ|φ⟩|² = (1 + r⃗_ψ · r⃗_φ)/2. When orthogonal, r⃗_ψ · r⃗_φ = -1, meaning an angle of 180°.'
          }
        ]
      }
    },

    // --- 4. HILBERT SPACE ---
    'hilbert-space': {
      normal: {
        title: 'Hilbert Space Fundamentals Quiz',
        description: 'Grasp the complex inner product vector spaces underlying quantum mechanics.',
        questions: [
          {
            question: 'What is the dimension of the composite Hilbert space for an n-qubit quantum register?',
            options: [
              '2n',
              '2ⁿ',
              'n²',
              'n!'
            ],
            correct: 1,
            explanation: 'By the tensor product rule ℋ_total = ℋ₁ ⊗ ℋ₂ ⊗ ... ⊗ ℋ_n, a system of n two-dimensional qubits spans a 2ⁿ-dimensional complex space.'
          },
          {
            question: 'For two state vectors |u⟩ and |v⟩ in Hilbert space, what property does the inner product ⟨u|v⟩ satisfy when taking its complex conjugate?',
            options: [
              '⟨u|v⟩* = -⟨u|v⟩',
              '⟨u|v⟩* = ⟨v|u⟩ (conjugate symmetry)',
              '⟨u|v⟩* = ⟨u|v⟩',
              'Inner products must be purely real'
            ],
            correct: 1,
            explanation: 'A complex Hilbert space inner product satisfies skew/conjugate symmetry: ⟨u|v⟩* = ⟨v|u⟩.'
          },
          {
            question: 'What mathematical condition must all state vectors satisfy in a physical Hilbert space?',
            options: [
              'Non-zero trace',
              'Finite norm (square-integrable / unit norm: ⟨ψ|ψ⟩ = 1)',
              'Eigenvalues greater than 10',
              'Strictly integer components'
            ],
            correct: 1,
            explanation: 'States representing probability distributions must be square-integrable and normalized such that ⟨ψ|ψ⟩ = 1.'
          }
        ]
      },
      secret: {
        title: 'Hilbert Space Mastery: Dual Spaces & Tensor Products',
        description: 'Prove linear operator properties, bras, kets, and outer product completeness.',
        questions: [
          {
            question: 'What is the completeness relation (resolution of identity) for an orthonormal basis {|i⟩} spanning Hilbert space ℋ?',
            options: [
              '∑_i ⟨i|i⟩ = 1',
              '∑_i |i⟩⟨i| = I (Identity operator)',
              '∏_i |i⟩ = 0',
              '∑_i |i⟩|i⟩ = I'
            ],
            correct: 1,
            explanation: 'The resolution of identity states that the sum of outer products of an orthonormal basis equals the identity operator: ∑_i |i⟩⟨i| = I.'
          },
          {
            question: 'How is the dual vector ⟨ψ| (the "bra") constructed from the column vector |ψ⟩ in a finite-dimensional Hilbert space?',
            options: [
              'Simple matrix transpose without conjugate',
              'Conjugate transpose (Hermitian adjoint): ⟨ψ| = |ψ⟩†',
              'Inverse matrix: ⟨ψ| = |ψ⟩⁻¹',
              'Dividing each element by 2'
            ],
            correct: 1,
            explanation: 'By the Riesz representation theorem, linear functionals correspond to vectors via the conjugate transpose: |ψ⟩† = (c₁*, c₂*, ...).'
          },
          {
            question: 'For two Hilbert spaces ℋ_A and ℋ_B with dimensions d_A and d_B, the tensor product ℋ_A ⊗ ℋ_B has dimension:',
            options: [
              'd_A + d_B',
              'd_A · d_B',
              '(d_A)^(d_B)',
              'max(d_A, d_B)'
            ],
            correct: 1,
            explanation: 'The tensor product of vector spaces multiplies dimensions: dim(ℋ_A ⊗ ℋ_B) = dim(ℋ_A) × dim(ℋ_B).'
          }
        ]
      }
    },

    // ============================================================
    // TOPIC 2: WORKING WITH QUBITS
    // ============================================================

    // --- 1. SINGLE GATES ---
    'single-gates': {
      normal: {
        title: 'Single-Qubit Gates Quiz',
        description: 'Test your grasp of single-qubit unitary operations, Pauli gates, and phase shifts.',
        questions: [
          {
            question: 'What is the action of the Pauli-X gate on the computational basis state |0⟩?',
            options: [
              'Leaves it unchanged as |0⟩',
              'Flips it to |1⟩ (acting as a quantum NOT gate)',
              'Creates an equal superposition |+⟩',
              'Multiplies it by phase factor i'
            ],
            correct: 1,
            explanation: 'Pauli-X = [[0, 1], [1, 0]]. Applying X|0⟩ yields |1⟩, and X|1⟩ yields |0⟩.'
          },
          {
            question: 'What mathematical property must every valid quantum gate operator U satisfy?',
            options: [
              'U must be singular (det(U) = 0)',
              'U must be unitary (U†U = UU† = I)',
              'All matrix elements must be real integers',
              'U must commute with all observables'
            ],
            correct: 1,
            explanation: 'Unitary evolution preserves the total probability norm ⟨ψ|U†U|ψ⟩ = ⟨ψ|ψ⟩ = 1 and ensures reversibility.'
          },
          {
            question: 'Which gate applies a π/2 phase rotation: |0⟩ → |0⟩, |1⟩ → i|1⟩?',
            options: [
              'Hadamard (H) Gate',
              'Phase (S) Gate',
              'T Gate (π/4)',
              'Pauli-Z Gate'
            ],
            correct: 1,
            explanation: 'The S gate (often called the phase gate) is defined as diag(1, i) = diag(1, e^(iπ/2)).'
          }
        ]
      },
      secret: {
        title: 'Single Gates Mastery: Commutators & SU(2) Algebra',
        description: 'Calculate matrix exponentials, non-commuting gates, and Clifford group gates.',
        questions: [
          {
            question: 'What is the commutator [X, Z] = XZ − ZX of the Pauli-X and Pauli-Z gates?',
            options: [
              '0 (they commute)',
              '−2iY',
              '+2iY',
              '2I'
            ],
            correct: 1,
            explanation: 'XZ = −iY, and ZX = iY. Therefore, [X, Z] = XZ − ZX = −iY − iY = −2iY.'
          },
          {
            question: 'If you apply the gate sequence H · Z · H to an arbitrary qubit, what single Pauli gate is equivalent to this operation?',
            options: [
              'Pauli-X Gate',
              'Pauli-Y Gate',
              'Identity Gate',
              'Phase-S Gate'
            ],
            correct: 0,
            explanation: 'H Z H = X. The Hadamard transforms between the Z and X bases: HZH = X and HXH = Z.'
          },
          {
            question: 'The T gate satisfies what algebraic relationship with respect to the Pauli-Z gate?',
            options: [
              'T² = Z',
              'T⁴ = Z',
              'T = Z',
              'T³ = Z'
            ],
            correct: 1,
            explanation: 'T = diag(1, e^(iπ/4)). Squaring gives T² = S = diag(1, e^(iπ/2)), and squaring again gives T⁴ = Z = diag(1, -1).'
          }
        ]
      }
    },

    // --- 2. DOUBLE GATES ---
    'double-gates': {
      normal: {
        title: 'Two-Qubit Controlled Gates Quiz',
        description: 'Understand controlled-NOT, phase-kickback, and multi-qubit truth tables.',
        questions: [
          {
            question: 'In a standard CNOT gate where qubit 0 is control and qubit 1 is target, what is the output state when input is |10⟩?',
            options: [
              '|10⟩',
              '|11⟩',
              '|01⟩',
              '|00⟩'
            ],
            correct: 1,
            explanation: 'Because control qubit 0 is |1⟩, target qubit 1 is flipped from |0⟩ to |1⟩, yielding |11⟩.'
          },
          {
            question: 'What does the Controlled-Z (CZ) gate do to the state |11⟩?',
            options: [
              'Flips target to |10⟩',
              'Multiplies the state by −1: |11⟩ → −|11⟩',
              'Swaps the two qubits',
              'Creates ground state |00⟩'
            ],
            correct: 1,
            explanation: 'CZ = diag(1, 1, 1, −1). It applies a −1 phase factor if and only if both qubits are in the |1⟩ state.'
          },
          {
            question: 'Which two-qubit gate swaps the states of two qubits: |ab⟩ → |ba⟩?',
            options: [
              'Toffoli Gate',
              'SWAP Gate',
              'Hadamard Gate',
              'Fredkin Gate'
            ],
            correct: 1,
            explanation: 'The SWAP gate can be decomposed into three alternating CNOT gates: CNOT(0,1) · CNOT(1,0) · CNOT(0,1).'
          }
        ]
      },
      secret: {
        title: 'Double Gates Mastery: Phase Kickback & Universality',
        description: 'Advanced analysis of target-to-control phase kickback and circuit decomposition.',
        questions: [
          {
            question: 'When a CNOT gate is applied with control in state |+⟩ and target in state |−⟩, what remarkable phenomenon occurs?',
            options: [
              'The target qubit flips to |+⟩',
              'Phase kickback: the −1 phase kicks back to the control qubit, flipping control from |+⟩ to |−⟩ while target stays |−⟩',
              'The qubits become completely uncoupled',
              'Both qubits collapse to |0⟩'
            ],
            correct: 1,
            explanation: 'Phase kickback: CNOT(|+⟩|−⟩) = |−⟩|−⟩. The eigenvalue −1 of the target under X transforms the control state.'
          },
          {
            question: 'How many two-qubit CNOT gates are minimal to construct a SWAP gate?',
            options: [
              '1',
              '2',
              '3',
              '4'
            ],
            correct: 2,
            explanation: 'SWAP = CNOT_{0→1} · CNOT_{1→0} · CNOT_{0→1}. Exactly three CNOT gates are necessary and sufficient.'
          },
          {
            question: 'Together with arbitrary single-qubit rotations, which two-qubit entangling gate forms a universal gate set for quantum computation?',
            options: [
              'Measurement in Z basis',
              'CNOT gate (or CZ gate)',
              'Classical AND gate',
              'Identity operator'
            ],
            correct: 1,
            explanation: 'The Barenco et al. theorem (1995) established that single-qubit gates plus CNOT form a universal set.'
          }
        ]
      }
    },

    // --- 3. ENTANGLEMENT ---
    'entanglement': {
      normal: {
        title: 'Quantum Entanglement Quiz',
        description: 'Explore EPR pairs, non-separable states, and quantum correlations.',
        questions: [
          {
            question: 'Which of the following two-qubit states is maximally entangled (a Bell state)?',
            options: [
              '|00⟩',
              '(|00⟩ + |11⟩)/√2',
              '(|00⟩ + |01⟩)/√2',
              '|11⟩'
            ],
            correct: 1,
            explanation: 'The state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 cannot be factored into independent product states |ψ_A⟩ ⊗ |ψ_B⟩.'
          },
          {
            question: 'If two qubits are in the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 and Alice measures qubit 1 and obtains |1⟩, what state is Bob’s qubit in instantaneously?',
            options: [
              '50% chance of |0⟩, 50% chance of |1⟩',
              'Deterministically |1⟩',
              'Deterministically |0⟩',
              'It remains in superposition'
            ],
            correct: 1,
            explanation: 'The measurement projects the joint state onto |11⟩, ensuring Bob’s outcome is perfectly correlated with Alice’s.'
          },
          {
            question: 'Can quantum entanglement be used to transmit classical information faster than the speed of light?',
            options: [
              'Yes, instantaneous quantum communication is standard',
              'No, the No-Communication Theorem proves local measurement statistics cannot transmit signals without a classical channel',
              'Only when using more than 100 qubits',
              'Yes, by encoding binary pulses in the phase'
            ],
            correct: 1,
            explanation: 'The No-Communication Theorem ensures relativity holds: local density operators ρ_B remain identical regardless of Alice’s measurement basis.'
          }
        ]
      },
      secret: {
        title: 'Entanglement Mastery: Schmidt Rank & Bell Inequalities',
        description: 'Rigorous testing on Schmidt decomposition, CHSH violation, and von Neumann entropy.',
        questions: [
          {
            question: 'In the CHSH inequality |⟨QS⟩ + ⟨RS⟩ + ⟨RT⟩ − ⟨QT⟩| ≤ 2 for local hidden variable theories, what is Tsirelson’s maximal quantum bound?',
            options: [
              '2',
              '2√2 ≈ 2.828',
              '4',
              'π'
            ],
            correct: 1,
            explanation: 'Tsirelson’s bound demonstrates that quantum entanglement can violate local realism up to exactly 2√2.'
          },
          {
            question: 'For a bipartite pure state |ψ_AB⟩, what condition on the reduced density matrix ρ_A = Tr_B(|ψ_AB⟩⟨ψ_AB|) indicates maximal entanglement?',
            options: [
              'ρ_A is a pure state projector (Tr(ρ_A²) = 1)',
              'ρ_A is proportional to identity (maximally mixed: ρ_A = I/2)',
              'ρ_A has zero eigenvalues',
              'ρ_A is non-Hermitian'
            ],
            correct: 1,
            explanation: 'When the subsystems are maximally entangled, tracing out one subsystem leaves the other in a maximally mixed state ρ_A = I/2.'
          },
          {
            question: 'What is the Schmidt rank of a separable (unentangled) pure state |ψ_AB⟩ = |a⟩ ⊗ |b⟩?',
            options: [
              '0',
              '1',
              '2',
              'Infinite'
            ],
            correct: 1,
            explanation: 'The Schmidt rank is the number of non-zero coefficients in the Schmidt decomposition. A product state has rank 1; entangled states have rank ≥ 2.'
          }
        ]
      }
    },

    // --- 4. CIRCUITS ---
    'circuits': {
      normal: {
        title: 'Quantum Circuits Architecture Quiz',
        description: 'Test your understanding of quantum timeline diagrams, gate sequences, and readout.',
        questions: [
          {
            question: 'In standard quantum circuit diagrams, what does a horizontal line represent?',
            options: [
              'A classical voltage ground',
              'The timeline / wire of a single qubit evolving from left to right',
              'An optical laser beam',
              'A feedback loop'
            ],
            correct: 1,
            explanation: 'Quantum circuits depict qubits as parallel horizontal wires evolving under unitary operators from left (initialization) to right (readout).'
          },
          {
            question: 'What standard canonical circuit creates the Bell state |Φ⁺⟩ from initial state |00⟩?',
            options: [
              'X on qubit 0, followed by X on qubit 1',
              'Hadamard on qubit 0, followed by CNOT with qubit 0 as control and qubit 1 as target',
              'CNOT followed by Hadamard on both qubits',
              'Z gate followed by SWAP gate'
            ],
            correct: 1,
            explanation: '|00⟩ --[H on q0]--> (|0⟩+|1⟩)|0⟩/√2 = (|00⟩+|10⟩)/√2 --[CNOT 0->1]--> (|00⟩+|11⟩)/√2.'
          },
          {
            question: 'What does a meter icon at the end of a quantum circuit wire signify?',
            options: [
              'Circuit cooling reset',
              'Projective measurement collapsing the quantum state to a classical bit',
              'Checking error rates without collapsing the state',
              'Clock cycle trigger'
            ],
            correct: 1,
            explanation: 'The meter icon represents projective measurement, which collapses the state amplitude into a classical 0 or 1 result.'
          }
        ]
      },
      secret: {
        title: 'Circuits Mastery: Circuit Depth & Quantum Teleportation',
        description: 'Master circuit compilation, gate depth parallelization, and algorithm subroutines.',
        questions: [
          {
            question: 'In quantum circuit complexity, what is the definition of "circuit depth"?',
            options: [
              'The total number of qubits in the register',
              'The maximum number of sequential gate time-steps along any path from input to output',
              'The physical length of the cryogenic dilution cable',
              'The number of measurements performed'
            ],
            correct: 1,
            explanation: 'Circuit depth measures the runtime: independent gates applied in parallel on separate qubits count as a single time-step.'
          },
          {
            question: 'In the standard Quantum Teleportation circuit, how many classical bits must Alice transmit to Bob to reconstruct an unknown state |ψ⟩?',
            options: [
              '0 (it happens without communication)',
              '1 classical bit',
              '2 classical bits',
              'Infinite classical bits'
            ],
            correct: 2,
            explanation: 'Alice measures her two qubits in the Bell basis, yielding 2 classical bits (00, 01, 10, or 11), which dictate Bob’s recovery unitary: I, X, Z, or ZX.'
          },
          {
            question: 'Why does circuit synthesis prioritize minimizing the total number of two-qubit (e.g. CNOT) gates in NISQ-era quantum computing?',
            options: [
              'Two-qubit gates run at slower clock speeds by definition',
              'Two-qubit gates have significantly higher error rates (lower fidelity) and take longer, accumulating decoherence noise',
              'Two-qubit gates require classical internet connections',
              'Compilers cannot optimize more than three gates'
            ],
            correct: 1,
            explanation: 'In physical hardware, two-qubit gate fidelities (~99-99.9%) are an order of magnitude lower than single-qubit gates (~99.99%), making them the primary source of algorithm infidelity.'
          }
        ]
      }
    }
  };

  /**
   * Fetch quiz package
   * @param {string} badgeId
   * @param {string} type - 'normal' | 'secret'
   */
  function getQuiz(badgeId, type = 'normal') {
    const badgePackage = QUIZZES[badgeId];
    if (!badgePackage) return null;
    return badgePackage[type] || null;
  }

  return {
    QUIZZES,
    getQuiz
  };
})();

// Attach to window
if (typeof window !== 'undefined') {
  window.BadgeQuizzes = BadgeQuizzes;
}
