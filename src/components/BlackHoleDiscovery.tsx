import React, { useEffect, useRef, useState } from "react";
import {
  BLACK_HOLE_ANATOMY,
  BLACK_HOLE_FACTS,
  Language,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import { Sparkles, Eye } from "lucide-react";

interface BlackHoleDiscoveryProps {
  language: Language;
  onAskAiAbout: (prompt: string) => void;
}

export const BlackHoleDiscovery: React.FC<BlackHoleDiscoveryProps> = ({
  language,
  onAskAiAbout,
}) => {
  const t = UI_TRANSLATIONS[language].blackHoles;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Relativistic Parameters
  const [massSolar, setMassSolar] = useState<number>(10); // 10 to 1000 M_sun
  const [probeDistanceRs, setProbeDistanceRs] = useState<number>(2.5); // 1.05 to 10.0 R_s
  const [kerrSpin, setKerrSpin] = useState<number>(0.75); // 0.0 to 0.99
  const [showLensingGrid, setShowLensingGrid] = useState<boolean>(true);

  // Real Relativistic Astrophysics Calculations
  // Schwarzschild radius: R_s = 2GM / c^2 ≈ 2.953 km per Solar Mass
  const schwarzschildKm = (massSolar * 2.95325).toFixed(1);
  // Gravitational Time Dilation: dt_inf / dt_0 = 1 / sqrt(1 - R_s / r)
  const ratio = Math.min(1 / probeDistanceRs, 0.99);
  const timeDilationFactor = (1 / Math.sqrt(1 - ratio)).toFixed(3);
  // Local Escape Velocity: v_esc / c = sqrt(R_s / r)
  const escapeVelPercentC = (Math.sqrt(ratio) * 100).toFixed(1);

  const tidalStatus =
    probeDistanceRs <= 1.5
      ? {
          code: "critical",
          label:
            language === "ar"
              ? "✖ داخل كرة الفوتونات — قوى مد حرجة"
              : "✖ Inside Photon Sphere — Extreme Tidal Shear",
          color: "text-rose-400",
        }
      : probeDistanceRs <= 3.0
      ? {
          code: "elevated",
          label:
            language === "ar"
              ? "▲ نطاق ISCO — انحناء زمكاني شديد"
              : "▲ Relativistic Regime — Strong Curvature",
          color: "text-amber-400",
        }
      : {
          code: "nominal",
          label:
            language === "ar"
              ? "● مدار مستقر خارج منطقة الخطر"
              : "● Stable Orbital Zone",
          color: "text-emerald-400",
        };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const width = 640;
    const height = 400;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.fillStyle = "#04060c";
      ctx.fillRect(0, 0, width, height);

      // Visual scale of Event Horizon radius on canvas
      const rsPx = 28 + Math.log10(massSolar) * 16;
      const photonSpherePx = rsPx * 1.5;

      // 1. Einstein Gravitational Lensing Spacetime Grid
      if (showLensingGrid) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.16)";
        ctx.lineWidth = 1;
        const gridSpacing = 32;

        // Horizontal lensed lines
        for (let y = 16; y < height; y += gridSpacing) {
          ctx.beginPath();
          for (let x = 0; x <= width; x += 12) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.max(Math.hypot(dx, dy), rsPx * 0.7);
            const deflection = (rsPx * rsPx * 1.35) / (dist * dist + 180);
            const wx = x - dx * deflection * 0.45;
            const wy = y - dy * deflection * 0.45;
            if (x === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }

        // Vertical lensed lines
        for (let x = 16; x < width; x += gridSpacing) {
          ctx.beginPath();
          for (let y = 0; y <= height; y += 12) {
            const dx = x - cx;
            const dy = y - cy;
            const dist = Math.max(Math.hypot(dx, dy), rsPx * 0.7);
            const deflection = (rsPx * rsPx * 1.35) / (dist * dist + 180);
            const wx = x - dx * deflection * 0.45;
            const wy = y - dy * deflection * 0.45;
            if (y === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.stroke();
        }
      }

      // 2. Lensed Upper & Lower Accretion Disk Halo (Bent light from behind the black hole)
      const upperLensed = ctx.createRadialGradient(
        cx,
        cy,
        rsPx * 1.02,
        cx,
        cy,
        rsPx * 2.5
      );
      upperLensed.addColorStop(0, "rgba(254, 240, 138, 0.85)");
      upperLensed.addColorStop(0.28, "rgba(245, 158, 11, 0.55)");
      upperLensed.addColorStop(0.62, "rgba(139, 92, 246, 0.25)");
      upperLensed.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = upperLensed;
      ctx.beginPath();
      ctx.arc(cx, cy, rsPx * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Relativistic Accretion Disk (Doppler-beamed: brighter on approaching left side)
      const spinSpeed = 1.2 + kerrSpin * 2.8;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.14);

      for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2 + elapsed * spinSpeed;
        const rOrbit = rsPx * (1.55 + (i % 7) * 0.28);
        const px = Math.cos(angle) * rOrbit * 1.65;
        const py = Math.sin(angle) * rOrbit * 0.36;

        // Doppler beaming: particles moving toward observer (left side, sin(angle) > 0) appear blue-white/brighter
        const doppler = 0.55 + 0.45 * -Math.cos(angle);
        ctx.fillStyle =
          doppler > 0.72
            ? `rgba(254, 249, 195, ${doppler})`
            : `rgba(249, 115, 22, ${doppler * 0.85})`;
        ctx.beginPath();
        ctx.ellipse(
          px,
          py,
          10 + (i % 4) * 4,
          2.2,
          angle * 0.15,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();

      // 4. Photon Sphere Dashed Ring (1.5 Rs)
      ctx.strokeStyle = "rgba(253, 224, 71, 0.65)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, photonSpherePx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Event Horizon Shadow (1.0 Rs)
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, rsPx, 0, Math.PI * 2);
      ctx.fill();

      // Razor-sharp relativistic photon ring edge
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, rsPx + 1, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Observer / Scientific Probe Marker at (probeDistanceRs * rsPx)
      const probeOrbitPx = Math.min(probeDistanceRs * rsPx, width * 0.44);
      const probeAngle = elapsed * 0.45;
      const probeX = cx + Math.cos(probeAngle) * probeOrbitPx;
      const probeY = cy + Math.sin(probeAngle) * (probeOrbitPx * 0.55);

      // Probe orbit trace
      ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        probeOrbitPx,
        probeOrbitPx * 0.55,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Probe icon
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(probeX, probeY, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#bae6fd";
      ctx.font = "600 11px 'JetBrains Mono', monospace";
      ctx.fillText(
        `r = ${probeDistanceRs.toFixed(2)} Rs (${timeDilationFactor}× dt)`,
        probeX + 10,
        probeY + 4
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [massSolar, probeDistanceRs, kerrSpin, showLensingGrid, timeDilationFactor]);

  return (
    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono tracking-wider text-cyan-400 uppercase mb-1.5">
          {t.kicker}
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2">
          {t.title}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Two-Zone Sandbox Layout (Education & Simulations Reference §2.A) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Left Zone (7 cols): Interactive Event Horizon & Gravitational Lensing Stage */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{t.simTitle}</h3>
              <p className="text-xs text-slate-400">{t.simSubtitle}</p>
            </div>
            <button
              onClick={() => setShowLensingGrid((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors whitespace-nowrap shrink-0 ${
                showLensingGrid
                  ? "bg-slate-800 border-cyan-500/50 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline me-1.5" />
              {t.lensingToggle}: {showLensingGrid ? "ON" : "OFF"}
            </button>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#04060c] mb-5">
            <canvas
              ref={canvasRef}
              className="w-full h-[320px] sm:h-[380px] object-cover"
            />
          </div>

          {/* Real-Time Relativistic Telemetry Readout Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="block text-xs text-slate-400 mb-1">
                {t.schwarzschildLabel}
              </span>
              <span className="text-lg font-mono font-bold text-white tabular-nums">
                {schwarzschildKm}
              </span>
              <span className="text-xs font-mono text-cyan-400 ms-1">km</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="block text-xs text-slate-400 mb-1">
                {t.timeDilationLabel}
              </span>
              <span className="text-lg font-mono font-bold text-violet-300 tabular-nums">
                {timeDilationFactor}×
              </span>
              <span className="text-xs font-mono text-slate-400 ms-1">
                Δt∞/Δt0
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="block text-xs text-slate-400 mb-1">
                {t.escapeVelocityLabel}
              </span>
              <span className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                {escapeVelPercentC}%
              </span>
              <span className="text-xs font-mono text-slate-400 ms-1">c</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="block text-xs text-slate-400 mb-1">
                {t.tidalForceLabel}
              </span>
              <span
                className={`text-xs font-mono font-semibold leading-snug block ${tidalStatus.color}`}
              >
                {tidalStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right Zone (5 cols): Control Deck & Parameter Sliders */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <span className="block text-xs font-mono text-cyan-400 uppercase mb-2">
              RELATIVISTIC PARAMETER DECK
            </span>
            <h3 className="text-xl font-bold text-white mb-4">
              {language === "ar"
                ? "معايير حقل الجاذبية وأفق الحدث"
                : "Spacetime Curvature Controls"}
            </h3>

            {/* Sliders with Visible Labels, Numeric Values, and Units */}
            <div className="space-y-5 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="bh-mass" className="text-slate-200 font-medium">
                    {t.massSlider}
                  </label>
                  <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                    {massSolar} M☉
                  </span>
                </div>
                <input
                  id="bh-mass"
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={massSolar}
                  onChange={(e) => setMassSolar(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                  <span>5 M☉ (Stellar)</span>
                  <span>250 M☉</span>
                  <span>500 M☉ (Intermediate)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label
                    htmlFor="bh-distance"
                    className="text-slate-200 font-medium"
                  >
                    {t.distanceSlider}
                  </label>
                  <span className="font-mono text-violet-300 font-semibold tabular-nums">
                    {probeDistanceRs.toFixed(2)} Rs
                  </span>
                </div>
                <input
                  id="bh-distance"
                  type="range"
                  min="1.05"
                  max="8.0"
                  step="0.05"
                  value={probeDistanceRs}
                  onChange={(e) =>
                    setProbeDistanceRs(parseFloat(e.target.value))
                  }
                  className="w-full accent-violet-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                  <span>1.05 Rs (Near Horizon)</span>
                  <span>1.50 Rs (Photon Sphere)</span>
                  <span>8.00 Rs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="bh-spin" className="text-slate-200 font-medium">
                    {t.spinSlider}
                  </label>
                  <span className="font-mono text-amber-300 font-semibold tabular-nums">
                    a* = {kerrSpin.toFixed(2)}
                  </span>
                </div>
                <input
                  id="bh-spin"
                  type="range"
                  min="0.0"
                  max="0.98"
                  step="0.02"
                  value={kerrSpin}
                  onChange={(e) => setKerrSpin(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                  <span>0.00 (Schwarzschild)</span>
                  <span>0.50</span>
                  <span>0.98 (Extreme Kerr)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {language === "ar"
                ? `عند مسافة ${probeDistanceRs.toFixed(2)} من نصف قطر شفارتزشيلد، فإن كل ساعة واحدة تمر على ساعة المسبار تعادل ${timeDilationFactor} ساعة بالنسبة لراصد بعيد على الأرض.`
                : `At ${probeDistanceRs.toFixed(2)} Schwarzschild radii, 1.00 hour of proper time onboard the probe equals ${timeDilationFactor} hours for a distant observer on Earth.`}
            </p>
            <button
              onClick={() =>
                onAskAiAbout(
                  language === "ar"
                    ? "اشرح بلغة علمية مبسطة ماذا يحدث للضوء والزمن عند الاقتراب من أفق الحدث للثقب الأسود وكيف التقط العلماء صورة الثقب الأسود M87*."
                    : "Explain in clear scientific terms what happens to light and time near a black hole's event horizon, and how the Event Horizon Telescope imaged M87*."
                )
              }
              className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === "ar"
                  ? "اسأل المرشد الفضائي الذكي عن فيزياء الثقوب السوداء"
                  : "Ask AI Space Guide About Black Hole Physics"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Anatomy of a Black Hole & Scientific Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white mb-5">
            {t.anatomyTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BLACK_HOLE_ANATOMY.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    {item.title[language]}
                  </h4>
                  <span className="inline-block text-xs font-mono text-cyan-400 mb-2.5">
                    {item.formula}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description[language]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
          <h3 className="text-xl font-bold text-white mb-5">{t.factsTitle}</h3>
          <div className="space-y-4">
            {BLACK_HOLE_FACTS.map((fact, idx) => (
              <div
                key={idx}
                className="pb-4 last:pb-0 border-b last:border-b-0 border-slate-800/80 flex items-start gap-3"
              >
                <span className="font-mono text-xs text-violet-400 font-semibold tabular-nums mt-0.5">
                  0{idx + 1}.
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {fact[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
