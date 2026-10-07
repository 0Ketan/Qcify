import React, { useState } from 'react';
import { useUserStore, userStore } from '../../state/userStore';
import { api } from '../../services/api';
import { GatePalette } from '../../components/CircuitBuilder/GatePalette';
import { CircuitGrid } from '../../components/CircuitBuilder/CircuitGrid';
import { StateHistogram } from '../../components/CircuitBuilder/StateHistogram';
import { BlochSphereView } from '../../components/CircuitBuilder/BlochSphereView';
import { SchroMascot } from '../../components/Shared/SchroMascot';

export function SandboxPage() {
  const circuit = useUserStore(s => s.circuit);
  const [selectedGate, setSelectedGate] = useState('H');
  const [backend, setBackend] = useState('qiskit_aer');
  const [shots, setShots] = useState(1024);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('probabilities'); // 'probabilities' | 'bloch' | 'qasm'

  const handleRun = async () => {
    setIsRunning(true);
    userStore.setSchroExpression('thinking');

    try {
      const payload = {
        num_qubits: circuit.numQubits,
        gates: circuit.gates.map(g => ({
          name: g.name,
          target: g.target,
          control: g.control,
          step: g.step
        })),
        shots,
        backend_name: backend
      };

      const res = await api.simulateCircuit(payload);

      userStore.setCircuitResults({
        probabilities: res.probabilities,
        counts: res.counts,
        blochVectors: res.bloch_vectors
      });

      userStore.addXP(20);
      userStore.unlockBadge('gate_maker');

      // Check if Bell state was created
      if (circuit.gates.some(g => g.name === 'H') && circuit.gates.some(g => g.name === 'CNOT')) {
        userStore.unlockBadge('entangler');
      }

      userStore.setSchroExpression('excited');
      userStore.showToast(`Simulation completed in ${res.execution_time_ms}ms on ${res.backend_used}! ⚛️`, 'lime', 3000);
    } catch (err) {
      userStore.showToast('Error during simulation run: ' + err.message, 'default');
      userStore.setSchroExpression('idle');
    } finally {
      setIsRunning(false);
    }
  };

  const loadPreset = (presetName) => {
    if (presetName === 'bell') {
      userStore.setState(s => ({
        circuit: {
          ...s.circuit,
          numQubits: 2,
          gates: [
            { id: 'p1', name: 'H', target: 0, control: null, step: 0 },
            { id: 'p2', name: 'CNOT', target: 1, control: 0, step: 1 }
          ]
        }
      }));
      userStore.showToast('Loaded Bell State (|Φ⁺⟩ = (|00⟩+|11⟩)/√2) preset! 🌀', 'lime');
    } else if (presetName === 'superposition') {
      userStore.setState(s => ({
        circuit: {
          ...s.circuit,
          numQubits: 1,
          gates: [
            { id: 'p1', name: 'H', target: 0, control: null, step: 0 }
          ]
        }
      }));
      userStore.showToast('Loaded Single-Qubit Superposition preset! 🔮', 'default');
    } else if (presetName === 'ghz') {
      userStore.setState(s => ({
        circuit: {
          ...s.circuit,
          numQubits: 3,
          gates: [
            { id: 'p1', name: 'H', target: 0, control: null, step: 0 },
            { id: 'p2', name: 'CNOT', target: 1, control: 0, step: 1 },
            { id: 'p3', name: 'CNOT', target: 2, control: 1, step: 2 }
          ]
        }
      }));
      userStore.showToast('Loaded 3-Qubit GHZ State preset! ⚡', 'reward');
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '24px auto', padding: '0 24px' }}>
      {/* Top Banner / Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div className="card-sketch-tag">QUANTUM CIRCUIT COMPOSER & QISKIT RUNNER</div>
          <h2>Quantum Sandbox Lab ⚗️</h2>
        </div>

        {/* Toolbar Presets & Run Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => loadPreset('bell')} className="btn btn-ghost btn-sm">
              Bell State
            </button>
            <button onClick={() => loadPreset('superposition')} className="btn btn-ghost btn-sm">
              Superposition
            </button>
            <button onClick={() => loadPreset('ghz')} className="btn btn-ghost btn-sm">
              GHZ State
            </button>
          </div>

          {/* Backend Selector */}
          <select
            value={backend}
            onChange={(e) => setBackend(e.target.value)}
            style={{
              background: 'var(--surface-raised)',
              border: '1px dashed var(--stroke-chalk)',
              borderRadius: 'var(--radius-imperfect)',
              padding: '8px 12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value="qiskit_aer">Qiskit Aer (Local)</option>
            <option value="statevector_exact">Analytical Statevector</option>
            <option value="ibm_falcon_mock">IBM Quantum Falcon (Mock)</option>
          </select>

          {/* Shots Selector */}
          <select
            value={shots}
            onChange={(e) => setShots(Number(e.target.value))}
            style={{
              background: 'var(--surface-raised)',
              border: '1px dashed var(--stroke-chalk)',
              borderRadius: 'var(--radius-imperfect)',
              padding: '8px 12px',
              color: 'var(--text)',
              fontFamily: 'var(--font-code)',
              fontSize: '12px',
              outline: 'none'
            }}
          >
            <option value={1024}>1024 shots</option>
            <option value={2048}>2048 shots</option>
            <option value={4096}>4096 shots</option>
          </select>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="btn btn-primary btn-md"
            style={{ minWidth: '150px' }}
          >
            {isRunning ? 'Simulating...' : '⚡ Run Simulation'}
          </button>
        </div>
      </div>

      {/* 2-Column Lab Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)',
        gap: '24px'
      }}>
        {/* Left Side: Palette & Circuit Composer Wire Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <GatePalette
            selectedGate={selectedGate}
            onSelectGate={setSelectedGate}
          />

          <CircuitGrid
            circuit={circuit}
            selectedGate={selectedGate}
          />
        </div>

        {/* Right Side: Simulation Results & Statevector Visualization */}
        <div className="card-sketch tape-cyan" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="card-sketch-tag">OBSERVATION CHAMBER</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setActiveTab('probabilities')}
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: '11px',
                  color: activeTab === 'probabilities' ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: activeTab === 'probabilities' ? '2px solid var(--accent)' : 'none'
                }}
              >
                Histogram
              </button>
              <button
                onClick={() => setActiveTab('bloch')}
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: '11px',
                  color: activeTab === 'bloch' ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: activeTab === 'bloch' ? '2px solid var(--accent)' : 'none'
                }}
              >
                Bloch Sphere
              </button>
            </div>
          </div>

          {activeTab === 'probabilities' ? (
            <div>
              <h4 style={{ marginBottom: '12px' }}>Measurement Outcome Probabilities</h4>
              <StateHistogram
                probabilities={circuit.results?.probabilities}
                counts={circuit.results?.counts}
              />
            </div>
          ) : (
            <div>
              <h4 style={{ marginBottom: '12px' }}>Single-Qubit Bloch Coordinates</h4>
              <BlochSphereView
                blochVectors={circuit.results?.blochVectors}
              />
            </div>
          )}

          {/* Quick Mascot Tip Box */}
          <div style={{
            marginTop: 'auto',
            padding: '14px',
            background: 'var(--surface-raised)',
            border: '1px dashed var(--stroke-chalk)',
            borderRadius: 'var(--radius-imperfect)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <SchroMascot expression="encouraging" size={44} />
            <div style={{ fontSize: '12px', color: 'var(--text-chalk)', lineHeight: 1.4 }}>
              <strong>Schrö's Laboratory Note:</strong> Place an H gate on wire 0, then a CNOT targeting wire 1 to witness maximal entanglement! 🐱
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
