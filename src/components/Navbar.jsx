import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Gamepad2, 
  Trophy, 
  ShoppingBag, 
  Info, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ArrowRight,
  MapPin,
  ChevronDown,
  Zap
} from 'lucide-react';
import { isSoundEnabled, toggleSound, playClick } from '../utils/audio';
import { StateSelectorModal } from './StateSelectorModal';
import { UserDataModal } from './UserDataModal';
import { useUser } from '../context/UserContext';

export function Navbar({ 
  currentSection, 
  onNavigate, 
  selectedState = 'Maharashtra',
  onSelectState,
  onNotify
}) {
  const { userData, isUserModalOpen, setIsUserModalOpen } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'explore', label: 'Explore', icon: Compass, isHighlighted: true },
    { id: 'courses', label: 'Courses', icon: GraduationCap, isDraft: true },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, isLive: true },
    { id: 'games', label: 'Games', icon: Gamepad2, isDraft: true },
    { id: 'stamps-leaderboard', label: 'Stamps & Ranks', icon: Trophy, isDraft: true, fullName: 'Stamps & Leaderboard' },
    { id: 'info', label: 'Info', icon: Info },
  ];

  const handleNavClick = (id) => {
    playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      borderBottom: '1.5px solid rgba(255, 85, 0, 0.18)',
      boxShadow: '0 4px 20px rgba(255, 85, 0, 0.05)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        
        {/* Logo & Brand Identity */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', textDecoration: 'none' }}
        >
          <div style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid #FF5500',
            boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)',
            flexShrink: 0
          }}>
            <img 
              src="/logo.jpg" 
              alt="Indiverse Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '1.45rem', 
                fontWeight: '900', 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #0F172A 30%, #FF5500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                INDIVERSE
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'rgba(255, 85, 0, 0.12)',
                color: '#FF5500',
                border: '1px solid rgba(255, 85, 0, 0.35)',
                fontWeight: '800',
                letterSpacing: '0.04em'
              }}>
                GEN Z
              </span>
            </div>
            <p style={{ 
              fontSize: '0.72rem', 
              color: '#64748B', 
              margin: 0, 
              display: 'none', 
              letterSpacing: '0.01em',
              fontWeight: '600'
            }} className="brand-subtitle">
              From Dadi’s Lap to Your Lock Screen
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? '#FFFFFF' : item.isHighlighted ? '#FF5500' : '#334155',
                  background: isActive 
                    ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                    : item.isHighlighted 
                      ? 'rgba(255, 85, 0, 0.08)' 
                      : 'transparent',
                  border: isActive 
                    ? '1px solid #FF5500' 
                    : item.isHighlighted 
                      ? '1px dashed rgba(255, 85, 0, 0.4)' 
                      : '1px solid transparent',
                  boxShadow: isActive ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#FF5500';
                    e.currentTarget.style.background = 'rgba(255, 85, 0, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = item.isHighlighted ? '#FF5500' : '#334155';
                    e.currentTarget.style.background = item.isHighlighted ? 'rgba(255, 85, 0, 0.08)' : 'transparent';
                  }
                }}
              >
                <Icon size={16} color={isActive ? '#FFFFFF' : item.isHighlighted ? '#FF5500' : 'currentColor'} />
                <span>{item.label}</span>
                {item.isDraft && (
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 140, 0, 0.15)',
                    color: isActive ? '#FFFFFF' : '#D97706',
                    fontWeight: '800'
                  }}>
                    Draft
                  </span>
                )}
                {item.isLive && (
                  <span style={{
                    fontSize: '0.62rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255, 255, 255, 0.28)' : '#DCFCE7',
                    color: isActive ? '#FFFFFF' : '#15803D',
                    border: isActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid #86EFAC',
                    fontWeight: '900'
                  }}>
                    LIVE
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Terminal: State / UT Selector & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* State / UT Selector Pill (Replacing Streak & XP) */}
          <button
            onClick={() => {
              playClick();
              setIsStateModalOpen(true);
            }}
            title="Click to select State or Union Territory (Currently active: Maharashtra)"
            className="state-selector-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(255, 85, 0, 0.35)',
              boxShadow: '0 2px 12px rgba(255, 85, 0, 0.1)',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 85, 0, 0.35)',
              flexShrink: 0
            }}>
              <MapPin size={14} color="#FFFFFF" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.1 }}>
              <span style={{ 
                fontSize: '0.6rem', 
                color: '#64748B', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em' 
              }}>
                State / UT
              </span>
              <span style={{ 
                fontSize: '0.85rem', 
                color: '#0F172A', 
                fontWeight: '800',
                letterSpacing: '-0.01em'
              }}>
                {selectedState}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#DCFCE7',
              border: '1px solid #86EFAC',
              padding: '2px 7px',
              borderRadius: '999px',
              fontSize: '0.65rem',
              fontWeight: '800',
              color: '#15803D'
            }}>
              <span style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#22C55E'
              }} className="pulse-green" />
              <span>Pilot</span>
            </div>

            <ChevronDown size={14} color="#FF5500" />
          </button>

          {/* User Data & XP Pill (Reset to 0 XP & 0 Courses) */}
          <button
            onClick={() => {
              playClick();
              setIsUserModalOpen(true);
            }}
            title="Click to view User Data: XP, completed courses and badges"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(255, 85, 0, 0.35)',
              boxShadow: '0 2px 12px rgba(255, 85, 0, 0.08)',
              cursor: 'pointer',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDE047',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              flexShrink: 0
            }}>
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : userData.presetAvatar ? (
                <span style={{ fontSize: '12px' }}>{userData.presetAvatar}</span>
              ) : (
                <Zap size={13} fill="#FDE047" color="#FDE047" />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', lineHeight: 1.1 }}>
              <span style={{ 
                fontSize: '0.6rem', 
                color: '#64748B', 
                fontWeight: '800', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em' 
              }}>
                User Data
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <strong style={{ 
                  fontSize: '0.82rem', 
                  color: '#0F172A', 
                  fontWeight: '900',
                  letterSpacing: '-0.01em'
                }}>
                  {userData.xp} XP
                </strong>
                <span style={{ color: '#CBD5E1', fontSize: '0.7rem' }}>•</span>
                <span style={{ 
                  fontSize: '0.74rem', 
                  color: userData.completedCourses.length > 0 ? '#16A34A' : '#64748B', 
                  fontWeight: '800' 
                }}>
                  {userData.completedCourses.length} Done
                </span>
              </div>
            </div>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? "Mute interactive audio" : "Enable Indian sitar harmonics & chimes"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: soundOn ? '#FFF5F0' : '#F8FAFC',
              border: `1.5px solid ${soundOn ? 'rgba(255, 85, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`,
              color: soundOn ? '#FF5500' : '#64748B',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#FFF5F0',
              border: '1.5px solid rgba(255, 85, 0, 0.3)',
              color: '#FF5500',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '2px solid rgba(255, 85, 0, 0.25)',
          padding: '16px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '6px', paddingBottom: '10px', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
            <p style={{ fontSize: '0.85rem', color: '#FF5500', margin: 0, fontWeight: '700' }}>
              From Dadi’s Lap to Your Lock Screen
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0' }}>
              Culture, Reimagined for Gen Z
            </p>
          </div>

          {/* Mobile State Selector Button */}
          <button
            onClick={() => {
              playClick();
              setIsStateModalOpen(true);
              setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEFE8 100%)',
              border: '1.5px solid rgba(255, 85, 0, 0.35)',
              marginBottom: '6px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#FF5500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <MapPin size={16} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>Active Region</div>
                <div style={{ fontSize: '0.92rem', color: '#0F172A', fontWeight: '800' }}>{selectedState}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: '0.68rem',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid #86EFAC'
              }}>
                🟢 Live Pilot
              </span>
              <ChevronDown size={15} color="#FF5500" />
            </div>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: isActive ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : '#FFF9F6',
                  border: isActive ? '1px solid #FF5500' : '1px solid rgba(255, 85, 0, 0.15)',
                  color: isActive ? '#FFFFFF' : '#0F172A',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '700' : '600'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? '#FFFFFF' : '#FF5500'} />
                  <span>{item.fullName || item.label}</span>
                </div>
                {item.isDraft ? (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 140, 0, 0.15)',
                    color: isActive ? '#FFFFFF' : '#D97706',
                    fontWeight: '800'
                  }}>
                    Draft
                  </span>
                ) : (
                  <ArrowRight size={14} color={isActive ? '#FFFFFF' : '#FF5500'} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* State / UT Selector Modal */}
      <StateSelectorModal
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        selectedState={selectedState}
        onSelectState={onSelectState}
        onNotify={onNotify}
      />

      {/* User Data Modal (0 XP & 0 Courses Initial State) */}
      <UserDataModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onNavigate={onNavigate}
        onNotify={onNotify}
      />
    </header>
  );
}

export default Navbar;
