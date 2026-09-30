import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from './context/UserContext';
import { OrangeredBackground } from './components/OrangeredBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CoursesDraftPage } from './pages/CoursesDraftPage';
import { GamesDraftPage } from './pages/GamesDraftPage';
import { StampsLeaderboardDraftPage } from './pages/StampsLeaderboardDraftPage';
import { MarketplaceDraftPage } from './pages/MarketplaceDraftPage';
import { InfoPage } from './pages/InfoPage';
import { MapPin } from 'lucide-react';
import './App.css';

function AppContent() {
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleNavigate = (sectionId) => {
    setCurrentSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            selectedState={selectedState}
            onOpenStateSelector={() => {
              // Can trigger state selector modal or explore
              handleNavigate('explore');
            }}
          />
        );
      case 'explore':
        return (
          <ExplorePage 
            selectedState={selectedState}
            onNotify={showToast}
          />
        );
      case 'courses':
        return <CoursesDraftPage onNavigate={handleNavigate} />;
      case 'games':
        return <GamesDraftPage onNavigate={handleNavigate} />;
      case 'stamps-leaderboard':
        return <StampsLeaderboardDraftPage onNavigate={handleNavigate} />;
      case 'marketplace':
        return <MarketplaceDraftPage onNavigate={handleNavigate} />;
      case 'info':
        return <InfoPage onNavigate={handleNavigate} />;
      default:
        return (
          <HomePage 
            onNavigate={handleNavigate} 
            selectedState={selectedState}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Interactive Orangered Animated Particle Canvas */}
      <OrangeredBackground />

      {/* Main Navigation Bar / Header Terminal */}
      <Navbar 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
        selectedState={selectedState}
        onSelectState={setSelectedState}
        onNotify={showToast}
      />

      {/* Main Dynamic View */}
      <main className="main-content">
        {renderSection()}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <MapPin size={18} fill="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <UserProvider>
      <AppContent />
      <Analytics />
    </UserProvider>
  );
}

export default App;
