import React from 'react';
import { useUserStore } from './state/userStore';
import { Navbar } from './components/Shared/Navbar';
import { Sidebar } from './components/Shared/Sidebar';
import { ToastContainer } from './components/Shared/ToastContainer';
import { ChatDrawer } from './components/MascotChat/ChatDrawer';
import { FloatingSchro } from './components/MascotChat/FloatingSchro';

// Pages
import { OnboardingPage } from './pages/Onboarding';
import { DashboardPage } from './pages/Dashboard';
import { NewbieJourneyPage } from './pages/NewbieJourney';
import { SandboxPage } from './pages/Sandbox';

export function App() {
  const currentRoute = useUserStore(s => s.currentRoute);

  const renderActivePage = () => {
    switch (currentRoute) {
      case 'onboarding':
        return <OnboardingPage />;
      case 'lesson':
        return <NewbieJourneyPage />;
      case 'sandbox':
        return <SandboxPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  const isWideLayout = currentRoute === 'sandbox';

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Background Star Canvas & Chalk Grid */}
      <div className="bg-stars" aria-hidden="true" />

      {/* Global Top Navbar */}
      <Navbar />

      {/* Global Lab Sidebar (Desktop) */}
      {!isWideLayout && <Sidebar />}

      {/* Main Page Canvas with Layout Padding */}
      <div style={{
        paddingTop: '72px',
        paddingLeft: !isWideLayout ? '260px' : '0',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        {renderActivePage()}
      </div>

      {/* Interactive Mascot Chat Drawer */}
      <ChatDrawer />

      {/* Floating Schrö Button & Proactive Nudge */}
      <FloatingSchro />

      {/* Toast Notification Queue */}
      <ToastContainer />
    </div>
  );
}

export default App;
