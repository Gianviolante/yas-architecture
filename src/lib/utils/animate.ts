// YAS easing: cubic-bezier(0.77, 0, 0.18, 1) — Newton-Raphson identico ai browser.
export function makeCubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const sX  = (t: number) => 3*t*(1-t)*(1-t)*x1 + 3*t*t*(1-t)*x2 + t*t*t;
  const sY  = (t: number) => 3*t*(1-t)*(1-t)*y1 + 3*t*t*(1-t)*y2 + t*t*t;
  const dsX = (t: number) => 3*(1-t)*(1-t)*x1 + 6*t*(1-t)*(x2-x1) + 3*t*t*(1-x2);
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = dsX(t); if (Math.abs(d) < 1e-9) break;
      t -= (sX(t) - x) / d;
    }
    return t;
  };
  return (x: number) => sY(solve(x));
}
export const groppiEase = makeCubicBezier(0.77, 0, 0.18, 1);
export const easeLinear = (t: number) => t; // Simple linear easing

// Anima `from → to` chiamando onUpdate ad ogni frame via rAF. Restituisce una funzione cancel.
export function animateValue(
  from: number,
  to: number,
  duration: number,
  ease: (t: number) => number,
  onUpdate: (v: number) => void,
): () => void {
  let startTime: number | null = null;
  let rafId: number;
  const tick = (now: number) => {
    if (startTime === null) startTime = now;
    const p = Math.min((now - startTime) / duration, 1);
    onUpdate(from + (to - from) * ease(p));
    if (p < 1) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}
