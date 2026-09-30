import React from 'react';
import { Sparkles, Heart, Compass, Shield, Globe2, ArrowUpRight } from 'lucide-react';
import { playClick, playSitarChord } from '../utils/audio';

export function Footer({ onNavigate }) {
  const handleNav = (sec) => {
    playClick();
    onNavigate(sec);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      marginTop: '100px',
      borderTop: '1.5px solid rgba(255, 85, 0, 0.25)',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F2 100%)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 -10px 30px rgba(255, 85, 0, 0.04)'
    }}>
      {/* Decorative top glowing line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #FF5500, #FFA000, transparent)',
        boxShadow: '0 0 15px rgba(255, 85, 0, 0.5)'
      }} />

      <div className="container" style={{ padding: '60px 24px 30px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Brand Info & Motto */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                overflow: 'hidden',
                border: '2px solid #FF5500',
                boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)',
                cursor: 'pointer'
              }} onClick={() => { playSitarChord(); handleNav('home'); }}>
                <img src="/logo.jpg" alt="Indiverse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #0F172A 20%, #FF5500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                INDIVERSE
              </span>
            </div>

            <p style={{
              fontSize: '1rem',
              color: '#FF5500',
              fontWeight: '700',
              lineHeight: '1.5',
              marginBottom: '10px'
            }}>
              "From Dadi’s Lap to Your Lock Screen: Culture, Reimagined for Gen Z"
            </p>

            <p style={{
              fontSize: '0.88rem',
              color: '#475569',
              lineHeight: '1.65'
            }}>
              An interactive digital ecosystem built to make 5,000+ years of Indian heritage, folklore, arts, and living traditions exhilarating, bite-sized, and native to the digital generation.
            </p>
          </div>

          {/* Quick Nav: The 6 Sections */}
          <div>
            <h4 style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: '#FF5500',
              letterSpacing: '0.08em',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              Ecosystem Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'explore', label: 'Explore Page (7 Cultural Pillars)' },
                { id: 'courses', label: 'Courses (Draft Stage)' },
                { id: 'games', label: 'Games (Draft Stage)' },
                { id: 'stamps-leaderboard', label: 'Stamps & Leaderboard (Draft Stage)' },
                { id: 'marketplace', label: 'Marketplace (Live)' },
                { id: 'info', label: 'Profile, Levels & Manifesto' }
              ].map(sec => (
                <li key={sec.id}>
                  <button 
                    onClick={() => handleNav(sec.id)}
                    style={{
                      color: '#475569',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color var(--transition-fast)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FF5500')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                  >
                    <span>{sec.label}</span>
                    <ArrowUpRight size={14} color="#FF5500" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cultural Pillars */}
          <div>
            <h4 style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: '#FF5500',
              letterSpacing: '0.08em',
              fontWeight: '800',
              marginBottom: '16px'
            }}>
              Culture Reimagined
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFF5F0',
                border: '1px solid rgba(255, 85, 0, 0.2)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', display: 'block' }}>
                  28 States • 8 Union Territories
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  A pan-Indian canvas spanning Kashmir to Kanyakumari.
                </span>
              </div>

              <div style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFF8F2',
                border: '1px solid rgba(255, 140, 0, 0.25)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', display: 'block' }}>
                  Vedic Wisdom × Modern Pixels
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Interactive reels, gamified stamps, and authentic narratives.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(15, 23, 42, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} Indiverse Ecosystem. Dedicated to the youth of India.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={15} color="#FF5500" fill="#FF5500" />
            <span style={{ fontWeight: '600', color: '#334155' }}>for Gen Z heritage & culture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
