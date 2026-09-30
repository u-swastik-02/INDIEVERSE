import React, { useEffect, useRef } from 'react';

export function OrangeredBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Floating energetic orange sparks / sun particles
    const particleCount = 38;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.25,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.018;
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Pristine White Base with Soft Warm Tint
      ctx.fillStyle = '#FAFBFC';
      ctx.fillRect(0, 0, width, height);

      // 2. Crazy Radiant Orange Auras
      // Dynamic cursor aura
      const cursorGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.42
      );
      cursorGlow.addColorStop(0, 'rgba(255, 85, 0, 0.12)');
      cursorGlow.addColorStop(0.35, 'rgba(255, 140, 0, 0.05)');
      cursorGlow.addColorStop(1, 'rgba(250, 251, 252, 0)');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // Ambient top-center warm orange aura
      const topAura = ctx.createRadialGradient(
        width * 0.5,
        height * 0.2,
        0,
        width * 0.5,
        height * 0.2,
        Math.min(width, height) * 0.65
      );
      topAura.addColorStop(0, 'rgba(255, 110, 0, 0.09)');
      topAura.addColorStop(0.6, 'rgba(255, 170, 0, 0.02)');
      topAura.addColorStop(1, 'rgba(250, 251, 252, 0)');
      ctx.fillStyle = topAura;
      ctx.fillRect(0, 0, width, height);

      // 3. Halftone Concentric Circles (Indiverse Logo Motif in Orange & White)
      const ringCenterX = width / 2 + (mouse.x - width / 2) * 0.035;
      const ringCenterY = height * 0.4 + (mouse.y - height / 2) * 0.035;
      const ringCount = 11;
      const baseSpacing = Math.min(width, height) * 0.046;

      for (let r = 1; r <= ringCount; r++) {
        const radius = r * baseSpacing + Math.sin(time * 1.2 + r * 0.4) * 8;
        const dotsInRing = r * 10;
        const ringRotation = time * (0.09 / (r * 0.4 + 1)) * (r % 2 === 0 ? 1 : -1);

        for (let d = 0; d < dotsInRing; d++) {
          const angle = (d / dotsInRing) * Math.PI * 2 + ringRotation;
          const px = ringCenterX + Math.cos(angle) * radius;
          const py = ringCenterY + Math.sin(angle) * radius;

          // Distance from mouse gives interactive crazy ripple
          const distToMouse = Math.hypot(px - mouse.x, py - mouse.y);
          const mouseFactor = Math.max(0, 1 - distToMouse / 260);

          const dotRadius = (1.2 + mouseFactor * 2.8) * (1 - r / (ringCount + 3));
          const alpha = (0.16 + mouseFactor * 0.7) * (1 - r / (ringCount + 4));

          ctx.beginPath();
          ctx.arc(px, py, Math.max(0.7, dotRadius), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${75 + Math.floor(mouseFactor * 45)}, 0, ${alpha})`;
          ctx.fill();
        }
      }

      // 4. Floating Orange Sparks / Cultural Embers
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }

        const currentRadius = p.radius + Math.sin(time * 2 + p.pulseOffset) * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 95, 10, ${p.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 85, 0, 0.45)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#FAFBFC',
      }}
    />
  );
}
