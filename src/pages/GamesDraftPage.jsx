import React from 'react';
import { Gamepad2, ArrowLeft, Clock, Sparkles, Sword, Layers } from 'lucide-react';
import { playClick } from '../utils/audio';

export function GamesDraftPage({ onNavigate }) {
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

        {/* Section Header */}
        <div style={{
          padding: '40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
          border: '1.5px solid rgba(255, 85, 0, 0.35)',
          boxShadow: '0 10px 30px rgba(255, 85, 0, 0.08)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#FFF0EA',
              border: '1px solid rgba(255, 85, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF5500'
            }}>
              <Gamepad2 size={24} />
            </div>

            <div className="badge-draft">
              <Clock size={12} />
              <span>MODULE 3 OF 6 • BASIC DRAFT STAGE</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', marginBottom: '10px', color: '#0F172A' }}>
            Games
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '720px', lineHeight: '1.6', margin: 0 }}>
            Mythological roleplay, historical war-room strategy, Vikram-Betal riddle mazes, and fast-paced cultural trivia quests built to make Indian heritage intensely playable.
          </p>
        </div>

        {/* Clean Draft Blueprint Wireframe Shell */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          {[
            {
              title: 'Vikram & Betal: Riddle of the 25 Chambers',
              slot: 'Game Engine Shell • In Development',
              desc: 'Moral dilemmas, narrative branches, and logic puzzles rooted in ancient folklore.'
            },
            {
              title: 'Kurukshetra: Strategic Formation Simulator',
              slot: 'Strategy Simulator Shell • In Development',
              desc: 'Chakravyuh tactical chess, archery ballistic mechanics, and epic battle planning.'
            },
            {
              title: 'Panchatantra: Fable Quests',
              slot: 'Adventure RPG Shell • In Development',
              desc: 'Classic animal fable adventures teaching statesmanship, diplomacy, and wit.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="card-hover-crazy"
              style={{
                padding: '28px',
                borderRadius: '20px',
                border: '1.5px dashed rgba(255, 85, 0, 0.4)',
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
                  color: '#FF5500',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#FFF5F0',
                  border: '1px solid rgba(255, 85, 0, 0.25)',
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
            Interactive mini-games and game assets are scheduled for subsequent iterations. Dive into the active Explore feed now!
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
