import React from 'react';

export class SimulationBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Simulation error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          background: 'var(--surface-raised, #111)',
          border: '2px dashed var(--error, #ef4444)',
          borderRadius: 'var(--radius-imperfect, 8px)',
          textAlign: 'center',
          color: 'var(--text, #fff)'
        }}>
          <h3>Simulation Failed to Load</h3>
          <p style={{ color: 'var(--text-chalk, #94a3b8)', marginBottom: '16px' }}>
            Don't worry, the rest of the app is safe! We've decoupled this component.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Retry Loading
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

