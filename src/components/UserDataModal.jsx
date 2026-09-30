import React from 'react';
import { 
  X, 
  Zap, 
  GraduationCap, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playChime } from '../utils/audio';
import { useUser } from '../context/UserContext';
import { MAHARASHTRA_COURSES } from '../data/maharashtraCourses';

export function UserDataModal({ isOpen, onClose, onNavigate, onNotify }) {
  const { userData, resetUserData } = useUser();

  if (!isOpen) return null;

  const nextTierXp = userData.xp < 150 ? 150 : userData.xp < 350 ? 350 : userData.xp < 600 ? 600 : 1000;
  const prevTierXp = userData.xp < 150 ? 0 : userData.xp < 350 ? 150 : userData.xp < 600 ? 350 : 600;
  const xpNeeded = Math.max(0, nextTierXp - userData.xp);
  const progressPct = Math.min(100, Math.round(((userData.xp - prevTierXp) / (nextTierXp - prevTierXp)) * 100));

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your User Data to 0 XP and 0 courses completed?')) {
      playChime();
      resetUserData();
      onNotify?.('🔄 User Data reset: 0 XP & 0 Courses Completed!');
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 120,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          background: '#FFFFFF',
          borderRadius: '26px',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          padding: '32px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => { playClick(); onClose(); }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#F1F5F9',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '26px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 6px 20px rgba(255, 85, 0, 0.35)',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt={userData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{userData.presetAvatar || '🏛️'}</span>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                {userData.name}
              </h2>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#FEF3C7',
                color: '#B45309',
                border: '1px solid #FCD34D'
              }}>
                LEVEL {userData.level}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.86rem', color: '#FF5500', fontWeight: '800' }}>
                {userData.rankTitle}
              </span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                {userData.region}
              </span>
            </div>
          </div>
        </div>

        {/* Core KPI Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {/* Total XP Card */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#FFF5F0',
            border: '1.5px solid rgba(255, 85, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EA580C', fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Zap size={14} />
              <span>Total XP</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A' }}>
              {userData.xp} <span style={{ fontSize: '0.9rem', color: '#FF5500' }}>XP</span>
            </div>
          </div>

          {/* Courses Completed Card */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#F0FDF4',
            border: '1.5px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              <GraduationCap size={14} />
              <span>Courses Done</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A' }}>
              {userData.completedCourses.length} <span style={{ fontSize: '0.9rem', color: '#16A34A' }}>/ 10</span>
            </div>
          </div>

          {/* Earned Stamps Card */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#FEFCE8',
            border: '1.5px solid rgba(234, 179, 8, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#CA8A04', fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Award size={14} />
              <span>Stamps Earned</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A' }}>
              {userData.earnedStamps.length} <span style={{ fontSize: '0.9rem', color: '#CA8A04' }}>/ 10</span>
            </div>
          </div>
        </div>

        {/* Level & Rank Progress Bar */}
        <div style={{
          padding: '18px 20px',
          borderRadius: '16px',
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0F172A' }}>
              Rank Progression: <strong style={{ color: '#FF5500' }}>{userData.rankTitle}</strong>
            </span>
            <span style={{ fontSize: '0.76rem', fontWeight: '700', color: '#64748B' }}>
              {xpNeeded > 0 ? `${xpNeeded} XP to next rank` : 'Top Rank Achieved!'}
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '10px',
            borderRadius: '999px',
            background: '#E2E8F0',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #FF6600 0%, #FF3D00 100%)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Completed Courses Section */}
        <div style={{ marginBottom: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Completed Courses ({userData.completedCourses.length})
            </h4>

            {userData.completedCourses.length === 0 && (
              <span style={{ fontSize: '0.74rem', color: '#C2410C', fontWeight: '800', background: '#FFEDD5', padding: '2px 8px', borderRadius: '6px' }}>
                Reset to 0 Courses
              </span>
            )}
          </div>

          {userData.completedCourses.length === 0 ? (
            <div style={{
              padding: '24px',
              borderRadius: '16px',
              background: '#F8FAFC',
              border: '1.5px dashed #CBD5E1',
              textAlign: 'center'
            }}>
              <GraduationCap size={36} color="#94A3B8" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                0 Courses Completed
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 14px', lineHeight: '1.5' }}>
                Your learning progress has been reset to 0. Head to the Maharashtra Courses section to complete Warli Painting, Lavani Dance, or Paithani Weaving and earn XP!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigate?.('courses');
                }}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                <span>Go to Courses Academy</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {userData.completedCourses.map(courseId => {
                const c = MAHARASHTRA_COURSES.find(item => item.id === courseId);
                return (
                  <div key={courseId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={18} color="#16A34A" />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A' }}>
                          {c ? c.title : courseId}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#15803D' }}>
                          Stamp Unlocked: {c?.stamp || 'Stamp Earned'}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.84rem', fontWeight: '900', color: '#16A34A' }}>
                      +{c?.xpReward || 150} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Digital Stamps Section */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A', margin: '0 0 12px' }}>
            Cultural Stamps Collection ({userData.earnedStamps.length} / 10)
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '10px'
          }}>
            {MAHARASHTRA_COURSES.map(c => {
              const isEarned = userData.earnedStamps.includes(c.stamp);
              return (
                <div key={c.id} style={{
                  padding: '12px 10px',
                  borderRadius: '14px',
                  background: isEarned ? '#FFF5F0' : '#F8FAFC',
                  border: isEarned ? '1.5px solid #FF5500' : '1px solid #E2E8F0',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isEarned ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : '#E2E8F0',
                    color: isEarned ? '#FFFFFF' : '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem'
                  }}>
                    {isEarned ? '🏆' : <Lock size={14} />}
                  </div>

                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: isEarned ? '800' : '600',
                    color: isEarned ? '#0F172A' : '#64748B',
                    lineHeight: '1.2'
                  }}>
                    {c.stamp}
                  </span>

                  <span style={{ fontSize: '0.64rem', color: isEarned ? '#15803D' : '#94A3B8', fontWeight: '700' }}>
                    {isEarned ? '✓ Claimed' : `+${c.xpReward} XP`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1.5px solid #F1F5F9',
          paddingTop: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Reset to 0 XP and 0 Courses Button */}
          <button
            onClick={handleReset}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              background: '#FFF1F2',
              border: '1.5px solid #FDA4AF',
              color: '#E11D48',
              fontWeight: '800',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Reset progress back to 0 XP and 0 courses completed"
          >
            <RotateCcw size={15} />
            <span>Reset All to 0 XP & 0 Courses</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                playClick();
                onClose();
                onNavigate?.('info');
              }}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '0.84rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(255, 85, 0, 0.3)'
              }}
            >
              <span>Profile & Levels</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => { playClick(); onClose(); }}
              className="btn-secondary"
              style={{ padding: '9px 20px', fontSize: '0.86rem' }}
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
