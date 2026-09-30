import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  X, 
  Check, 
  Lock, 
  Sparkles, 
  AlertCircle
} from 'lucide-react';
import { INDIAN_REGIONS } from '../data/indianRegions';
import { playClick, playChime, playSitarChord } from '../utils/audio';

export function StateSelectorModal({ 
  isOpen, 
  onClose, 
  selectedState = 'Maharashtra', 
  onSelectState,
  onNotify 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'state' | 'ut'
  const [lockedNotice, setLockedNotice] = useState(null);

  const filteredRegions = useMemo(() => {
    return INDIAN_REGIONS.filter(region => {
      const matchesTab = activeTab === 'all' || region.type === activeTab;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        region.name.toLowerCase().includes(query) || 
        region.capital.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  const handleSelectRegion = (region) => {
    if (region.isAvailable) {
      playSitarChord();
      onSelectState(region.name);
      if (onNotify) {
        onNotify(`📍 Exploring Maharashtra: Active Cultural Realm!`);
      }
      onClose();
    } else {
      playChime();
      const msg = `⏳ ${region.name} is coming soon! Indiverse is currently live exclusively for Maharashtra during Phase 1.`;
      setLockedNotice(msg);
      if (onNotify) {
        onNotify(msg);
      }
      setTimeout(() => {
        setLockedNotice(null);
      }, 4000);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeInModal 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playClick();
          onClose();
        }
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(255, 85, 0, 0.25), 0 0 0 1px rgba(255, 85, 0, 0.15)',
          overflow: 'hidden',
          animation: 'slideUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '22px 26px 18px',
          borderBottom: '1.5px solid rgba(255, 85, 0, 0.12)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F3 100%)',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 85, 0, 0.3)'
              }}>
                <MapPin size={20} color="#FFFFFF" />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '900',
                  color: '#0F172A',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.01em'
                }}>
                  Select State or Union Territory
                </h3>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '0.8rem',
                  color: '#64748B'
                }}>
                  Phase 1 Pilot: Exploring India's cultural heritage state-by-state
                </p>
              </div>
            </div>

            <button
              onClick={() => { playClick(); onClose(); }}
              aria-label="Close modal"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                background: '#FFFFFF',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF5F0';
                e.currentTarget.style.color = '#FF5500';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Active Pilot Banner */}
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.08) 0%, rgba(255, 140, 0, 0.12) 100%)',
            border: '1px solid rgba(255, 85, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Sparkles size={16} color="#FF5500" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', color: '#B43403', fontWeight: '600' }}>
              <strong>Exclusive Pilot:</strong> Indiverse content is currently active exclusively for <strong>Maharashtra</strong>. Remaining 35 regions will unlock in subsequent rollouts!
            </span>
          </div>

          {/* Locked Notice Alert (when clicking an unavailable state) */}
          {lockedNotice && (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              background: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              color: '#B91C1C',
              fontSize: '0.82rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'shakeWarning 0.3s ease-in-out'
            }}>
              <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
              <span>{lockedNotice}</span>
            </div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{
          padding: '14px 26px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1.5px solid rgba(255, 85, 0, 0.2)',
            transition: 'border-color 0.2s ease'
          }}>
            <Search size={18} color="#FF5500" />
            <input 
              type="text"
              placeholder="Search 28 States & 8 UTs (e.g. Maharashtra, Goa, Kerala, Delhi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.92rem',
                color: '#0F172A',
                fontFamily: 'inherit'
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Regions (36)' },
              { id: 'state', label: 'States (28)' },
              { id: 'ut', label: 'Union Territories (8)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  border: activeTab === tab.id ? '1.5px solid #FF5500' : '1px solid rgba(0, 0, 0, 0.1)',
                  background: activeTab === tab.id ? '#FF5500' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94A3B8', fontWeight: '600' }}>
              Showing {filteredRegions.length} of 36
            </span>
          </div>
        </div>

        {/* Scrollable Regions List */}
        <div style={{
          padding: '16px 26px',
          overflowY: 'auto',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}>
          {filteredRegions.map((region) => {
            const isSelected = selectedState.toLowerCase() === region.name.toLowerCase();
            const isAvailable = region.isAvailable;

            return (
              <div
                key={region.id}
                onClick={() => handleSelectRegion(region)}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                  background: isAvailable 
                    ? isSelected 
                      ? 'linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%)' 
                      : '#FFFFFF'
                    : '#FAFAFA',
                  border: isAvailable
                    ? isSelected 
                      ? '2px solid #FF5500' 
                      : '1.5px solid rgba(255, 85, 0, 0.35)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isAvailable
                    ? isSelected 
                      ? '0 6px 20px rgba(255, 85, 0, 0.18)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.03)'
                    : 'none',
                  opacity: isAvailable ? 1 : 0.65,
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 85, 0, 0.2)';
                  } else {
                    e.currentTarget.style.opacity = '0.85';
                    e.currentTarget.style.borderColor = 'rgba(255, 85, 0, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isAvailable) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isSelected ? '0 6px 20px rgba(255, 85, 0, 0.18)' : '0 2px 8px rgba(0, 0, 0, 0.03)';
                  } else {
                    e.currentTarget.style.opacity = '0.65';
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isAvailable 
                      ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                      : '#E2E8F0',
                    color: isAvailable ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontWeight: '800',
                    fontSize: '0.8rem'
                  }}>
                    {isAvailable ? <MapPin size={18} /> : <Lock size={15} />}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '0.92rem',
                        fontWeight: isAvailable ? '800' : '600',
                        color: isAvailable ? '#0F172A' : '#64748B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {region.name}
                      </span>
                    </div>

                    <div style={{ 
                      fontSize: '0.72rem', 
                      color: isAvailable ? '#FF5500' : '#94A3B8',
                      fontWeight: isAvailable ? '700' : '500'
                    }}>
                      {isAvailable ? 'Capital: Mumbai • 36 Districts' : `Capital: ${region.capital}`}
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isAvailable ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: '#DCFCE7',
                      color: '#15803D',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      border: '1px solid #86EFAC'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22C55E'
                      }} />
                      Available
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: '#F1F5F9',
                      color: '#94A3B8',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      border: '1px solid #E2E8F0'
                    }}>
                      Coming Soon
                    </span>
                  )}

                  {isSelected && (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#FF5500',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRegions.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#64748B'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>
                No state or union territory found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  marginTop: '10px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #FF5500',
                  background: '#FFF5F0',
                  color: '#FF5500',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 26px',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Current Selection: <strong style={{ color: '#FF5500' }}>{selectedState} (Active Pilot)</strong>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Confirm & Close
          </button>
        </div>
      </div>
    </div>
  );
}
