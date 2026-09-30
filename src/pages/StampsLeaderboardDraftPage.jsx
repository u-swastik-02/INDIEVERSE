import React, { useState } from 'react';
import { Trophy, Award, ArrowLeft, Clock, Sparkles, Layers, Medal, Compass } from 'lucide-react';
import { playClick } from '../utils/audio';

export function StampsLeaderboardDraftPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('stamps'); // 'stamps' or 'leaderboard'

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '60px 0 100px' }}>
      <div className="container">
        
        {/* Back navigation */}
        <button
          onClick={() => { playClick(); onNavigate('home'); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FF5500',
            fontWeight: '700',
            fontSize: '0.92rem',
            marginBottom: '28px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        {/* Section Header: Unified Section as requested */}
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF2 100%)',
          border: '1.5px solid rgba(255, 170, 0, 0.35)',
          boxShadow: '0 10px 30px rgba(255, 170, 0, 0.08)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#FFF8EA',
              border: '1px solid rgba(255, 170, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706'
            }}>
              <Trophy size={24} />
            </div>

            <div className="badge-draft">
              <Clock size={12} />
              <span>MODULE 4 OF 6 • UNIFIED SECTION • BASIC DRAFT STAGE</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '10px', color: '#0F172A' }}>
            Stamps & Leaderboard
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '750px', lineHeight: '1.6', margin: '0 0 24px' }}>
            A unified gamification hub where youth earn rare digital postal stamps for exploring India's 28 states & 8 UTs, while competing on national cultural discovery leaderboards.
          </p>

          {/* Section Sub-Nav Switcher */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px',
            borderRadius: '14px',
            background: '#FFFFFF',
            border: '1px solid rgba(255, 170, 0, 0.25)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}>
            <button
              onClick={() => { playClick(); setActiveTab('stamps'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'stamps' ? '800' : '600',
                background: activeTab === 'stamps' ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : 'transparent',
                color: activeTab === 'stamps' ? '#FFFFFF' : '#475569',
                boxShadow: activeTab === 'stamps' ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Award size={16} />
              <span>Digital Stamps Passport</span>
            </button>

            <button
              onClick={() => { playClick(); setActiveTab('leaderboard'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: activeTab === 'leaderboard' ? '800' : '600',
                background: activeTab === 'leaderboard' ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : 'transparent',
                color: activeTab === 'leaderboard' ? '#FFFFFF' : '#475569',
                boxShadow: activeTab === 'leaderboard' ? '0 4px 15px rgba(255, 85, 0, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Medal size={16} />
              <span>National Leaderboard</span>
            </button>
          </div>
        </div>

        {/* Dynamic Draft View based on Tab */}
        {activeTab === 'stamps' ? (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A' }}>
                Pan-Indian Heritage Passport
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                Draft wireframe for collecting and unlocking 36 unique state and territory heritage stamps.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {[
                { title: 'Northern Frontier Stamps', desc: 'Kashmir Pashmina, Himachal Woodcraft, Punjab Phulkari, Delhi Red Fort.', slot: 'Draft Passport Slot 01' },
                { title: 'Western & Desert Stamps', desc: 'Rajasthan Sheesh Mahal, Gujarat Bandhani, Goa Portuguese Churches.', slot: 'Draft Passport Slot 02' },
                { title: 'Southern Temple Stamps', desc: 'Hampi Stone Chariot, Tanjore Paintings, Kerala Kathakali, Madurai Meenakshi.', slot: 'Draft Passport Slot 03' },
                { title: 'Eastern & North-East Stamps', desc: 'Meghalaya Living Roots, Assam Kaziranga, Odisha Konark, Bengal Terracotta.', slot: 'Draft Passport Slot 04' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card-hover-crazy"
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1.5px dashed rgba(255, 170, 0, 0.4)',
                    background: '#FFFFFF',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#D97706',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#FFF8EA',
                      border: '1px solid rgba(255, 170, 0, 0.3)',
                      fontWeight: '800',
                      display: 'inline-block',
                      marginBottom: '12px'
                    }}>
                      {item.slot}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                  <div style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    fontSize: '0.8rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                  }}>
                    <Layers size={14} color="#FF5500" />
                    <span>Basic draft framework intact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0F172A' }}>
                National Youth Cultural Leaderboard
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#64748B' }}>
                Draft wireframe for monthly state leaderboards, streak awards, and Karma XP rankings.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {[
                { title: 'All-India Monthly Ranks', desc: 'Ranking top youth discoverers by cultural reels finished, quizzes aced, and stories unlocked.', slot: 'Draft Ranks Tier 01' },
                { title: 'Inter-College & State Circles', desc: 'Compete with campus peers and state cohorts in collective heritage milestones.', slot: 'Draft Ranks Tier 02' },
                { title: 'Karma XP Milestones', desc: 'Unlock special badges like "Vedic Scholar", "Chola Voyager", and "Folklore Sage".', slot: 'Draft Ranks Tier 03' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card-hover-crazy"
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1.5px dashed rgba(255, 170, 0, 0.4)',
                    background: '#FFFFFF',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#D97706',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#FFF8EA',
                      border: '1px solid rgba(255, 170, 0, 0.3)',
                      fontWeight: '800',
                      display: 'inline-block',
                      marginBottom: '12px'
                    }}>
                      {item.slot}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                  <div style={{
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    fontSize: '0.8rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600'
                  }}>
                    <Layers size={14} color="#FF5500" />
                    <span>Basic draft framework intact</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice Card */}
        <div style={{
          textAlign: 'center',
          padding: '36px',
          borderRadius: '20px',
          background: '#FFFFFF',
          border: '1.5px solid rgba(255, 85, 0, 0.2)',
          boxShadow: '0 10px 30px rgba(255, 85, 0, 0.05)'
        }}>
          <p style={{ color: '#475569', fontSize: '0.98rem', marginBottom: '16px', fontWeight: '500' }}>
            Passport claim engine and live ranking database are currently in draft architecture. Check out the active Explore feed now!
          </p>
          <button
            onClick={() => { playClick(); onNavigate('explore'); }}
            className="btn-primary"
          >
            <span>Go to Explore Page</span>
          </button>
        </div>

      </div>
    </div>
  );
}
