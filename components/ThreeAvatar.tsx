"use client";

import { useEffect, useRef } from "react";

/*
  Intro animation sequence (times in seconds after mount):
  0.0 – 0.9s  → cat-eye slit (pupil is a narrow vertical ellipse)
  0.9 – 1.5s  → expand slit to normal round pupil
  1.5 – 2.1s  → dilate BIG (cute "saw something adorable" overshoot)
  2.1 – 2.7s  → settle back to normal size
  2.7s+        → normal mouse-tracking mode
*/

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export default function ThreeAvatar() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: 0.5, y: 0.5 });
  const current    = useRef({ x: 0.5, y: 0.5 });
  const startTime  = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    startTime.current = performance.now();
    let rafId: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const elapsed = (performance.now() - startTime.current) / 1000;

      /* ── Intro animation state ───────────────────── */
      // pupilScaleX/Y: multipliers on the base pupil radius
      let pupilScaleX = 1;
      let pupilScaleY = 1;
      let trackingWeight = 0; // 0 = ignore mouse (look forward), 1 = full tracking

      if (elapsed < 0.9) {
        // Phase 1 — cat-eye slit: hold still, eyes look forward
        pupilScaleX = 0.08;
        pupilScaleY = 1.0;
        trackingWeight = 0;
      } else if (elapsed < 1.5) {
        // Phase 2 — expand slit → round
        const t = easeOutCubic((elapsed - 0.9) / 0.6);
        pupilScaleX = 0.08 + t * (1.0 - 0.08);
        pupilScaleY = 1.0;
        trackingWeight = 0;
      } else if (elapsed < 2.1) {
        // Phase 3 — dilate BIG with a springy overshoot (cute dilation)
        const t = easeOutBack((elapsed - 1.5) / 0.6);
        const scale = 1 + t * 0.7; // overshoot to ~1.7×
        pupilScaleX = scale;
        pupilScaleY = scale;
        trackingWeight = 0;
      } else if (elapsed < 2.7) {
        // Phase 4 — settle back to normal
        const t = easeOutCubic((elapsed - 2.1) / 0.6);
        const scale = 1.7 - t * 0.7; // 1.7 → 1.0
        pupilScaleX = scale;
        pupilScaleY = scale;
        trackingWeight = t; // start enabling mouse tracking
      } else {
        // Normal mode — full mouse tracking
        pupilScaleX = 1;
        pupilScaleY = 1;
        trackingWeight = 1;
      }

      /* ── Lerp mouse position ─────────────────────── */
      const targetX = trackingWeight < 1
        ? 0.5 + (mouse.current.x - 0.5) * trackingWeight
        : mouse.current.x;
      const targetY = trackingWeight < 1
        ? 0.5 + (mouse.current.y - 0.5) * trackingWeight
        : mouse.current.y;
      current.current.x += (targetX - current.current.x) * 0.1;
      current.current.y += (targetY - current.current.y) * 0.1;

      ctx.clearRect(0, 0, W, H);

      /* ── Eye geometry ────────────────────────────── */
      const R      = Math.min(W, H) * 0.18;
      const iR     = R * 0.52;
      const pR     = R * 0.27;
      const gR     = pR * 0.28;
      const travel = R * 0.32;

      const dx    = (current.current.x - 0.5) * 2;
      const dy    = (current.current.y - 0.5) * 2;
      const angle = Math.atan2(dy, dx);
      const dist  = Math.min(Math.sqrt(dx * dx + dy * dy), 1) * travel;

      const EYES = [
        { cx: W * 0.32, cy: H * 0.5 },
        { cx: W * 0.68, cy: H * 0.5 },
      ];

      for (const { cx, cy } of EYES) {
        const ix = cx + Math.cos(angle) * dist;
        const iy = cy + Math.sin(angle) * dist;

        /* Eyeball */
        const ball = ctx.createRadialGradient(cx, cy - R * 0.15, R * 0.05, cx, cy, R);
        ball.addColorStop(0, "#ffffff");
        ball.addColorStop(1, "#d8e8ff");
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = ball;
        ctx.shadowColor = "rgba(99,179,237,0.25)";
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(120,150,200,0.18)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        /* Iris */
        const iris = ctx.createRadialGradient(ix - iR * 0.2, iy - iR * 0.2, 0, ix, iy, iR);
        iris.addColorStop(0, "#2b7fff");
        iris.addColorStop(0.6, "#1a56db");
        iris.addColorStop(1, "#0e35a0");
        ctx.beginPath();
        ctx.arc(ix, iy, iR, 0, Math.PI * 2);
        ctx.fillStyle = iris;
        ctx.fill();

        /* Pupil — drawn as a scaled ellipse */
        const pw = pR * pupilScaleX;
        const ph = pR * pupilScaleY;

        const pupilGrad = ctx.createRadialGradient(ix, iy, 0, ix, iy, Math.max(pw, ph));
        pupilGrad.addColorStop(0, "#060812");
        pupilGrad.addColorStop(1, "#000000");

        ctx.save();
        ctx.translate(ix, iy);
        ctx.beginPath();
        // Rounded ellipse for smooth interpolation from slit to circle
        ctx.ellipse(0, 0, pw, ph, 0, 0, Math.PI * 2);
        ctx.fillStyle = pupilGrad;
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        /* Glint */
        ctx.beginPath();
        ctx.arc(ix + pR * 0.35, iy - pR * 0.38, gR, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.fill();

        /* Extra sparkle during the cute-dilation phase */
        if (elapsed > 1.5 && elapsed < 2.7) {
          const sparkT = Math.min(1, (elapsed - 1.5) / 0.4);
          const sparkOpacity = sparkT * (1 - Math.min(1, (elapsed - 2.1) / 0.6));
          if (sparkOpacity > 0.01) {
            ctx.save();
            ctx.globalAlpha = sparkOpacity * 0.75;
            // Small 4-point star above-right of iris
            const sx = cx + iR * 0.55;
            const sy = cy - iR * 0.55;
            const sr = iR * 0.14;
            for (let i = 0; i < 4; i++) {
              const a = (i / 4) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + Math.cos(a) * sr, sy + Math.sin(a) * sr);
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            ctx.restore();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={420}
      height={320}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "transparent",
      }}
    />
  );
}
