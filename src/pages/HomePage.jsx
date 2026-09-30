import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  GraduationCap, 
  Gamepad2, 
  Trophy, 
  ShoppingBag, 
  Info, 
  ArrowRight, 
  Flame, 
  Share2, 
  Layers, 
  Volume2,
  Mail,
  Send,
  Star,
  CheckCircle2,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playSitarChord, playChime, playCelebration } from '../utils/audio';

export function HomePage({ onNavigate, selectedState = 'Maharashtra', onAwardXp }) {
  const [logoTilted, setLogoTilted] = useState(false);
  const [copiedMotto, setCopiedMotto] = useState(false);

  // Direct User Feedback state
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('General Feedback & Experience');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  const targetEmail = 'indiverse.culture@gmail.com';

  const generateMailContent = () => {
    const subject = `[Indiverse Feedback] ${feedbackCategory} from ${feedbackEmail.trim()}`;
    const body = `Hi Indiverse Team,\n\nHere is my feedback for Indiverse:\n--------------------------------------------------\nFrom: ${feedbackEmail.trim()}\nCategory: ${feedbackCategory}\nRating: ${feedbackRating}/5 Stars\nDate: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}\n\nFeedback Message:\n${feedbackMessage.trim()}\n--------------------------------------------------\n\nSent directly from Indiverse Culture Platform`;
    return { subject, body };
  };

  const handleSendViaGmail = (e) => {
    e?.preventDefault();
    if (!feedbackEmail.trim() || !feedbackEmail.includes('@')) {
      playClick();
      setFeedbackError('Please enter a valid Gmail address (e.g. yourname@gmail.com)');
      return;
    }
    if (!feedbackMessage.trim()) {
      playClick();
      setFeedbackError('Please share a few words in your feedback message.');
      return;
    }

    setFeedbackError('');
    const { subject, body } = generateMailContent();

    // Direct Web Gmail Compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Store locally
    try {
      const stored = JSON.parse(localStorage.getItem('indiverse_user_feedbacks') || '[]');
      stored.unshift({
        id: `fb-${Date.now()}`,
        email: feedbackEmail.trim(),
        category: feedbackCategory,
        rating: feedbackRating,
        message: feedbackMessage.trim(),
        date: new Date().toISOString()
      });
      localStorage.setItem('indiverse_user_feedbacks', JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    playCelebration();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });

    onAwardXp?.(25);
    setFeedbackSubmitted(true);

    // Open Gmail directly in a new window/tab
    window.open(gmailUrl, '_blank');
  };

  const handleSendViaMailto = () => {
    playClick();
    const { subject, body } = generateMailContent();
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleResetFeedback = () => {
    playClick();
    setFeedbackSubmitted(false);
    setFeedbackMessage('');
    setFeedbackError('');
  };

  const handleHeroLogoClick = () => {
    playSitarChord();
    setLogoTilted(true);
    setTimeout(() => setLogoTilted(false), 800);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5500', '#FF8800', '#FFAA00', '#FFFFFF']
    });
    onAwardXp?.(15);
  };

  const handleCopyMotto = () => {
    playClick();
    navigator.clipboard.writeText("From Dadi’s Lap to Your Lock Screen: Culture, Reimagined for Gen Z");
    setCopiedMotto(true);
    setTimeout(() => setCopiedMotto(false), 2500);
  };

  const ecosystemSections = [
    {
      id: 'explore',
      title: 'Explore Page',
      subtitle: '7 Living Cultural Pillars',
      desc: 'Interactive food stories, vibrant festivals, traditional clothes, royal accessories, classical music, grandma lore, and documentary facts.',
      icon: Compass,
      tag: '7 Pillars Live',
      tagColor: '#FF5500',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
      borderColor: 'rgba(255, 85, 0, 0.45)',
      isLive: true,
    },
    {
      id: 'courses',
      title: 'Courses',
      subtitle: 'Bite-Sized Cultural Masterclasses',
      desc: 'Micro-academies on Vedic mathematics, Sanskrit hymns, classical Indian arts, temple architecture, and philosophical systems.',
      icon: GraduationCap,
      tag: 'Draft Stage',
      tagColor: '#D97706',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF5 100%)',
      borderColor: 'rgba(255, 160, 0, 0.3)',
      isLive: false,
    },
    {
      id: 'games',
      title: 'Games',
      subtitle: 'Mythology RPGs & Folklore Quests',
      desc: 'Gamified cultural lore: Vikram & Betal riddle labyrinths, Kurukshetra strategy puzzles, and Panchatantra adventure quests.',
      icon: Gamepad2,
      tag: 'Draft Stage',
      tagColor: '#D97706',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F5 100%)',
      borderColor: 'rgba(255, 120, 50, 0.3)',
      isLive: false,
    },
    {
      id: 'stamps-leaderboard',
      title: 'Stamps & Leaderboard',
      subtitle: 'Unified Cultural Passport & Ranks',
      desc: 'Collect digital heritage stamps across India’s 28 states and climb the national youth leaderboard as a Culture Champion.',
      icon: Trophy,
      tag: 'Draft Stage',
      tagColor: '#D97706',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF2 100%)',
      borderColor: 'rgba(255, 180, 0, 0.3)',
      isLive: false,
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      subtitle: 'GI-Tagged Crafts & Youth Merch',
      desc: 'Direct-from-artisan marketplace: sustainable handlooms, brass sculptures, organic perfumes, and modern Indian street aesthetics.',
      icon: ShoppingBag,
      tag: 'Draft Stage',
      tagColor: '#D97706',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F2 100%)',
      borderColor: 'rgba(255, 100, 40, 0.3)',
      isLive: false,
    },
    {
      id: 'info',
      title: 'Profile & Info Hub',
      subtitle: 'Duolingo Levels, XP & Indiverse Manifesto',
      desc: 'Customize your cultural avatar, track Duolingo-style levels and daily streaks, complete XP quests, and explore our manifesto.',
      icon: Info,
      tag: 'Live Hub',
      tagColor: '#FF5500',
      bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
      borderColor: 'rgba(255, 85, 0, 0.4)',
      isLive: true,
    },
  ];

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          
          {/* Eyebrow Pill */}
          <div style={{ display: 'inline-flex', marginBottom: '24px' }}>
            <div className="badge-orange pulse-glow" style={{ cursor: 'pointer' }} onClick={playChime}>
              <Sparkles size={14} color="#FF5500" />
              <span>THE CULTURAL ECOSYSTEM FOR GEN Z</span>
            </div>
          </div>

          {/* Interactive Logo Showcase with Crazy Hover & Sound */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            <div 
              onClick={handleHeroLogoClick}
              title="Click for Sitar Sound & Confetti!"
              className="crazy-hover"
              style={{
                position: 'relative',
                width: '144px',
                height: '144px',
                borderRadius: '30px',
                padding: '4px',
                background: 'linear-gradient(135deg, #FF5500 0%, #FFA000 50%, #FFFFFF 100%)',
                boxShadow: '0 15px 45px rgba(255, 85, 0, 0.35), 0 4px 15px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: logoTilted ? 'scale(1.12) rotate(6deg)' : 'scale(1)',
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '26px',
                overflow: 'hidden',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/logo.jpg" 
                  alt="Indiverse Official Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Sound Prompt badge */}
              <div style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: '#FFFFFF',
                border: '1.5px solid #FF5500',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.72rem',
                color: '#FF5500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '800',
                boxShadow: '0 6px 16px rgba(255, 85, 0, 0.25)'
              }}>
                <Volume2 size={13} color="#FF5500" />
                <span>Tap for Sitar Sound</span>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(3rem, 7.5vw, 5.4rem)',
            fontWeight: '900',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            color: '#0F172A'
          }}>
            <span className="gradient-text-orange-pure">INDIVERSE</span>
          </h1>

          {/* Official Motto Callout */}
          <div style={{
            maxWidth: '820px',
            margin: '0 auto 28px',
            padding: '20px 32px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
            border: '2px solid rgba(255, 85, 0, 0.35)',
            boxShadow: '0 10px 35px rgba(255, 85, 0, 0.12)'
          }}>
            <p style={{
              fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
              color: '#0F172A',
              fontWeight: '800',
              letterSpacing: '-0.01em',
              lineHeight: '1.4',
              margin: 0
            }}>
              “From Dadi’s Lap to Your Lock Screen: <span style={{ color: '#FF5500' }}>Culture, Reimagined for Gen Z</span>”
            </p>
          </div>

          {/* Description */}
          <p style={{
            maxWidth: '680px',
            margin: '0 auto 36px',
            fontSize: '1.08rem',
            color: '#475569',
            lineHeight: '1.65'
          }}>
            India’s timeless folklore, sacred arts, ancient sciences, and epic histories are no longer locked in dusty manuscripts. Indiverse turns oral traditions into an interactive, gamified digital universe built natively for young minds.
          </p>

          {/* Primary Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '50px'
          }}>
            <button
              onClick={() => { playClick(); onNavigate('explore'); }}
              className="btn-primary"
              style={{ fontSize: '1.05rem', padding: '14px 34px' }}
            >
              <Compass size={20} />
              <span>Launch 7-Pillar Explore Feed</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleCopyMotto}
              className="btn-secondary"
              style={{ fontSize: '0.95rem' }}
            >
              <Share2 size={16} color="#FF5500" />
              <span>{copiedMotto ? 'Motto Copied!' : 'Share Our Motto'}</span>
            </button>
          </div>

          {/* Live Ecosystem Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '16px',
            maxWidth: '880px',
            margin: '0 auto'
          }}>
            {[
              { label: 'Active Pilot', value: selectedState, sub: 'Phase 1 Live • 35 Regions in Lab' },
              { label: 'Pan-Indian Reach', value: '28 States & 8 UTs', sub: 'Expanding across India' },
              { label: 'Living Heritage', value: '5,000+ Years', sub: 'Vedic to Maratha folklore' },
              { label: 'Audience Focus', value: '100% Gen Z', sub: 'Interactive & Gamified' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="glass-panel"
                style={{
                  padding: '18px 20px',
                  textAlign: 'center',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(255, 85, 0, 0.2)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.4rem', 
                  fontWeight: '900', 
                  color: '#0F172A',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#FF5500', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '3px' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* The 6 Ecosystem Pillars Section */}
      <section style={{ paddingTop: '20px', paddingBottom: '40px' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="badge-orange" style={{ marginBottom: '12px' }}>
              <Layers size={14} color="#FF5500" />
              <span>THE 6 PILLARS OF INDIVERSE</span>
            </div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: '900',
              color: '#0F172A',
              marginBottom: '12px'
            }}>
              One Integrated Cultural Ecosystem
            </h2>
            <p style={{
              maxWidth: '650px',
              margin: '0 auto',
              color: '#475569',
              fontSize: '0.98rem'
            }}>
              Indiverse is structured into 6 dedicated modules. The <strong style={{ color: '#FF5500' }}>Explore Page</strong> has now been expanded into 7 rich parts (Food, Festivals, Clothes, Accessories, Music, Stories, and Documentary Facts), while Courses, Games, Stamps & Leaderboard, Marketplace, and Info are presented in their clean architectural draft shells.
            </p>
          </div>

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '26px'
          }}>
            {ecosystemSections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  onClick={() => { playClick(); onNavigate(sec.id); }}
                  className="card-hover-crazy"
                  style={{
                    padding: '30px',
                    borderRadius: '24px',
                    background: sec.bgGradient,
                    border: `1.5px solid ${sec.borderColor}`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 25px rgba(15, 23, 42, 0.05)'
                  }}
                >
                  <div>
                    {/* Top row: Icon & Status tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '16px',
                        background: sec.isLive ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : '#FFF0EA',
                        border: `1px solid ${sec.isLive ? '#FF5500' : 'rgba(255, 85, 0, 0.25)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: sec.isLive ? '#FFFFFF' : '#FF5500',
                        boxShadow: sec.isLive ? '0 8px 20px rgba(255, 85, 0, 0.35)' : 'none'
                      }}>
                        <Icon size={26} />
                      </div>

                      <span style={{
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: sec.isLive ? 'rgba(255, 85, 0, 0.12)' : 'rgba(255, 140, 0, 0.12)',
                        border: `1px solid ${sec.isLive ? 'rgba(255, 85, 0, 0.4)' : 'rgba(255, 140, 0, 0.3)'}`,
                        color: sec.tagColor,
                        fontWeight: '800'
                      }}>
                        {sec.tag}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: '800',
                      color: '#0F172A',
                      marginBottom: '6px'
                    }}>
                      {sec.title}
                    </h3>

                    <h4 style={{
                      fontSize: '0.88rem',
                      color: sec.isLive ? '#FF5500' : '#64748B',
                      fontWeight: '700',
                      marginBottom: '14px'
                    }}>
                      {sec.subtitle}
                    </h4>

                    <p style={{
                      fontSize: '0.9rem',
                      color: '#475569',
                      lineHeight: '1.6',
                      marginBottom: '24px'
                    }}>
                      {sec.desc}
                    </p>
                  </div>

                  {/* Bottom Action Prompt */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    color: sec.isLive ? '#FF5500' : '#1E293B',
                    borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                    paddingTop: '16px'
                  }}>
                    <span>{sec.isLive ? 'Explore the 7 Realms' : 'View Module Architecture'}</span>
                    <ArrowRight size={16} color="#FF5500" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Cultural Manifesto Callout */}
      <section style={{ paddingTop: '50px' }}>
        <div className="container">
          <div style={{
            padding: '44px',
            borderRadius: '26px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
            border: '2px solid rgba(255, 85, 0, 0.35)',
            boxShadow: '0 15px 40px rgba(255, 85, 0, 0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '30px'
          }}>
            <div style={{ flex: '1 1 500px' }}>
              <div className="badge-orange" style={{ marginBottom: '14px' }}>
                <Flame size={14} color="#FF5500" />
                <span>WHY INDIVERSE?</span>
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: '900', color: '#0F172A', marginBottom: '14px' }}>
                Culture That Lives In Your Pocket
              </h3>
              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: '1.7', margin: 0 }}>
                Every grandmother’s bedtime tale was once an oral marvel that carried moral resilience, astrological science, and tribal wisdom. Indiverse brings that very warmth directly to smartphones, smartwatches, and headsets.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { playClick(); onNavigate('explore'); }}
                className="btn-primary"
              >
                <Compass size={18} />
                <span>Start Exploring</span>
              </button>
              <button 
                onClick={() => { playClick(); onNavigate('info'); }}
                className="btn-secondary"
              >
                <Info size={18} color="#FF5500" />
                <span>Read Manifesto</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* DIRECT GMAIL USER FEEDBACK SECTION */}
      {/* ============================================================== */}
      <section style={{ paddingTop: '50px', paddingBottom: '70px' }}>
        <div className="container">
          <div style={{
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #7C2D12 100%)',
            border: '2px solid rgba(255, 85, 0, 0.4)',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            color: '#FFFFFF',
            padding: '44px',
            position: 'relative',
            overflow: 'hidden'
          }}>

            {/* Background Accent Graphics */}
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 85, 0, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              position: 'relative',
              zIndex: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}>

              {/* Left Column: Context & Direct Mail info */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  marginBottom: '16px'
                }}>
                  <Mail size={15} color="#FDE047" />
                  <span style={{ fontSize: '0.76rem', fontWeight: '900', letterSpacing: '0.04em', color: '#FDE047' }}>
                    DIRECT USER FEEDBACK
                  </span>
                </div>

                <h2 style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.7rem)',
                  fontWeight: '900',
                  lineHeight: '1.15',
                  marginBottom: '14px',
                  letterSpacing: '-0.02em'
                }}>
                  Add Your Gmail & Directly Mail Us Your Feedback
                </h2>

                <p style={{
                  fontSize: '1rem',
                  color: '#CBD5E1',
                  lineHeight: '1.65',
                  marginBottom: '26px'
                }}>
                  We are building Indiverse with the community. Tell us what you love, recommend your favorite regional dishes or festivals, request a cultural course, or report an issue. Your feedback opens directly in Gmail addressed to our core founding team!
                </p>

                {/* Highlights List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(255, 85, 0, 0.25)',
                      color: '#FF7700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Send size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>Direct Inbox Delivery</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.45' }}>
                        Opens your feedback pre-filled in Gmail Web or your device mail app to <strong>{targetEmail}</strong>.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ADE80',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>Shape Cultural Content</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.45' }}>
                        Suggest authentic Maharashtrian dishes, traditions, or tribal craft courses to be featured next.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(253, 224, 71, 0.2)',
                      color: '#FDE047',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: '#FFFFFF' }}>+25 Culture XP Awarded</strong>
                      <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.45' }}>
                        Every verified feedback submission earns you 25 XP toward your Cultural Ambassador rank.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Email pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontSize: '0.84rem',
                  color: '#CBD5E1'
                }}>
                  <Mail size={15} color="#FF7700" />
                  <span>Team Inbox: <strong style={{ color: '#FDE047' }}>{targetEmail}</strong></span>
                </div>
              </div>

              {/* Right Column: Interactive Feedback Form */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '32px',
                color: '#0F172A',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)'
              }}>

                {!feedbackSubmitted ? (
                  <form onSubmit={handleSendViaGmail} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.86rem', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={15} color="#FF5500" />
                          <span>Your Gmail Address *</span>
                        </label>

                        {/* Helper append @gmail.com */}
                        {feedbackEmail && !feedbackEmail.includes('@') && (
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              setFeedbackEmail(prev => `${prev.trim()}@gmail.com`);
                            }}
                            style={{
                              background: '#FFF5F0',
                              border: '1px solid #FF5500',
                              color: '#EA580C',
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            + @gmail.com
                          </button>
                        )}
                      </div>

                      <input 
                        type="email"
                        required
                        placeholder="e.g. yourname@gmail.com"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.92rem',
                          color: '#0F172A',
                          outline: 'none',
                          background: '#F8FAFC',
                          transition: 'border-color 0.2s ease'
                        }}
                      />
                    </div>

                    {/* Feedback Category & Rating Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
                      
                      {/* Category */}
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          Feedback Topic
                        </label>
                        <select
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '0.84rem',
                            fontWeight: '600',
                            color: '#0F172A',
                            background: '#FFFFFF',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="General Feedback & UI">🏛️ General Feedback & UI</option>
                          <option value="Food & Dishes Recommendation">🍛 Food & Dishes Recommendation</option>
                          <option value="Festivals & Cultural Lore">🎊 Festivals & Cultural Lore</option>
                          <option value="Courses & Academy Requests">🎓 Courses & Academy Requests</option>
                          <option value="Marketplace & Drops">🛍️ Marketplace & Drops</option>
                          <option value="Games & Mythology Quests">🎮 Games & Mythology Quests</option>
                          <option value="Bug Report or Glitch">🐞 Bug Report or Glitch</option>
                        </select>
                      </div>

                      {/* Interactive 5-Star Rating */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A' }}>
                            Your Rating
                          </label>
                          <span style={{ fontSize: '0.74rem', color: '#FF5500', fontWeight: '800' }}>
                            {feedbackRating}/5 Stars
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '7px 0' }}>
                          {[1, 2, 3, 4, 5].map((starVal) => {
                            const isFilled = (hoverRating || feedbackRating) >= starVal;
                            return (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => {
                                  playChime();
                                  setFeedbackRating(starVal);
                                }}
                                onMouseEnter={() => setHoverRating(starVal)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  transition: 'transform 0.1s ease'
                                }}
                                title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                              >
                                <Star 
                                  size={22} 
                                  color="#EAB308" 
                                  fill={isFilled ? '#EAB308' : 'none'} 
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                    {/* Feedback Message */}
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                        Your Message / Suggestions *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us what you liked, what dish or festival we should add next, or any improvements..."
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          borderRadius: '12px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '0.9rem',
                          color: '#0F172A',
                          outline: 'none',
                          background: '#F8FAFC',
                          resize: 'vertical',
                          lineHeight: '1.5'
                        }}
                      />
                    </div>

                    {/* Error Notice */}
                    {feedbackError && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#FEE2E2',
                        color: '#B91C1C',
                        fontSize: '0.82rem',
                        fontWeight: '700'
                      }}>
                        ⚠️ {feedbackError}
                      </div>
                    )}

                    {/* Action Buttons: Directly Mail via Gmail or Mail App */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          padding: '13px',
                          fontSize: '0.95rem',
                          borderRadius: '14px'
                        }}
                      >
                        <Send size={18} />
                        <span>Directly Mail via Gmail</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSendViaMailto}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '12px',
                          background: '#F8FAFC',
                          border: '1.5px solid #CBD5E1',
                          color: '#475569',
                          fontWeight: '800',
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <ExternalLink size={15} />
                        <span>Or Send via Default Mail App (Outlook / Apple Mail)</span>
                      </button>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#64748B' }}>
                      ✨ Clicking will automatically draft and open an email addressed to <strong>{targetEmail}</strong> with your feedback.
                    </div>

                  </form>
                ) : (
                  /* Feedback Submitted / Confirmation Card */
                  <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: '#DCFCE7',
                      color: '#16A34A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 4px 15px rgba(22, 163, 74, 0.25)'
                    }}>
                      <CheckCircle2 size={36} />
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
                      Feedback Prepared & Drafted!
                    </h3>

                    <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '20px' }}>
                      Thank you for sharing your thoughts from <strong style={{ color: '#0F172A' }}>{feedbackEmail}</strong>! A pre-filled email draft has been generated for <strong>{targetEmail}</strong>.
                    </p>

                    {/* Feedback Summary Box */}
                    <div style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '14px 18px',
                      textAlign: 'left',
                      marginBottom: '22px'
                    }}>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Your Submission Summary
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                        {feedbackCategory} • {'⭐'.repeat(feedbackRating)}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', fontStyle: 'italic', lineHeight: '1.5' }}>
                        "{feedbackMessage}"
                      </p>
                    </div>

                    {/* Quick Re-open buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      <button
                        onClick={handleSendViaGmail}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                      >
                        <Send size={16} />
                        <span>Re-Open in Gmail Web</span>
                      </button>

                      <button
                        onClick={handleSendViaMailto}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '12px',
                          background: '#FFFFFF',
                          border: '1.5px solid #CBD5E1',
                          color: '#334155',
                          fontWeight: '800',
                          fontSize: '0.84rem',
                          cursor: 'pointer'
                        }}
                      >
                        Open in Native Mail Client
                      </button>
                    </div>

                    <button
                      onClick={handleResetFeedback}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#FF5500',
                        fontWeight: '800',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Send Another Feedback
                    </button>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

