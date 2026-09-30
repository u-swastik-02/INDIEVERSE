import React, { useState, useRef } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Sparkles, 
  Trophy, 
  Zap, 
  Flame, 
  Shield, 
  Star, 
  Award, 
  BookOpen, 
  Compass, 
  Gift, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Share2, 
  Check, 
  Lock, 
  RefreshCw,
  Info,
  Layers,
  Heart,
  Globe,
  Sliders,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playChime, playSitarChord } from '../utils/audio';
import { useUser } from '../context/UserContext';
import { calculateLevelAndRank } from '../data/userData';

export function InfoPage({ onNavigate }) {
  const { userData, awardXp, updateUserProfile, claimDailyXp, resetUserData } = useUser();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'levels', 'quests', 'manifesto'
  const fileInputRef = useRef(null);

  // Profile Edit State
  const [nameInput, setNameInput] = useState(userData.name || 'Culture Explorer');
  const [handleInput, setHandleInput] = useState(userData.handle || '@culture_explorer');
  const [bioInput, setBioInput] = useState(userData.bio || 'Exploring 5,000+ years of Bharatiya heritage & folklore. From Dadi’s lap to lock screen! 🚩');
  const [regionInput, setRegionInput] = useState(userData.region || 'Maharashtra Pilot');
  const [toastMessage, setToastMessage] = useState(null);

  // Daily Quiz Mini-Game State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizAwarded, setQuizAwarded] = useState(false);

  // Story Quest State
  const [storyRead, setStoryRead] = useState(false);

  // Selected Level Milestone for Details View
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Duolingo Level & XP calculations
  const { level, rankTitle, nextTierXp, prevTierXp, tierColor, badgeIcon } = calculateLevelAndRank(userData.xp || 0);
  const xpNeeded = Math.max(0, nextTierXp - (userData.xp || 0));
  const range = nextTierXp - prevTierXp;
  const progressInTier = Math.max(0, (userData.xp || 0) - prevTierXp);
  const levelProgressPct = Math.min(100, Math.round((progressInTier / range) * 100));

  // Duolingo Level Roadmap Milestones
  const milestones = [
    {
      level: 1,
      name: 'Roots of Maharashtra',
      rank: 'Novice Explorer',
      xpRequired: 0,
      icon: '🌱',
      color: '#FF5500',
      description: 'Begin your journey across Sahyadri mountain lore, ancient recipes, and folk traditions.',
      perks: ['Novice Cultural Badge', 'Default Bronze Avatar Ring', 'Access to 7 Living Realms']
    },
    {
      level: 2,
      name: 'Heritage Seeker',
      rank: 'Heritage Seeker',
      xpRequired: 100,
      icon: '🔍',
      color: '#FF6600',
      description: 'Master the history of Shivaji Maharaj forts, Vada Pav street culinary alchemy, and Gudi Padwa.',
      perks: ['Orange Solar Ring Frame', '+50 Bonus Gems', 'Unlock Community Discussions']
    },
    {
      level: 3,
      name: 'Folklore Apprentice',
      rank: 'Folklore Apprentice',
      xpRequired: 250,
      icon: '📜',
      color: '#D97706',
      description: 'Delve into oral bedroom storytelling, Aaji’s Panchatantra wisdom, and sacred temple chants.',
      perks: ['Amber Scholar Frame', 'Audio Folktales Vault Unlocked', 'Exclusive Folklore Quests']
    },
    {
      level: 4,
      name: 'Tradition Keeper',
      rank: 'Tradition Keeper',
      xpRequired: 450,
      icon: '🌿',
      color: '#059669',
      description: 'Preserve authentic weaves like Paithani & Nauvari, and the acoustic magic of Kolhapuri Chappals.',
      perks: ['Emerald Jade Frame', '10% GI-Tagged Marketplace Discount', 'Interactive Textile Simulator']
    },
    {
      level: 5,
      name: 'Sahyadri Vanguard',
      rank: 'Sahyadri Vanguard',
      xpRequired: 700,
      icon: '🛡️',
      color: '#2563EB',
      description: 'Champion Maratha guerilla tactics, Shivaji’s navy, and Murud-Janjira sea fortress engineering.',
      perks: ['Sapphire Warrior Frame', '+100 Cultural Gems', 'High-Speed Mythology Quiz Challenge']
    },
    {
      level: 6,
      name: 'Culture Sage',
      rank: 'Culture Sage',
      xpRequired: 1000,
      icon: '🛕',
      color: '#7C3AED',
      description: 'Attain deep understanding of Ellora Kailasa top-down monolith architecture and Vedic acoustics.',
      perks: ['Royal Amethyst Frame', 'Official Indiverse Scholar Certificate', 'Early Beta Access to South Corridor']
    },
    {
      level: 7,
      name: 'Indiverse Legend',
      rank: 'Indiverse Legend',
      xpRequired: 1400,
      icon: '👑',
      color: '#E11D48',
      description: 'The supreme echelon of Indian cultural preservation. A national beacon from Dadi’s lap to lock screens.',
      perks: ['Golden Crown Frame', 'National Hall of Fame Induction', 'Physical Handcrafted GI Badge Mailed']
    }
  ];

  // Cultural Avatar Presets
  const avatarPresets = [
    { icon: '⚔️', label: 'Maratha Warrior' },
    { icon: '🦚', label: 'Paithani Artisan' },
    { icon: '🕉️', label: 'Vedic Scholar' },
    { icon: '🌿', label: 'Sahyadri Trekker' },
    { icon: '🪕', label: 'Lavani Bard' },
    { icon: '🍲', label: 'Culinary Alchemist' },
    { icon: '⚡', label: 'Gen Z Streetwear' },
    { icon: '👑', label: 'Royal Scion' }
  ];

  // Handle Photo File Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      updateUserProfile({ avatarUrl: base64Url });
      playChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF5500', '#FF8800', '#FFAA00', '#FFFFFF']
      });
      showToast('🎉 Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    playClick();
    updateUserProfile({ avatarUrl: '' });
    showToast('Profile photo removed. Cultural preset avatar active.');
  };

  const handleSaveProfile = () => {
    playClick();
    updateUserProfile({
      name: nameInput.trim() || 'Culture Explorer',
      handle: handleInput.trim().startsWith('@') ? handleInput.trim() : `@${handleInput.trim()}`,
      bio: bioInput.trim(),
      region: regionInput.trim()
    });
    playChime();
    showToast('✨ Profile details saved!');
  };

  // Daily Streak Claim
  const handleClaimDailyXp = () => {
    playClick();
    const claimed = claimDailyXp(25);
    if (claimed) {
      playSitarChord();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FF5500', '#FFA000', '#22C55E', '#FFFFFF']
      });
      showToast('🔥 Daily Streak Extended! +25 XP & +15 Gems Earned!');
    } else {
      showToast('✅ You have already claimed today’s daily blessing. Come back tomorrow!');
    }
  };

  // Daily Quiz Submission
  const handleQuizAnswer = (idx) => {
    if (quizSubmitted) return;
    playClick();
    setSelectedQuizAnswer(idx);
    setQuizSubmitted(true);

    if (idx === 1) { // Correct answer: Peacock (Mor)
      playSitarChord();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#FF5500', '#FFD700']
      });
      if (!quizAwarded) {
        awardXp(50);
        setQuizAwarded(true);
      }
      showToast('🌟 Brilliant! +50 XP awarded for Paithani Mastery!');
    } else {
      playClick();
      showToast('Close! The traditional hallmark of a Paithani pallu is the Peacock (Mor).');
    }
  };

  // Story Reading Quest
  const handleCompleteStoryQuest = () => {
    if (storyRead) return;
    playClick();
    playChime();
    setStoryRead(true);
    awardXp(30);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast('📖 Moral Folktale completed! +30 XP added to your passport!');
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: '40px 0 100px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '16px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 85, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem',
          fontWeight: '700',
          zIndex: 9999
        }}>
          <Sparkles size={18} color="#FF5500" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container">
        
        {/* Navigation & Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button
            onClick={() => { playClick(); onNavigate('home'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FF5500',
              fontWeight: '800',
              fontSize: '0.92rem',
              cursor: 'pointer',
              background: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1.5px solid rgba(255, 85, 0, 0.25)',
              boxShadow: '0 2px 8px rgba(255, 85, 0, 0.08)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFF5F0',
              color: '#FF5500',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: '800',
              border: '1px solid rgba(255, 85, 0, 0.3)'
            }}>
              <Flame size={14} fill="#FF5500" />
              <span>{userData.streak || 3} Day Streak</span>
            </span>

            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#EFF6FF',
              color: '#2563EB',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: '800',
              border: '1px solid #BFDBFE'
            }}>
              <span>💎</span>
              <span>{userData.gems || 150} Gems</span>
            </span>
          </div>
        </div>

        {/* Hero Banner: Identity & Duolingo Level Overview */}
        <div style={{
          position: 'relative',
          padding: '36px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 60%, #FFEFE8 100%)',
          border: '2px solid rgba(255, 85, 0, 0.35)',
          boxShadow: '0 16px 40px rgba(255, 85, 0, 0.09)',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          {/* Subtle background motif */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 85, 0, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            
            {/* Left: Avatar with Camera Upload & Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
              
              {/* Avatar Frame with Upload Trigger */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '26px',
                  border: `3.5px solid ${tierColor}`,
                  boxShadow: `0 8px 25px ${tierColor}44`,
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  {userData.avatarUrl ? (
                    <img 
                      src={userData.avatarUrl} 
                      alt={userData.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <span style={{ fontSize: '2.8rem' }}>
                      {userData.presetAvatar || '⚔️'}
                    </span>
                  )}
                </div>

                {/* Upload Button Overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload custom profile photo"
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#FF5500',
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Camera size={16} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />
              </div>

              {/* User Bio & Handle */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ 
                    fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', 
                    fontWeight: '900', 
                    color: '#0F172A', 
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {userData.name || 'Culture Explorer'}
                  </h1>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: tierColor,
                    color: '#FFFFFF',
                    letterSpacing: '0.04em'
                  }}>
                    LEVEL {level}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}>
                    {userData.handle || '@culture_explorer'}
                  </span>
                  <span style={{ color: '#CBD5E1' }}>•</span>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '0.85rem', 
                    color: '#FF5500', 
                    fontWeight: '800' 
                  }}>
                    <MapPin size={13} />
                    <span>{userData.region || 'Maharashtra Pilot'}</span>
                  </span>
                </div>

                <p style={{
                  fontSize: '0.9rem',
                  color: '#475569',
                  margin: '8px 0 0',
                  maxWidth: '520px',
                  lineHeight: '1.45'
                }}>
                  {userData.bio || 'Exploring 5,000+ years of Bharatiya heritage & folklore. From Dadi’s lap to lock screen! 🚩'}
                </p>
              </div>

            </div>

            {/* Right: Duolingo-style XP & Level Progress Bar */}
            <div style={{
              background: '#FFFFFF',
              padding: '20px 24px',
              borderRadius: '22px',
              border: '1.5px solid rgba(255, 85, 0, 0.25)',
              boxShadow: '0 8px 25px rgba(255, 85, 0, 0.08)',
              minWidth: '280px',
              flex: '1 1 300px',
              maxWidth: '420px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                  {badgeIcon} Level {level} • {rankTitle}
                </span>
                <span style={{ fontSize: '0.92rem', fontWeight: '900', color: '#FF5500' }}>
                  {userData.xp || 0} XP Total
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{
                width: '100%',
                height: '14px',
                borderRadius: '999px',
                background: '#F1F5F9',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${levelProgressPct}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF6600 0%, #FF3D00 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.5s ease',
                  boxShadow: '0 0 12px rgba(255, 85, 0, 0.6)'
                }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', fontWeight: '700' }}>
                <span>{progressInTier} / {range} XP to Level {Math.min(7, level + 1)}</span>
                <span style={{ color: '#FF5500' }}>{xpNeeded} XP needed</span>
              </div>

              {/* Quick Daily Claim Button */}
              <button
                onClick={handleClaimDailyXp}
                style={{
                  marginTop: '14px',
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%)',
                  border: '1.5px solid rgba(255, 85, 0, 0.35)',
                  color: '#FF5500',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FFE3D1')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, #FFF5F0 0%, #FFEBE0 100%)')}
              >
                <Flame size={15} fill="#FF5500" />
                <span>Claim Daily +25 XP Blessing</span>
              </button>
            </div>

          </div>

        </div>

        {/* Tab Navigation Menu */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '32px'
        }}>
          {[
            { id: 'profile', label: '👤 Profile & Identity', desc: 'Avatar, Bio & Presets' },
            { id: 'levels', label: '🏆 Duolingo Levels & Path', desc: '7 Milestone Nodes' },
            { id: 'quests', label: '⚡ Daily Quests & Earn XP', desc: 'Mini-Quizzes & Rewards' },
            { id: 'manifesto', label: '📜 Indiverse Manifesto', desc: '5,000-Year Heritage Vision' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id); }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  background: isActive ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? '1.5px solid #FF5500' : '1.5px solid rgba(255, 85, 0, 0.2)',
                  fontWeight: '800',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 6px 20px rgba(255, 85, 0, 0.3)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.68rem',
                  opacity: isActive ? 0.9 : 0.6,
                  fontWeight: '600'
                }}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFILE & IDENTITY */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            
            {/* Left Card: Edit Profile Details */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px',
              border: '1.5px solid rgba(255, 85, 0, 0.25)',
              boxShadow: '0 8px 30px rgba(255, 85, 0, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Edit Public Identity
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>
                  Realtime Local Sync
                </span>
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(255, 85, 0, 0.25)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      outline: 'none',
                      background: '#FFFDFB'
                    }}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                    Handle (@username)
                  </label>
                  <input
                    type="text"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(255, 85, 0, 0.25)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      outline: 'none',
                      background: '#FFFDFB'
                    }}
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                    Cultural Bio / Motto
                  </label>
                  <textarea
                    rows={3}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(255, 85, 0, 0.25)',
                      fontSize: '0.88rem',
                      fontWeight: '500',
                      outline: 'none',
                      resize: 'vertical',
                      background: '#FFFDFB',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Write a bio..."
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {[
                      'From Dadi’s Lap to Lock Screen 🚩',
                      'Exploring Maharashtra’s 7 Realms ✨',
                      'Vedic wisdom & Gen Z energy ⚡'
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => { playClick(); setBioInput(preset); }}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#FFF5F0',
                          border: '1px solid rgba(255, 85, 0, 0.25)',
                          color: '#FF5500',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#334155', marginBottom: '6px' }}>
                    Home Cultural Region / State
                  </label>
                  <select
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid rgba(255, 85, 0, 0.25)',
                      fontSize: '0.92rem',
                      fontWeight: '600',
                      background: '#FFFDFB',
                      outline: 'none'
                    }}
                  >
                    <option value="Maharashtra Pilot">Maharashtra (Live Pilot)</option>
                    <option value="Karnataka (Expansion)">Karnataka (Next Corridor)</option>
                    <option value="Gujarat (Expansion)">Gujarat (Next Corridor)</option>
                    <option value="Tamil Nadu (Expansion)">Tamil Nadu (Next Corridor)</option>
                    <option value="Rajasthan (Expansion)">Rajasthan (Next Corridor)</option>
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="btn-primary"
                  style={{ marginTop: '8px', justifyContent: 'center' }}
                >
                  <Check size={18} />
                  <span>Save Profile Details</span>
                </button>
              </div>
            </div>

            {/* Right Card: Avatar Selection & Photo Upload Manager */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px',
              border: '1.5px solid rgba(255, 85, 0, 0.25)',
              boxShadow: '0 8px 30px rgba(255, 85, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
                  Avatar & Profile Picture
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', lineHeight: '1.5' }}>
                  Upload a photo from your device just like Instagram or Duolingo, or choose from our handcrafted Indian cultural archetype avatars.
                </p>

                {/* Upload Action Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#FFF5F0',
                  border: '1.5px dashed rgba(255, 85, 0, 0.4)',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    background: '#FF5500',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Upload size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0F172A' }}>
                      Upload Custom Picture
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      PNG, JPG, WebP up to 5MB
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      marginLeft: 'auto',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: '#FF5500',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(255, 85, 0, 0.3)'
                    }}
                  >
                    Select File
                  </button>
                </div>

                {userData.avatarUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#DC2626',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginBottom: '20px'
                    }}
                  >
                    <span>Remove custom photo & use cultural preset</span>
                  </button>
                )}

                {/* Archetype Presets Grid */}
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '800', color: '#334155', marginBottom: '10px' }}>
                  Or Choose Cultural Archetype Preset:
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '10px'
                }}>
                  {avatarPresets.map((preset, idx) => {
                    const isSelected = !userData.avatarUrl && (userData.presetAvatar === preset.icon);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          playClick();
                          updateUserProfile({ presetAvatar: preset.icon, avatarUrl: '' });
                          showToast(`Chosen avatar: ${preset.label}!`);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '12px 6px',
                          borderRadius: '14px',
                          background: isSelected ? '#FFEFE8' : '#F8FAFC',
                          border: isSelected ? '2px solid #FF5500' : '1px solid rgba(0,0,0,0.08)',
                          boxShadow: isSelected ? '0 4px 12px rgba(255, 85, 0, 0.2)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>{preset.icon}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#334155', textAlign: 'center' }}>
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Passport Stats Footer */}
              <div style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#64748B',
                fontWeight: '700'
              }}>
                <span>🎖️ Completed Courses: {userData.completedCourses?.length || 0}</span>
                <span>🏷️ Stamps: {userData.earnedStamps?.length || 0}</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DUOLINGO LEVELS & PATH ROADMAP */}
        {activeTab === 'levels' && (
          <div>
            
            {/* Duolingo Level Path Header */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              border: '1.5px solid rgba(255, 85, 0, 0.25)',
              marginBottom: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: '#FEF3C7',
                    color: '#B45309',
                    letterSpacing: '0.04em'
                  }}>
                    DUOLINGO-STYLE PROGRESSION
                  </span>
                  <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700' }}>
                    7 Milestone Chapters
                  </span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Cultural Mastery Roadmap
                </h2>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0' }}>
                  Earn XP across quizzes, recipes, folklore, and courses to advance your rank and unlock exclusive perks.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  background: '#FFF5F0',
                  border: '1.5px solid rgba(255, 85, 0, 0.3)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                    Current Tier
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FF5500' }}>
                    Level {level}
                  </div>
                </div>

                <div style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                  background: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                    Total Prana XP
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#059669' }}>
                    {userData.xp || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Stepped Interactive Duolingo Tree Path */}
            <div style={{
              position: 'relative',
              maxWidth: '720px',
              margin: '0 auto',
              padding: '20px 0'
            }}>
              
              {/* Central Glowing Connector Line */}
              <div style={{
                position: 'absolute',
                top: '40px',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                borderRadius: '999px',
                background: 'linear-gradient(180deg, #FF5500 0%, #FFA000 50%, #E2E8F0 100%)',
                zIndex: 0
              }} />

              {/* Milestones Vertical List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', position: 'relative', zIndex: 1 }}>
                {milestones.map((m, idx) => {
                  const isUnlocked = (userData.xp || 0) >= m.xpRequired;
                  const isCurrent = level === m.level;
                  const isEven = idx % 2 === 0;

                  return (
                    <div 
                      key={m.level}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isEven ? 'flex-start' : 'flex-end',
                        width: '100%',
                        position: 'relative'
                      }}
                    >
                      {/* Node Center Marker */}
                      <button
                        onClick={() => {
                          playClick();
                          setSelectedMilestone(m);
                        }}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: isUnlocked 
                            ? isCurrent 
                              ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                              : '#FFFFFF'
                            : '#F1F5F9',
                          border: isUnlocked 
                            ? `3.5px solid ${m.color}` 
                            : '3.5px solid #CBD5E1',
                          color: isUnlocked && isCurrent ? '#FFFFFF' : '#0F172A',
                          boxShadow: isUnlocked 
                            ? `0 6px 20px ${m.color}55` 
                            : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          cursor: 'pointer',
                          zIndex: 2,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(-50%) scale(1)')}
                      >
                        {isUnlocked ? m.icon : <Lock size={20} color="#94A3B8" />}
                      </button>

                      {/* Info Card attached to the node */}
                      <div 
                        onClick={() => { playClick(); setSelectedMilestone(m); }}
                        style={{
                          width: 'calc(50% - 50px)',
                          background: '#FFFFFF',
                          borderRadius: '20px',
                          padding: '18px 22px',
                          border: isCurrent 
                            ? '2px solid #FF5500' 
                            : isUnlocked 
                              ? '1.5px solid rgba(255, 85, 0, 0.25)' 
                              : '1.5px solid #E2E8F0',
                          boxShadow: isCurrent 
                            ? '0 10px 25px rgba(255, 85, 0, 0.18)' 
                            : '0 4px 15px rgba(0,0,0,0.04)',
                          cursor: 'pointer',
                          transition: 'transform 0.15s ease',
                          textAlign: isEven ? 'right' : 'left'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: isEven ? 'flex-end' : 'flex-start', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: isUnlocked ? `${m.color}22` : '#F1F5F9',
                            color: isUnlocked ? m.color : '#64748B'
                          }}>
                            {isUnlocked ? (isCurrent ? 'ACTIVE TIER' : 'UNLOCKED') : 'LOCKED'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: '800' }}>
                            {m.xpRequired} XP
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0F172A', margin: '2px 0 4px' }}>
                          Level {m.level}: {m.name}
                        </h4>

                        <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: '1.4' }}>
                          {m.description}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Selected Milestone Modal/Drawer */}
            {selectedMilestone && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(6px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }} onClick={() => setSelectedMilestone(null)}>
                <div 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '32px',
                    maxWidth: '480px',
                    width: '100%',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                    border: '2px solid rgba(255, 85, 0, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background: selectedMilestone.color,
                      color: '#FFFFFF',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 6px 18px ${selectedMilestone.color}55`
                    }}>
                      {selectedMilestone.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: selectedMilestone.color, textTransform: 'uppercase' }}>
                        Level {selectedMilestone.level} • {selectedMilestone.xpRequired} XP
                      </span>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                        {selectedMilestone.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.55', marginBottom: '20px' }}>
                    {selectedMilestone.description}
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Milestone Perks & Rewards:
                    </h5>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedMilestone.perks.map((perk, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', fontWeight: '600' }}>
                          <CheckCircle2 size={16} color={selectedMilestone.color} />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Got It!
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: DAILY QUESTS & EARN XP */}
        {activeTab === 'quests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Daily Quests Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
              color: '#FFFFFF',
              borderRadius: '26px',
              padding: '32px',
              boxShadow: '0 15px 40px rgba(15, 23, 42, 0.15)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '900',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(255, 85, 0, 0.25)',
                  color: '#FF8800',
                  border: '1px solid rgba(255, 85, 0, 0.4)',
                  letterSpacing: '0.04em'
                }}>
                  ⚡ INTERACTIVE XP ARENA
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: '8px 0 6px', color: '#FFFFFF' }}>
                  Daily Cultural Quests & Trivia
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', margin: 0, maxWidth: '580px' }}>
                  Test your folklore memory, claim daily streak blessings, and level up your Indiverse passport instantly.
                </p>
              </div>

              <button
                onClick={handleClaimDailyXp}
                style={{
                  padding: '12px 24px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                  color: '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(255, 85, 0, 0.4)'
                }}
              >
                <Flame size={18} />
                <span>Claim +25 Daily XP</span>
              </button>
            </div>

            {/* Grid of Interactive Quests */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* Quest 1: Live Interactive Cultural Mini-Quiz */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                boxShadow: '0 8px 25px rgba(255, 85, 0, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '900',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#FEF3C7',
                    color: '#B45309'
                  }}>
                    DAILY WEAVE RIDDLE • 50 XP
                  </span>
                  {quizAwarded && (
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', marginBottom: '10px' }}>
                  Which iconic motif is handwoven on the gold-zari pallu of a traditional Paithani saree?
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '18px' }}>
                  A timeless art practiced for over 2,000 years in Paithan on the banks of river Godavari.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'A) Royal Bengal Tiger',
                    'B) The Sacred Peacock (Mor)',
                    'C) Himalayan Snow Leopard',
                    'D) Desert Camels'
                  ].map((option, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === 1;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizSubmitted}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          textAlign: 'left',
                          fontSize: '0.88rem',
                          fontWeight: '700',
                          cursor: quizSubmitted ? 'default' : 'pointer',
                          background: quizSubmitted 
                            ? isCorrect 
                              ? '#DCFCE7' 
                              : isSelected 
                                ? '#FEE2E2' 
                                : '#F8FAFC'
                            : '#F8FAFC',
                          border: quizSubmitted 
                            ? isCorrect 
                              ? '1.5px solid #22C55E' 
                              : isSelected 
                                ? '1.5px solid #EF4444' 
                                : '1px solid rgba(0,0,0,0.08)'
                            : '1.5px solid rgba(255, 85, 0, 0.15)',
                          color: quizSubmitted && isCorrect ? '#15803D' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>{option}</span>
                        {quizSubmitted && isCorrect && <Check size={16} color="#15803D" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: '#FFF5F0', fontSize: '0.82rem', color: '#FF5500', fontWeight: '700' }}>
                    💡 Lore Fact: The Peacock ("Mor-bangadi") motif was patented by royal Maratha patronage and takes pure silk & silver threads up to 6 months to hand-weave!
                  </div>
                )}
              </div>

              {/* Quest 2: Moral Bedside Folktale Snippet */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                boxShadow: '0 8px 25px rgba(255, 85, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#EFF6FF',
                      color: '#1D4ED8'
                    }}>
                      BEDSIDE FOLKTALE • 30 XP
                    </span>
                    {storyRead && (
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Read
                      </span>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                    Rajmata Jijabai’s Terrace Lesson
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    On the stone terraces of Shivneri Fort, young Shivaji was not taught with dry lectures. His mother Jijabai read him tales from the Ramayana, Mahabharata, and Panchatantra under the starlit sky, instilling unyielding ethical justice (Swarajya) and respect for all women.
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={handleCompleteStoryQuest}
                    disabled={storyRead}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      background: storyRead ? '#F1F5F9' : 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                      color: storyRead ? '#64748B' : '#FFFFFF',
                      fontSize: '0.88rem',
                      fontWeight: '800',
                      border: 'none',
                      cursor: storyRead ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <BookOpen size={16} />
                    <span>{storyRead ? 'Quest Completed (+30 XP)' : 'Read & Collect +30 XP'}</span>
                  </button>
                </div>
              </div>

              {/* Quest 3: Cultural Exploration Milestone */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '28px',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                boxShadow: '0 8px 25px rgba(255, 85, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '900',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#FDF2F8',
                      color: '#BE185D'
                    }}>
                      EXPLORER JOURNEY • 100 XP
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                    Dive into the 7 Cultural Pillars
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    Visit the Explore section to inspect Festivals, Clothes, Foods, and Royal Accessories. Every recipe and lore card viewed brings you closer to Level 7 Legend.
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    onClick={() => { playClick(); onNavigate('explore'); }}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Compass size={16} />
                    <span>Open Explore Page</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 4: INDIVERSE MANIFESTO & ABOUT (NO DRAFTS) */}
        {activeTab === 'manifesto' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* The Big Vision Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              padding: '36px',
              border: '2px solid rgba(255, 85, 0, 0.35)',
              boxShadow: '0 12px 35px rgba(255, 85, 0, 0.08)'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#FFF5F0',
                color: '#FF5500',
                fontSize: '0.78rem',
                fontWeight: '900',
                letterSpacing: '0.04em',
                marginBottom: '14px',
                border: '1px solid rgba(255, 85, 0, 0.3)'
              }}>
                OUR OFFICIAL MANIFESTO
              </div>

              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#0F172A', marginBottom: '14px', lineHeight: '1.15' }}>
                “From Dadi’s Lap to Your Lock Screen: Culture, Reimagined for Gen Z”
              </h2>

              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', maxWidth: '820px', marginBottom: '24px' }}>
                India’s heritage is not a static museum exhibit—it is a breathing, dynamic continuum of 5,000+ years. Yet for modern youth, it was too often locked inside dry encyclopedias or solemn textbooks. Indiverse was founded to build a vibrant, digital-native ecosystem where folklore, living crafts, temple acoustics, and culinary secrets become as intuitive and thrilling as your favorite game.
              </p>

              {/* 4 Pillars of the Ecosystem */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '24px' }}>
                {[
                  {
                    icon: '🗣️',
                    title: 'Oral Lore Continuity',
                    desc: 'Preserving the intimacy of bedtime terrace storytelling with authentic folk accents and moral wit.'
                  },
                  {
                    icon: '🎮',
                    title: 'Gamified Mastery',
                    desc: 'Duolingo-style XP, streaks, levels, and digital passports making heritage exploration habitual and rewarding.'
                  },
                  {
                    icon: '🧵',
                    title: 'Fair-Trade Artisans',
                    desc: 'Direct GI-tagged links honoring master weavers, cobblers, brass-casters, and grassroots creators.'
                  },
                  {
                    icon: '👟',
                    title: 'Heritage Streetwear',
                    desc: 'Bridging Paithani silks with oversized hoodies, copper flasks, and modern skate culture.'
                  }
                ].map((pillar, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '22px',
                      borderRadius: '18px',
                      background: '#FFFDFB',
                      border: '1.5px solid rgba(255, 85, 0, 0.2)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{pillar.icon}</div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0F172A', marginBottom: '6px' }}>
                      {pillar.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* National Roadmap & Advisory Council */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              
              {/* National Roadmap */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '30px',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                boxShadow: '0 8px 25px rgba(255, 85, 0, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <Globe size={22} color="#FF5500" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                    National Rollout Phases
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { phase: 'Phase 1: LIVE NOW', title: 'Maharashtra Cultural Pilot', detail: '11 Culinary Legends, 10 Festivals, 10 Living Weaves, 4 GI Crafts.' },
                    { phase: 'Phase 2: IN PRODUCTION', title: 'Dakshin & Maru Corridors', detail: 'Karnataka Hoysala architecture, Tamil Chola bronzes, and Rajasthan blue pottery.' },
                    { phase: 'Phase 3: UPCOMING', title: 'Pan-India 28 States Registry', detail: 'Complete cultural passport with unified state leaderboards and youth hackathons.' }
                  ].map((p, i) => (
                    <div key={i} style={{ padding: '14px', borderRadius: '14px', background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#FF5500' }}>{p.phase}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>{p.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cultural Integrity Pledge */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '30px',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                boxShadow: '0 8px 25px rgba(255, 85, 0, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <Shield size={22} color="#FF5500" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                      Academic & Community Rigor
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: '1.65', marginBottom: '16px' }}>
                    Every folklore story, culinary recipe, and textile timeline on Indiverse is cross-referenced with regional folk historians, certified GI guilds, and community elders to preserve absolute authenticity without mythologizing or stereotyping.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      'Direct engagement with Paithani & Kolhapuri craft clusters',
                      'Zero AI hallucinations on traditional rituals and sacred lore',
                      'Free and open educational access for schools & colleges'
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#334155', fontWeight: '700' }}>
                        <CheckCircle2 size={15} color="#22C55E" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button
                    onClick={() => { playClick(); onNavigate('explore'); }}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>Start Exploring Living Culture</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default InfoPage;
