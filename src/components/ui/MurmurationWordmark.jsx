import { useEffect, useRef } from 'react';

/**
 * Murmuration Wordmark — ported from the 21st.dev component (TSX + Tailwind) to JSX.
 * A flock of starlings folds through a curl-noise current, converges bird by bird into the
 * word, holds it, and scatters again. The pointer is a hawk the flock tears open around.
 *
 * Adapted for the Webscafe hero:
 *  - Transparent: no painted sky, sun or reeds — it sits over the tunnel hero.
 *  - Two-tone ink: birds bound for letters from `accentFrom` onward use `accent`
 *    (e.g. "Webs" white + "cafe" teal), matching the site's gradient wordmark.
 *  - Starts with the word already formed, so the heading reads on arrival.
 *  - Reduced motion: shows the formed word, still (the original froze mid-scatter).
 *  - Hawk listens on window, because the hero's centre is pointer-events: none.
 *  - Word fills more of the box (it is a heading here, not a full-screen sky).
 *
 * Styles: .wordmark in pages.css. Pure canvas, nothing fetched.
 */

// ---- flock helpers (from the original) ----

/** Small seeded PRNG (mulberry32). */
function mmwRandom(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Divergence-free current at (x, y), time t: the curl of travelling waves. Folds, never clumps. */
function mmwCurl(x, y, t) {
  const a = 1.7 * x + t;
  const b = 1.3 * y - 0.6 * t;
  const c = 2.9 * y + 1.1 * x - 0.8 * t;
  const d = 4.3 * x - 3.7 * y + 1.3 * t;
  const dpdx = 1.7 * Math.cos(a) * Math.cos(b) + 0.6 * 1.1 * Math.cos(c) - 0.35 * 4.3 * Math.sin(d);
  const dpdy = -1.3 * Math.sin(a) * Math.sin(b) + 0.6 * 2.9 * Math.cos(c) + 0.35 * 3.7 * Math.sin(d);
  return [dpdy, -dpdx];
}

/** The flock's wandering centre in unit space. */
function mmwCentre(t) {
  return [0.42 * Math.sin(t * 0.21) + 0.12 * Math.sin(t * 0.53 + 1), 0.16 * Math.sin(t * 0.33 + 2) - 0.08];
}

function mmwEase(k) {
  const x = k < 0 ? 0 : k > 1 ? 1 : k;
  return x * x * (3 - 2 * x);
}

/** Pair every bird with a word point, shuffled so the word fills in from everywhere at once. */
function mmwAssign(birds, points, seed) {
  const out = new Int32Array(birds);
  if (points <= 0) return out.fill(-1);
  const order = new Int32Array(points);
  for (let i = 0; i < points; i++) order[i] = i;
  const rand = mmwRandom(seed);
  for (let i = points - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let i = 0; i < birds; i++) out[i] = order[i % points];
  return out;
}

const FORM = 2.4; // seconds to converge into the word
const RELEASE = 0.6; // seconds to let go

export default function MurmurationWordmark({
  word = 'Webscafe',
  accentFrom = 4,
  ink = '#ffffff',
  accent = '#00c2cb',
  birds = 8000,
  flyFor = 4.5,
  holdFor = 4,
  interactive = true,
  fontFamily = '"DM Sans", system-ui, sans-serif',
  className = '',
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const opts = useRef({ flyFor, holdFor, interactive });
  opts.current = { flyFor, holdFor, interactive };

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!root || !ctx) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 1;
    let h = 1;
    let dpr = 1;
    let n = 0;
    let raf = 0;
    let visible = true;
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let depth = new Float32Array(0);
    let phase = new Float32Array(0);
    let target = new Int32Array(0);
    let tx = new Float32Array(0);
    let ty = new Float32Array(0);
    let tAccent = new Uint8Array(0); // 1 = target point belongs to the accent letters
    let hx = -1e5;
    let hy = -1e5;
    let last = performance.now();
    // open mid-hold so the word is legible on arrival
    let clock = Math.max(1, opts.current.flyFor) + FORM;
    const openingHoldEnds = clock + Math.max(0.5, opts.current.holdFor);
    const rand = mmwRandom(11);

    const layout = (reseat = false) => {
      // layout size, not getBoundingClientRect: the hero scales this box with a CSS transform
      w = Math.max(1, root.offsetWidth);
      h = Math.max(1, root.offsetHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      // sample the word into points on a 1x mask
      const m = document.createElement('canvas');
      m.width = w;
      m.height = h;
      const mc = m.getContext('2d', { willReadFrequently: true });
      const xs = [];
      const ys = [];
      const acc = [];
      if (mc) {
        mc.font = `800 100px ${fontFamily}`;
        const wordW = mc.measureText(word || ' ').width || 1;
        const size = Math.min(((w * 0.92) / wordW) * 100, (h * 0.66) / 0.72);
        mc.font = `800 ${size}px ${fontFamily}`;
        mc.textAlign = 'left';
        mc.textBaseline = 'middle';
        const full = mc.measureText(word || ' ').width;
        const left = (w - full) / 2;
        const split = left + mc.measureText(word.slice(0, accentFrom)).width;
        mc.fillText(word || ' ', left, h * 0.52);
        const img = mc.getImageData(0, 0, w, h).data;
        const step = Math.max(2, Math.round(Math.sqrt((w * h) / 90000)));
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            if (img[(y * w + x) * 4 + 3] > 128) {
              xs.push(x + (rand() - 0.5) * step);
              ys.push(y + (rand() - 0.5) * step);
              acc.push(x >= split ? 1 : 0);
            }
          }
        }
      }
      tx = Float32Array.from(xs);
      ty = Float32Array.from(ys);
      tAccent = Uint8Array.from(acc);

      // scale the flock to the box area
      const want = Math.max(1100, Math.round(Math.max(600, Math.min(9000, birds)) * Math.min(1, (w * h) / (1440 * 860))));
      const fresh = want !== n;
      if (fresh) {
        n = want;
        px = new Float32Array(n);
        py = new Float32Array(n);
        vx = new Float32Array(n);
        vy = new Float32Array(n);
        depth = new Float32Array(n);
        phase = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          depth[i] = 0.55 + rand() * 0.45;
          phase[i] = rand() * Math.PI * 2;
        }
      }
      target = mmwAssign(n, tx.length, 23);
      // start (and on resize, re-seat) every bird on its letter
      for (let i = 0; i < n; i++) {
        const ti = target[i];
        if (ti < 0) continue;
        if (fresh || reduced || reseat) {
          px[i] = tx[ti];
          py[i] = ty[ti];
          vx[i] = 0;
          vy[i] = 0;
        }
      }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = reduced ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      const o = opts.current;
      const fly = Math.max(1, o.flyFor);
      const hold = Math.max(0.5, o.holdFor);
      const cycle = fly + FORM + hold + RELEASE;
      const tc = clock % cycle;
      // 0 → 1 while forming, 1 while holding, back to 0 on release
      let pull = 0;
      if (reduced) pull = 1;
      else if (tc > fly && tc <= fly + FORM) pull = mmwEase((tc - fly) / FORM);
      else if (tc > fly + FORM && tc <= fly + FORM + hold) pull = 1;
      else if (tc > fly + FORM + hold) pull = 1 - mmwEase((tc - fly - FORM - hold) / RELEASE);

      const u = Math.min(w, h);
      // smaller birds in a small box, so short letters stay crisp on phones
      const bird = Math.min(1, Math.max(0.55, h / 300));
      const cen = mmwCentre(clock);
      const cxp = w / 2 + cen[0] * w * 0.5;
      const cyp = h * 0.42 + cen[1] * h;
      const t = clock * 0.35;
      const hawk = o.interactive && hx > -1e4;
      const hawkR = u * 0.3;

      for (let i = 0; i < n && dt > 0; i++) {
        const x = px[i];
        const y = py[i];
        let ax = 0;
        let ay = 0;
        const free = 1 - pull;
        // free flight: the current folds the flock, the centre holds it together
        const cv = mmwCurl(((x - w / 2) / u) * 2.2 + depth[i] * 0.25, ((y - h / 2) / u) * 2.2, t);
        ax += cv[0] * 420 * free;
        ay += cv[1] * 420 * free;
        const dxC = cxp - x;
        const dyC = (cyp - y) * 1.6;
        const dC = Math.hypot(dxC, dyC) / u;
        const k = dC < 0.14 ? 0.15 : 0.15 + (dC - 0.14) * 6;
        ax += dxC * k * 2.2 * free;
        ay += dyC * k * 1.6 * free;
        // formation: spring to the bird's point in the word
        const ti = target[i];
        if (pull > 0 && ti >= 0) {
          ax += (tx[ti] - x) * 9 * pull - vx[i] * 3.2 * pull;
          ay += (ty[ti] - y) * 9 * pull - vy[i] * 3.2 * pull;
        }
        // the hawk: a hard shove away inside its radius
        if (hawk) {
          const dx = x - hx;
          const dy = y - hy;
          const d2 = dx * dx + dy * dy;
          if (d2 < hawkR * hawkR) {
            const d = Math.sqrt(d2) + 0.01;
            const f = (1 - d / hawkR) * 5200;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        let nvx = (vx[i] + ax * dt) * (1 - 1.1 * dt);
        let nvy = (vy[i] + ay * dt) * (1 - 1.1 * dt);
        const sp = Math.hypot(nvx, nvy);
        const cap = 520 + 380 * pull;
        if (sp > cap) {
          nvx = (nvx / sp) * cap;
          nvy = (nvy / sp) * cap;
        }
        vx[i] = nvx;
        vy[i] = nvy;
        px[i] = x + nvx * dt;
        py[i] = y + nvy * dt;
        phase[i] += dt * (9 + sp * 0.02);
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      // 4 batched paths: [far, near] × [ink, accent]; near birds read brighter and heavier
      for (let pass = 0; pass < 4; pass++) {
        const near = pass >= 2;
        const isAccent = pass % 2 === 1;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          if (depth[i] > 0.78 !== near) continue;
          const ti = target[i];
          if ((ti >= 0 && tAccent[ti] === 1) !== isAccent) continue;
          const s = (1.6 + depth[i] * 2.2) * (1 - 0.35 * pull) * bird;
          const sp = Math.hypot(vx[i], vy[i]);
          // formed / still birds face right; flying birds face their heading
          const dx = sp > 1 ? vx[i] / sp : 1;
          const dy = sp > 1 ? vy[i] / sp : 0;
          const flap = 0.55 + 0.45 * Math.sin(phase[i]);
          const wx = -dx * s;
          const wy = -dy * s;
          const nx = -dy * s * flap;
          const ny = dx * s * flap;
          ctx.moveTo(px[i] + wx + nx, py[i] + wy + ny);
          ctx.lineTo(px[i], py[i]);
          ctx.lineTo(px[i] + wx - nx, py[i] + wy - ny);
        }
        ctx.strokeStyle = isAccent ? accent : ink;
        // white reads grey at low alpha on the dark hero, so the ink flock stays near-opaque
        ctx.globalAlpha = near ? 1 : isAccent ? 0.6 : 0.88;
        ctx.lineWidth = (near ? 1.35 : 1) * (isAccent ? 1 : 1.15) * Math.max(0.75, bird);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e) => {
      // screen → canvas units (the box may be scaled by a CSS transform)
      const b = canvas.getBoundingClientRect();
      const sx = w / (b.width || 1);
      const sy = h / (b.height || 1);
      hx = (e.clientX - b.left) * sx;
      hy = (e.clientY - b.top) * sy;
      // ignore the pointer when it's nowhere near the word
      if (hx < -80 || hy < -80 || hx > w + 80 || hy > h + 80) hx = hy = -1e5;
    };
    const onLeave = () => {
      hx = hy = -1e5;
    };

    layout();
    raf = requestAnimationFrame(frame);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    const ro = new ResizeObserver(() => layout());
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
    });
    io.observe(root);
    let alive = true;
    // the brand font may land after first paint: re-measure, and if the opening word is still
    // being held, snap birds onto the new letters instead of letting them visibly re-form
    document.fonts?.ready.then(() => alive && layout(clock < openingHoldEnds));

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [word, accentFrom, ink, accent, birds, fontFamily]);

  return (
    <span ref={rootRef} className={`wordmark ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </span>
  );
}
