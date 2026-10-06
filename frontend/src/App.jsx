const views = ["Onboarding", "Dashboard", "NewbieJourney", "Sandbox"];

function App() {
  return (
    <main>
      <h1>AI-Based Interactive Quantum Learning Platform</h1>
      <p>Routing placeholders:</p>
      <ul>
        {views.map((view) => (
          <li key={view}>{view}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
