import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Lock, 
  Unlock, 
  MapPin, 
  Award, 
  X, 
  Play, 
  AlertCircle,
  Check,
  Star,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playChime, playCelebration, playSitarChord } from '../utils/audio';
import { MAHARASHTRA_COURSES } from '../data/maharashtraCourses';
import { StateSelectorModal } from '../components/StateSelectorModal';
import { UserDataModal } from '../components/UserDataModal';
import { useUser } from '../context/UserContext';

export function CoursesDraftPage({ onNavigate }) {
  const { userData, completeCourse, isUserModalOpen, setIsUserModalOpen } = useUser();

  // State selection: only Maharashtra is selectable for now
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [isStateModalOpen, setIsStateModalOpen] = useState(false);
  const [regionNotice, setRegionNotice] = useState(null);

  // Active filter tab: 'all', 'unlocked', 'locked', or category
  const [activeFilter, setActiveFilter] = useState('all');

  // Selected course for detail modal
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  // User progress state (completed modules)
  const [completedModules, setCompletedModules] = useState({});

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // State selection handler
  const handleStateSelect = (stateName) => {
    if (stateName === 'Maharashtra') {
      playSitarChord();
      setSelectedState('Maharashtra');
      showToast('📍 Switched to Maharashtra: Active Academy Pilot!');
    } else {
      playChime();
      const notice = `⏳ ${stateName} Academy is coming soon in Phase 2! Indiverse Academy is currently live exclusively for Maharashtra.`;
      setRegionNotice(notice);
      showToast(notice);
      setTimeout(() => setRegionNotice(null), 4000);
    }
  };

  // Module completion toggle
  const handleToggleModule = (courseId, moduleIdx, e) => {
    e?.stopPropagation();
    playChime();
    const key = `${courseId}-${moduleIdx}`;
    setCompletedModules(prev => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (activeFilter === 'unlocked') {
      return MAHARASHTRA_COURSES.filter(c => !c.isLocked);
    }
    if (activeFilter === 'locked') {
      return MAHARASHTRA_COURSES.filter(c => c.isLocked);
    }
    return MAHARASHTRA_COURSES;
  }, [activeFilter]);

  const unlockedCount = MAHARASHTRA_COURSES.filter(c => !c.isLocked).length; // 3
  const lockedCount = MAHARASHTRA_COURSES.filter(c => c.isLocked).length; // 7

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '100px' }}>
      
      {/* ============================================================== */}
      {/* TOP STATE & UNION TERRITORY SELECTOR OPTION (ABOVE COURSES) */}
      {/* ============================================================== */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid rgba(255, 85, 0, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: '76px',
        zIndex: 30
      }}>
        <div className="container" style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Back to Home */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => { playClick(); onNavigate('home'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748B',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.86rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={{ height: '20px', width: '1px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255, 85, 0, 0.3)'
              }}>
                <GraduationCap size={18} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: '900', color: '#0F172A' }}>
                INDIVERSE <span style={{ color: '#FF5500' }}>ACADEMY</span>
              </span>
            </div>
          </div>

          {/* Interactive State / UT Selection Option */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700' }}>
              Selected Region:
            </span>

            <button
              onClick={() => { playClick(); setIsStateModalOpen(true); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '12px',
                background: '#FFF5F0',
                border: '1.5px solid #FF5500',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(255, 85, 0, 0.12)',
                transition: 'all 0.15s ease'
              }}
              title="Click to select State or Union Territory"
            >
              <MapPin size={15} color="#FF5500" />
              <strong style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: '900' }}>
                {selectedState}
              </strong>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #86EFAC'
              }}>
                🟢 Live Pilot Active
              </span>
              <span style={{ fontSize: '0.74rem', color: '#FF5500', fontWeight: '800', marginLeft: '4px' }}>
                Change State ▼
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Region locked warning banner if another state was clicked */}
      {regionNotice && (
        <div style={{
          background: '#FEF2F2',
          borderBottom: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '10px 16px',
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={16} />
          <span>{regionNotice}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* COURSES HERO HEADER & STATS */}
      {/* ============================================================== */}
      <div className="container" style={{ paddingTop: '32px' }}>
        
        <div style={{
          padding: '38px 40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #C2410C 100%)',
          color: '#FFFFFF',
          marginBottom: '36px',
          boxShadow: '0 14px 40px rgba(255, 85, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(255, 85, 0, 0.3)', border: '1px solid #FF5500', marginBottom: '14px' }}>
              <Sparkles size={14} color="#FDE047" />
              <span style={{ fontSize: '0.76rem', fontWeight: '900', letterSpacing: '0.04em', color: '#FDE047' }}>
                MAHARASHTRA CULTURAL ACADEMY • PHASE 1 PILOT
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4.2vw, 2.9rem)',
              fontWeight: '900',
              lineHeight: '1.15',
              marginBottom: '14px',
              letterSpacing: '-0.02em'
            }}>
              Authentic Masterclasses in Folk Arts, Performing Traditions & Indian Knowledge Systems
            </h1>

            <p style={{ fontSize: '1rem', color: '#E2E8F0', lineHeight: '1.65', marginBottom: '24px' }}>
              Structured, culturally respectful micro-academies covering Warli tribal geometry, Lavani rhythm cycles, Paithani silk tapestry, Natya Sangeet, and ancient Varkari philosophy. Curated in alignment with accredited universities and master artisan guilds.
            </p>

            {/* Quick KPI badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem'
              }}>
                <Unlock size={14} color="#86EFAC" />
                <span><strong>{unlockedCount} Courses</strong> Unlocked & Ready</span>
              </div>

              <div style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem'
              }}>
                <Lock size={14} color="#FDE047" />
                <span><strong>{lockedCount} Masterclasses</strong> Locked (Unlock with XP)</span>
              </div>

              <div style={{
                padding: '6px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.14)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem'
              }}>
                <Award size={14} color="#FDE047" />
                <span>Accredited with SNDT, COEP & Prada Labs</span>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            right: '-30px',
            bottom: '-40px',
            fontSize: '16rem',
            opacity: '0.06',
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            🎓
          </div>
        </div>

        {/* ============================================================== */}
        {/* USER ACADEMY DATA & PROGRESS BAR (0 XP INITIAL STATE) */}
        {/* ============================================================== */}
        <div style={{
          padding: '18px 24px',
          borderRadius: '20px',
          background: '#FFFFFF',
          border: '1.5px solid rgba(255, 85, 0, 0.25)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
              color: '#FDE047',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
              flexShrink: 0
            }}>
              <Zap size={22} fill="#FDE047" color="#FDE047" />
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Academy Learning Data & XP
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', flexWrap: 'wrap' }}>
                <strong style={{ fontSize: '1.15rem', color: '#0F172A', fontWeight: '900' }}>
                  {userData.xp} XP Earned
                </strong>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.88rem', color: userData.completedCourses.length > 0 ? '#16A34A' : '#64748B', fontWeight: '800' }}>
                  {userData.completedCourses.length} of 10 Courses Completed
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.82rem', color: '#FF5500', fontWeight: '800' }}>
                  Rank: {userData.rankTitle}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                playClick();
                setIsUserModalOpen(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: '#FFF5F0',
                border: '1.5px solid #FF5500',
                color: '#EA580C',
                fontWeight: '800',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <span>View User Data & Stamps</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: `All 10 Courses (${MAHARASHTRA_COURSES.length})` },
              { id: 'unlocked', label: `🔓 Unlocked (${unlockedCount})` },
              { id: 'locked', label: `🔒 Locked Masterclasses (${lockedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveFilter(tab.id); }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '14px',
                  fontSize: '0.86rem',
                  fontWeight: activeFilter === tab.id ? '800' : '600',
                  cursor: 'pointer',
                  background: activeFilter === tab.id 
                    ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                    : '#FFFFFF',
                  color: activeFilter === tab.id ? '#FFFFFF' : '#334155',
                  border: activeFilter === tab.id ? '1.5px solid #FF5500' : '1.5px solid rgba(255, 85, 0, 0.18)',
                  boxShadow: activeFilter === tab.id ? '0 4px 15px rgba(255, 85, 0, 0.28)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: '700' }}>
            Region: <strong style={{ color: '#FF5500' }}>Maharashtra Pilot</strong>
          </span>
        </div>

        {/* ============================================================== */}
        {/* COURSES GRID (3 UNLOCKED, 7 LOCKED) */}
        {/* ============================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '26px'
        }}>
          {filteredCourses.map((course) => {
            const isCompleted = userData.completedCourses.includes(course.id);

            return (
              <div
                key={course.id}
                onClick={() => {
                  playClick();
                  setActiveCourseModal(course);
                }}
                className="card-hover-crazy"
                style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  border: isCompleted
                    ? '2px solid #22C55E'
                    : course.isLocked 
                      ? '1.5px solid #CBD5E1' 
                      : '1.5px solid rgba(255, 85, 0, 0.25)',
                  boxShadow: isCompleted
                    ? '0 8px 30px rgba(34, 197, 94, 0.15)'
                    : course.isLocked 
                      ? '0 6px 20px rgba(0, 0, 0, 0.03)' 
                      : '0 8px 30px rgba(255, 85, 0, 0.08)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  opacity: course.isLocked ? 0.94 : 1
                }}
              >
                {/* Course Header Thumbnail */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  background: '#F1F5F9',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: course.isLocked ? 'grayscale(35%) brightness(0.85)' : 'none',
                      transition: 'transform 0.4s ease'
                    }}
                  />

                  {/* Top Status Badge & XP Reward */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    zIndex: 2
                  }}>
                    {isCompleted ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(21, 128, 61, 0.35)'
                      }}>
                        <CheckCircle2 size={12} />
                        <span>✓ Completed (+{course.xpReward} XP)</span>
                      </span>
                    ) : course.isLocked ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'rgba(15, 23, 42, 0.88)',
                        backdropFilter: 'blur(6px)',
                        color: '#FDE047',
                        fontSize: '0.72rem',
                        fontWeight: '800'
                      }}>
                        <Lock size={12} />
                        <span>Locked Masterclass</span>
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        boxShadow: '0 2px 8px rgba(255, 85, 0, 0.35)'
                      }}>
                        <Unlock size={12} />
                        <span>Active Masterclass</span>
                      </span>
                    )}

                    {/* XP Reward Pill */}
                    <span style={{
                      alignSelf: 'flex-start',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: isCompleted ? 'rgba(21, 128, 61, 0.9)' : 'rgba(15, 23, 42, 0.85)',
                      color: isCompleted ? '#FFFFFF' : '#FDE047',
                      fontSize: '0.66rem',
                      fontWeight: '800'
                    }}>
                      ⚡ {isCompleted ? `${course.xpReward} XP Claimed` : `+${course.xpReward} XP Reward`}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    background: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(6px)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    color: '#C2410C',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{course.category}</span>
                  </div>

                  {/* Duration Pill */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.82)',
                    backdropFilter: 'blur(6px)',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.68rem',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={11} color="#FFA066" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* Course Card Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>
                      {course.level}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.76rem', color: '#15803D', fontWeight: '800' }}>
                      <Star size={12} fill="#15803D" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 style={{
                    fontSize: '1.18rem',
                    fontWeight: '800',
                    color: '#0F172A',
                    lineHeight: '1.3',
                    margin: '0 0 6px'
                  }}>
                    {course.title}
                  </h3>

                  <p style={{
                    fontSize: '0.84rem',
                    color: '#FF5500',
                    fontWeight: '700',
                    margin: '0 0 12px',
                    lineHeight: '1.4'
                  }}>
                    "{course.subtitle}"
                  </p>

                  <p style={{
                    fontSize: '0.86rem',
                    color: '#475569',
                    lineHeight: '1.55',
                    margin: '0 0 16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {course.overview}
                  </p>

                  {/* Stamp or Unlock Requirement Banner */}
                  {course.isLocked ? (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      fontSize: '0.78rem',
                      color: '#991B1B',
                      fontWeight: '700',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Lock size={14} color="#DC2626" />
                      <span>{course.unlockRequirement}</span>
                    </div>
                  ) : (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#FFF9F6',
                      border: '1px solid rgba(255, 85, 0, 0.25)',
                      fontSize: '0.78rem',
                      color: '#C2410C',
                      fontWeight: '800',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Award size={15} color="#FF5500" />
                      <span>Earn the "{course.stamp}" Stamp on completion</span>
                    </div>
                  )}

                  {/* Provider Pill */}
                  <div style={{
                    fontSize: '0.76rem',
                    color: '#64748B',
                    lineHeight: '1.4',
                    marginBottom: '18px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    <strong>Accredited Providers:</strong> {course.providers}
                  </div>

                  {/* Card Bottom CTA */}
                  <div style={{ marginTop: 'auto' }}>
                    {course.isLocked ? (
                      <button
                        onClick={() => {
                          playClick();
                          setActiveCourseModal(course);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          color: '#475569',
                          fontSize: '0.84rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Lock size={14} />
                        <span>View Syllabus & Unlock Rules</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playClick();
                          setActiveCourseModal(course);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '0.84rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(255, 85, 0, 0.25)'
                        }}
                      >
                        <Play size={14} fill="#FFFFFF" />
                        <span>Start Learning • Free Pilot</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ============================================================== */}
      {/* COURSE SYLLABUS & INTERACTIVITY MODAL */}
      {/* ============================================================== */}
      {activeCourseModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.72)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setActiveCourseModal(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '820px',
              maxHeight: '88vh',
              overflowY: 'auto',
              background: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              padding: '30px'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveCourseModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.08)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ display: 'flex', gap: '18px', marginBottom: '22px', flexWrap: 'wrap' }}>
              <img 
                src={activeCourseModal.image} 
                alt={activeCourseModal.title}
                style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover', border: '2px solid rgba(255, 85, 0, 0.3)' }}
              />
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    background: activeCourseModal.isLocked ? '#FEE2E2' : '#DCFCE7',
                    color: activeCourseModal.isLocked ? '#DC2626' : '#15803D'
                  }}>
                    {activeCourseModal.isLocked ? '🔒 Locked Masterclass' : '🟢 Unlocked Course'}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '700' }}>
                    {activeCourseModal.category} • {activeCourseModal.duration}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', margin: '0 0 6px', lineHeight: '1.25' }}>
                  {activeCourseModal.title}
                </h2>

                <p style={{ fontSize: '0.92rem', color: '#FF5500', fontWeight: '700', margin: 0 }}>
                  "{activeCourseModal.subtitle}"
                </p>
              </div>
            </div>

            {/* Locked Notice if applicable */}
            {activeCourseModal.isLocked && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '16px',
                background: '#FEF2F2',
                border: '1.5px solid #FCA5A5',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Lock size={20} color="#DC2626" />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: '800', color: '#991B1B' }}>
                    {activeCourseModal.unlockRequirement}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#7F1D1D' }}>
                    Complete the introductory masterclasses or earn XP through Indiverse community challenges to unlock this syllabus.
                  </div>
                </div>
              </div>
            )}

            {/* Course Overview */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: '#FFF9F6',
              border: '1.5px solid rgba(255, 85, 0, 0.2)',
              marginBottom: '20px'
            }}>
              <h4 style={{ margin: '0 0 6px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#FF5500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                📖 Course Overview & Cultural Significance
              </h4>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.6' }}>
                {activeCourseModal.overview}
              </p>
            </div>

            {/* Course Structure / Syllabus */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase' }}>
                📚 Structured Syllabus & Modules
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeCourseModal.structure.map((mod, mIdx) => {
                  const isDone = completedModules[`${activeCourseModal.id}-${mIdx}`];

                  return (
                    <div key={mIdx} style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: isDone ? '#ECFDF5' : '#F8FAFC',
                      border: isDone ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}>
                      {!activeCourseModal.isLocked ? (
                        <button
                          onClick={(e) => handleToggleModule(activeCourseModal.id, mIdx, e)}
                          style={{
                            marginTop: '2px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isDone ? 'none' : '2px solid #CBD5E1',
                            background: isDone ? '#10B981' : '#FFFFFF',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                        >
                          {isDone ? <Check size={14} /> : null}
                        </button>
                      ) : (
                        <div style={{
                          marginTop: '2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#E2E8F0',
                          color: '#64748B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          flexShrink: 0
                        }}>
                          {mIdx + 1}
                        </div>
                      )}

                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FF5500' }}>
                            {mod.unit}
                          </span>
                          <h5 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#0F172A' }}>
                            {mod.title}
                          </h5>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#475569', lineHeight: '1.5' }}>
                          {mod.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactivity & Challenges */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1.5px solid #FF5500',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.08)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C2410C', fontWeight: '800', fontSize: '0.86rem', marginBottom: '6px' }}>
                <Sparkles size={16} color="#FF5500" />
                <span>INTERACTIVITY & REWARD CHALLENGE</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                {activeCourseModal.interactivity}
              </p>
            </div>

            {/* Accredited Providers */}
            <div style={{
              padding: '14px 18px',
              borderRadius: '14px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <h5 style={{ margin: '0 0 4px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#0F172A', textTransform: 'uppercase' }}>
                🏛️ Accredited Educational Providers & Programs
              </h5>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: '1.55' }}>
                {activeCourseModal.providers}
              </p>
            </div>

            {/* Course Completion XP Reward Banner */}
            {(() => {
              const isModalCompleted = userData.completedCourses.includes(activeCourseModal.id);
              return (
                <div style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: isModalCompleted ? '#F0FDF4' : '#FFF5F0',
                  border: isModalCompleted ? '1.5px solid #86EFAC' : '1.5px solid rgba(255, 85, 0, 0.3)',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: isModalCompleted ? '#DCFCE7' : '#FFEDD5',
                      color: isModalCompleted ? '#16A34A' : '#C2410C',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {isModalCompleted ? <CheckCircle2 size={22} color="#16A34A" /> : <Zap size={22} color="#FF6600" />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>
                        {isModalCompleted ? 'Course Completed & Certified!' : `Course Completion Reward: +${activeCourseModal.xpReward} XP`}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isModalCompleted ? '#15803D' : '#64748B' }}>
                        Earns the "{activeCourseModal.stamp}" Digital Stamp in your User Data
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '1.15rem',
                    fontWeight: '900',
                    color: isModalCompleted ? '#16A34A' : '#EA580C'
                  }}>
                    {isModalCompleted ? `+${activeCourseModal.xpReward} XP Claimed` : `+${activeCourseModal.xpReward} XP`}
                  </div>
                </div>
              );
            })()}

            {/* Modal Bottom CTA */}
            {(() => {
              const isModalCompleted = userData.completedCourses.includes(activeCourseModal.id);
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  {!activeCourseModal.isLocked ? (
                    isModalCompleted ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 18px',
                        borderRadius: '12px',
                        background: '#DCFCE7',
                        color: '#15803D',
                        fontWeight: '800',
                        fontSize: '0.88rem'
                      }}>
                        <CheckCircle2 size={18} />
                        <span>✓ Course Completed! (+{activeCourseModal.xpReward} XP Claimed)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          playCelebration();
                          confetti({
                            particleCount: 65,
                            spread: 70,
                            origin: { y: 0.6 }
                          });
                          const newlyDone = completeCourse(activeCourseModal.id, activeCourseModal.xpReward, activeCourseModal.stamp);
                          if (newlyDone) {
                            showToast(`🎉 Course Completed! Earned +${activeCourseModal.xpReward} XP & "${activeCourseModal.stamp}" Stamp!`);
                          }
                        }}
                        className="btn-primary"
                        style={{ padding: '12px 24px', fontSize: '0.9rem' }}
                      >
                        <GraduationCap size={18} />
                        <span>Complete Course & Claim +{activeCourseModal.xpReward} XP</span>
                      </button>
                    )
                  ) : (
                    <div style={{ fontSize: '0.84rem', color: '#DC2626', fontWeight: '800' }}>
                      🔒 Locked Masterclass • {activeCourseModal.unlockRequirement || 'Prerequisites Required'}
                    </div>
                  )}

                  <button
                    onClick={() => setActiveCourseModal(null)}
                    className="btn-secondary"
                    style={{ padding: '12px 22px' }}
                  >
                    Close Syllabus
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STATE SELECTOR MODAL (ONLY MAHARASHTRA ACTIVE) */}
      {/* ============================================================== */}
      <StateSelectorModal
        isOpen={isStateModalOpen}
        onClose={() => setIsStateModalOpen(false)}
        selectedState={selectedState}
        onSelectState={handleStateSelect}
        onNotify={showToast}
      />

      {/* User Data & XP Profile Modal */}
      <UserDataModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onNavigate={onNavigate}
        onNotify={showToast}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <Sparkles size={18} fill="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default CoursesDraftPage;
