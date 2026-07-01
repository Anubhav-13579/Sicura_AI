import { useEffect, useRef } from 'react';

export default function ParticleWaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse position tracking
    const mouse = {
      x: null,
      y: null,
      active: false
    };

    // Track mouse events
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle class for Plexus Connection Web
    class ConstellationParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // Slow, elegant drift speeds
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.45 + 0.15;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.size = Math.random() * 2 + 1;
      }

      update() {
        // Interactivity: gentle push away from cursor
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pushRadius = 140;

          if (dist < pushRadius) {
            // Push force scales up as distance gets smaller
            const force = (pushRadius - dist) / pushRadius * 0.08;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force;
            this.vy += Math.sin(angle) * force;
          }
        }

        // Limit speed to prevent chaotic flying
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          this.vx = (this.vx / speed) * maxSpeed;
          this.vy = (this.vy / speed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen boundaries with a small padding
        if (this.x < 10 || this.x > width - 10) this.vx = -this.vx;
        if (this.y < 10 || this.y > height - 10) this.vy = -this.vy;
      }

      getColor(alpha = 1) {
        const xPercent = Math.min(1, Math.max(0, this.x / width));
        if (xPercent < 0.5) {
          const ratio = xPercent * 2;
          const r = Math.round(56 + (139 - 56) * ratio);
          const g = Math.round(189 + (92 - 189) * ratio);
          const b = Math.round(248 + (246 - 248) * ratio);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        } else {
          const ratio = (xPercent - 0.5) * 2;
          const r = Math.round(139 + (236 - 139) * ratio);
          const g = Math.round(92 + (72 - 92) * ratio);
          const b = Math.round(246 + (153 - 246) * ratio);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.getColor(0.85);
        ctx.fill();

        // Draw a soft glowing halo around larger particles
        if (this.size > 2.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = this.getColor(0.12);
          ctx.fill();
        }
      }
    }

    const particleCount = 125; // Increased density
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new ConstellationParticle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.forEach(p => {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      });
    };
    window.addEventListener('resize', handleResize);

    const connectionLimit = 110; // Max distance for particle-to-particle connections
    const mouseConnectionLimit = 150; // Larger reach for mouse interactions

    // Main animation loop
    const animate = () => {
      // Clear frame
      ctx.fillStyle = '#0a0514';
      ctx.fillRect(0, 0, width, height);

      // Update particles
      particles.forEach(p => p.update());

      // Draw connection lines between particles
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        
        // 1. Particle-to-Particle Connections
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionLimit) {
            const alpha = (1 - dist / connectionLimit) * 0.25;

            // Draw glowing gradient connection line
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, p1.getColor(alpha));
            grad.addColorStop(1, p2.getColor(alpha));

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // 2. Mouse-to-Particle Connections
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseConnectionLimit) {
            // Stronger connection line glow for active mouse interaction
            const alpha = (1 - mdist / mouseConnectionLimit) * 0.42;

            // Gradient starting with cursor (white/cyan) fading to particle color
            const mouseGrad = ctx.createLinearGradient(mouse.x, mouse.y, p1.x, p1.y);
            mouseGrad.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
            mouseGrad.addColorStop(1, p1.getColor(alpha));

            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = mouseGrad;
            ctx.lineWidth = 1.1; // Slightly thicker line for mouse connection
            ctx.stroke();
          }
        }
      }

      // Draw particles on top
      particles.forEach(p => p.draw());

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
        backgroundColor: '#0a0514',
      }}
    />
  );
}


