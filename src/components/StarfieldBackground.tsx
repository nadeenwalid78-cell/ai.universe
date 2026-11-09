import React, { useEffect, useRef } from "react";

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Pre-generate realistic star catalog with spectral classes (O/B blue, A white, G yellow, K/M amber)
    const starColors = ["#e2e8f0", "#bae6fd", "#fef08a", "#c4b5fd", "#fed7aa"];
    const stars = Array.from({ length: 190 }, (_, i) => ({
      x: ((Math.sin(i * 19.19) * 10000) % 1 + 1) % 1,
      y: ((Math.cos(i * 73.37) * 10000) % 1 + 1) % 1,
      radius: 0.4 + (((i * 29) % 10) / 10) * 1.4,
      color: starColors[i % starColors.length],
      twinkleSpeed: 0.4 + (i % 7) * 0.25,
      phase: i * 1.3,
    }));

    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      // Subtle deep-space cosmic nebula glow
      const neb1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.25,
        20,
        width * 0.2,
        height * 0.25,
        width * 0.45
      );
      neb1.addColorStop(0, "rgba(76, 29, 149, 0.14)");
      neb1.addColorStop(0.5, "rgba(30, 58, 138, 0.06)");
      neb1.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(
        width * 0.82,
        height * 0.7,
        20,
        width * 0.82,
        height * 0.7,
        width * 0.4
      );
      neb2.addColorStop(0, "rgba(14, 116, 144, 0.10)");
      neb2.addColorStop(0.6, "rgba(88, 28, 135, 0.05)");
      neb2.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const alpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(elapsed * s.twinkleSpeed + s.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
