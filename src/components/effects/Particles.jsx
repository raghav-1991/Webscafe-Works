import { useEffect, useRef } from 'react';

/**
 * Ambient star-dust background — adapted from Magic UI "Particles" (21st.dev).
 * Canvas 2D, eases towards the pointer for a subtle parallax, pauses when the tab is hidden
 * and stays static for users who prefer reduced motion.
 */
export default function Particles({ quantity = 90, color = '0, 170, 255', staticity = 60, ease = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let dots = [];

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      tx: 0,
      ty: 0,
      size: Math.random() * 1.6 + 0.3,
      alpha: 0,
      target: Math.random() * 0.55 + 0.1,
      dx: (Math.random() - 0.5) * 0.12,
      dy: (Math.random() - 0.5) * 0.12,
      mag: 0.1 + Math.random() * 4,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 810 ? Math.round(quantity * 0.5) : quantity;
      dots = Array.from({ length: count }, make);
      if (reduce) {
        dots.forEach((d) => (d.alpha = d.target));
        draw();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        // fade near edges
        const edge = Math.min(d.x, w - d.x, d.y, h - d.y);
        const fade = Math.max(0, Math.min(1, edge / 40));
        d.alpha = reduce ? d.target * fade : d.alpha + (d.target * fade - d.alpha) * 0.05;
        d.x += d.dx;
        d.y += d.dy;
        d.tx += (mouse.x / (staticity / d.mag) - d.tx) / ease;
        d.ty += (mouse.y / (staticity / d.mag) - d.ty) / ease;
        if (d.x < -10 || d.x > w + 10 || d.y < -10 || d.y > h + 10) dots[i] = make();
        ctx.beginPath();
        ctx.arc(d.x + d.tx, d.y + d.ty, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${d.alpha})`;
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      mouse.x = e.clientX - w / 2;
      mouse.y = e.clientY - h / 2;
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (!reduce) raf = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [quantity, color, staticity, ease]);

  return <canvas ref={canvasRef} className="particles-bg" aria-hidden />;
}
