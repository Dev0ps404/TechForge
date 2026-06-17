import React, { useEffect, useRef } from 'react';

const BackgroundParticles = () => {
  const canvasRef = useRef(null);
  const particleColor = useRef('rgba(255, 255, 255, 0.22)');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const mouse = {
      x: 0,
      y: 0,
      radius: window.innerWidth < 768 ? 130 : 180,
      active: false
    };


    // Detect and update active theme color (increased opacities for brightness)
    const updateThemeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      particleColor.current = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(15, 23, 42, 0.25)';
    };

    updateThemeColor();

    const themeObserver = new MutationObserver(updateThemeColor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Initialize particles to cover the scroll height
    const initParticles = () => {
      const w = window.innerWidth;
      const h = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      
      canvas.width = w;
      canvas.height = h;

      const spacing = w < 768 ? 16 : 12;
      const cols = Math.floor(w / spacing) + 2;
      const rows = Math.floor(h / spacing) + 2;
      
      const newParticles = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const hx = (c - 0.5) * spacing;
          const hy = (r - 0.5) * spacing;
          
          newParticles.push({
            x: hx,
            y: hy,
            hx: hx,
            hy: hy,
            vx: 0,
            vy: 0,
            spring: 0.003 + Math.random() * 0.005,
            damping: 0.90 + Math.random() * 0.03,
            angle: Math.random() * Math.PI * 2,
            angleSpeed: 0.01 + Math.random() * 0.02,
            size: w < 768 ? (Math.random() > 0.5 ? 0.75 : 1.25) : (Math.random() > 0.5 ? 1 : 1.5)
          });
        }
      }
      particles = newParticles;
    };

    initParticles();

    // Mouse event handlers (utilizing getBoundingClientRect for perfect relative coordinate mapping)
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Touch event handlers for mobile devices
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      mouse.radius = window.innerWidth < 768 ? 130 : 180;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // Main requestAnimationFrame loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = particleColor.current;

      const innerHeight = window.innerHeight;
      const innerWidth = window.innerWidth;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      const viewportTop = scrollY - 50;
      const viewportBottom = scrollY + innerHeight + 50;
      const viewportLeft = scrollX - 50;
      const viewportRight = scrollX + innerWidth + 50;

      const pLength = particles.length;
      for (let i = 0; i < pLength; i++) {
        const p = particles[i];

        // VIEWPORT CULLING: Skip particles off-screen to minimize CPU overhead
        if (p.hx < viewportLeft || p.hx > viewportRight || p.hy < viewportTop || p.hy > viewportBottom) {
          // Quickly snap offscreen particle back to its home coordinate
          p.x = p.hx;
          p.y = p.hy;
          p.vx = 0;
          p.vy = 0;
          continue;
        }

        let ax = 0;
        let ay = 0;

        // Apply mouse physics (Google Antigravity orbital & gravity simulation)
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSq = dx * dx + dy * dy;
          const radiusSq = mouse.radius * mouse.radius;

          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq) || 1;
            const force = (mouse.radius - dist) / mouse.radius; // strength drops to 0 at the boundary

            const ux = dx / dist;
            const uy = dy / dist;

            if (dist < 40) {
              // Close repulsion zone
              const pushStrength = (40 - dist) * 0.12;
              ax -= ux * pushStrength;
              ay -= uy * pushStrength;
            } else {
              // Orbit and attraction zone (creates swirl flow)
              const orbitStrength = force * 0.65;
              const attractStrength = force * 0.15;
              
              // Perpendicular unit vector
              const tx = -uy;
              const ty = ux;

              ax += ux * attractStrength + tx * orbitStrength;
              ay += uy * attractStrength + ty * orbitStrength;
            }
          }
        }

        // Return forces to snap particles back to their grid slots
        ax += (p.hx - p.x) * p.spring;
        ay += (p.hy - p.y) * p.spring;

        // Subtle ambient drift wobble
        p.angle += p.angleSpeed;
        ax += Math.cos(p.angle) * 0.03;
        ay += Math.sin(p.angle) * 0.03;

        // Apply inertia and friction (damping)
        p.vx = (p.vx + ax) * p.damping;
        p.vy = (p.vy + ay) * p.damping;
        p.x += p.vx;
        p.y += p.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'normal', zIndex: 0 }}
    />
  );
};

export default BackgroundParticles;
