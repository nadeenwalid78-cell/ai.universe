import React, { useEffect, useRef, useState } from "react";
import {
  GALAXIES_DATA,
  GalaxyData,
  Language,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import { Sparkles, Sliders, Camera, Orbit } from "lucide-react";

interface GalaxyExplorerProps {
  language: Language;
  onAskAiAbout: (prompt: string) => void;
  selectedGalaxyId?: string;
  onSelectGalaxy?: (galaxyId: string) => void;
}

const GALAXY_CREDITS: Record<string, { en: string; ar: string }> = {
  "milky-way": {
    en: "NASA / JPL-Caltech / Chandra / Hubble / Spitzer Great Observatories",
    ar: "وكالة ناسا · مراصد هابل وسبيتزر وتشاندرا الفضائية",
  },
  andromeda: {
    en: "NASA / JPL-Caltech / GALEX / Spitzer Space Telescope (M31)",
    ar: "وكالة ناسا · تلسكوب غاليكس وسبيتزر الفضائي (M31)",
  },
  sombrero: {
    en: "NASA / ESA / Hubble Space Telescope & Spitzer Observatory (M104)",
    ar: "وكالة ناسا وتلسكوب هابل الفضائي · مجرة سومبريرو (M104)",
  },
  "messier-87": {
    en: "NASA / JPL-Caltech / Event Horizon & Spitzer Observatory (Virgo A / M87)",
    ar: "وكالة ناسا · تلسكوب أفق الحدث ومرصد سبيتزر (M87)",
  },
  whirlpool: {
    en: "NASA / ESA / Hubble Space Telescope ACS (Whirlpool Galaxy M51)",
    ar: "وكالة ناسا وتلسكوب هابل الفضائي · مجرة الدوامة (M51)",
  },
  lmc: {
    en: "NASA / ESA / Spitzer & Hubble Archival Survey (Large Magellanic Cloud)",
    ar: "وكالة ناسا ووكالة الفضاء الأوروبية · سحابة ماجلان الكبرى",
  },
};

/**
 * Procedural Astrophysical Galaxy Canvas Renderer
 * Renders authentic spiral arms, barred nuclei, elliptical halos, Sombrero dust lanes,
 * or relativistic jets (M87) plus an interactive Milky Way-Andromeda merger mode!
 */
const GalaxyAstrophotoCanvas: React.FC<{
  galaxy: GalaxyData;
  customTightness: number;
  customBar: number;
  mergerProgress: number; // 0 to 4.5 billion years
}> = ({ galaxy, customTightness, customBar, mergerProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const width = 560;
    const height = 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const startTime = performance.now();

    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    const starCount = 1100;
    const stars = Array.from({ length: starCount }, (_, i) => {
      const rNorm = Math.pow(pseudoRand(i * 1.7), 0.78);
      const armIndex =
        galaxy.visualPreset.armCount > 0
          ? i % galaxy.visualPreset.armCount
          : 0;
      const spread = (pseudoRand(i * 3.3) - 0.5) * 0.65;
      const zSpread = (pseudoRand(i * 5.9) - 0.5) * 16;
      const size = 0.6 + pseudoRand(i * 9.1) * 1.6;
      const isHII = i % 14 === 0 && rNorm > 0.25;
      return { rNorm, armIndex, spread, zSpread, size, isHII };
    });

    const drawSingleGalaxy = (
      cx: number,
      cy: number,
      maxR: number,
      rotAngle: number,
      inclinationRad: number,
      armCount: number,
      tightness: number,
      barLen: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, Math.max(0.18, Math.cos(inclinationRad)));

      const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, maxR * 1.15);
      halo.addColorStop(0, galaxy.visualPreset.coreColor);
      halo.addColorStop(0.25, `${galaxy.visualPreset.armColor}55`);
      halo.addColorStop(0.65, `${galaxy.visualPreset.dustColor}22`);
      halo.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, maxR * 1.15, 0, Math.PI * 2);
      ctx.fill();

      if (barLen > 0.05) {
        ctx.save();
        ctx.rotate(rotAngle);
        const barGrad = ctx.createLinearGradient(
          -maxR * barLen,
          0,
          maxR * barLen,
          0
        );
        barGrad.addColorStop(0, "rgba(254, 240, 138, 0)");
        barGrad.addColorStop(0.5, galaxy.visualPreset.coreColor);
        barGrad.addColorStop(1, "rgba(254, 240, 138, 0)");
        ctx.strokeStyle = barGrad;
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(-maxR * barLen, 0);
        ctx.lineTo(maxR * barLen, 0);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const r = s.rNorm * maxR;
        let theta = rotAngle;
        if (armCount > 0) {
          const baseArmAngle = (s.armIndex / armCount) * Math.PI * 2;
          const spiralWind = s.rNorm * (tightness * 10.5);
          theta += baseArmAngle + spiralWind + s.spread;
        } else {
          theta += i * 2.39996;
        }

        const x = Math.cos(theta) * r;
        const y = Math.sin(theta) * r + s.zSpread * 0.25;

        if (s.isHII && armCount > 0) {
          ctx.fillStyle = "#f472b6";
          ctx.globalAlpha = 0.78;
          ctx.beginPath();
          ctx.arc(x, y, s.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle =
            s.rNorm < 0.24
              ? galaxy.visualPreset.coreColor
              : galaxy.visualPreset.armColor;
          ctx.globalAlpha = (1 - s.rNorm * 0.55) * 0.85;
          ctx.fillRect(x, y, s.size, s.size);
        }
      }
      ctx.globalAlpha = 1;

      ctx.restore();

      if (galaxy.id === "sombrero") {
        ctx.save();
        ctx.translate(cx, cy + 4);
        ctx.strokeStyle = "rgba(9, 10, 15, 0.88)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, maxR * 0.95, maxR * 0.14, 0, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      if (galaxy.visualPreset.hasRelativisticJet) {
        ctx.save();
        ctx.translate(cx, cy);
        const jetGrad = ctx.createLinearGradient(0, 0, maxR * 0.95, -maxR * 0.65);
        jetGrad.addColorStop(0, "#ffffff");
        jetGrad.addColorStop(0.3, "#38bdf8");
        jetGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.strokeStyle = jetGrad;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxR * 0.95, -maxR * 0.65);
        ctx.stroke();
        ctx.restore();
      }
    };

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.fillStyle = "#05070e";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 60; i++) {
        const bx = (i * 97) % width;
        const by = (i * 53) % height;
        ctx.fillStyle = "rgba(226, 232, 240, 0.35)";
        ctx.fillRect(bx, by, 1.2, 1.2);
      }

      const incRad = (galaxy.visualPreset.inclinationDeg * Math.PI) / 180;
      const rot = elapsed * 0.16;

      if (mergerProgress > 0.1) {
        const tNorm = Math.min(mergerProgress / 4.5, 1);
        const sep = (1 - tNorm) * 140;
        const angle = tNorm * Math.PI * 1.3;
        const gx1 = width / 2 - Math.cos(angle) * sep;
        const gy1 = height / 2 - Math.sin(angle) * sep * 0.45;
        const gx2 = width / 2 + Math.cos(angle) * sep;
        const gy2 = height / 2 + Math.sin(angle) * sep * 0.45;

        const effectiveArms =
          tNorm > 0.88 ? 0 : galaxy.visualPreset.armCount || 2;
        drawSingleGalaxy(
          gx1,
          gy1,
          105,
          rot,
          incRad * (1 - tNorm * 0.5),
          effectiveArms,
          customTightness,
          customBar
        );
        drawSingleGalaxy(
          gx2,
          gy2,
          95,
          -rot * 1.2,
          0.6 * (1 - tNorm * 0.5),
          effectiveArms,
          customTightness * 0.85,
          0.1
        );
      } else {
        drawSingleGalaxy(
          width / 2,
          height / 2,
          135,
          rot,
          incRad,
          galaxy.visualPreset.armCount,
          customTightness,
          customBar
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [galaxy, customTightness, customBar, mergerProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[280px] sm:h-[340px] rounded-xl border border-slate-800 bg-[#05070e] object-cover"
    />
  );
};

export const GalaxyExplorer: React.FC<GalaxyExplorerProps> = ({
  language,
  onAskAiAbout,
  selectedGalaxyId: externalGalaxyId,
  onSelectGalaxy,
}) => {
  const t = UI_TRANSLATIONS[language].galaxies;
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<string>(
    externalGalaxyId || "milky-way"
  );

  const activeGalaxy =
    GALAXIES_DATA.find((g) => g.id === selectedGalaxyId) || GALAXIES_DATA[0];

  const [visualMode, setVisualMode] = useState<"photo" | "sim">("photo");
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const [armTightness, setArmTightness] = useState<number>(
    activeGalaxy.visualPreset.armTightness
  );
  const [barStrength, setBarStrength] = useState<number>(
    activeGalaxy.visualPreset.barLength
  );
  const [mergerTimelineGyr, setMergerTimelineGyr] = useState<number>(0);

  useEffect(() => {
    if (externalGalaxyId) {
      const found = GALAXIES_DATA.find((g) => g.id === externalGalaxyId);
      if (found) {
        setSelectedGalaxyId(found.id);
        setSelectedTypeFilter("all");
        setArmTightness(found.visualPreset.armTightness);
        setBarStrength(found.visualPreset.barLength);
        setMergerTimelineGyr(0);
      }
    }
  }, [externalGalaxyId]);

  const handleSelectGalaxy = (galaxy: GalaxyData) => {
    setSelectedGalaxyId(galaxy.id);
    onSelectGalaxy?.(galaxy.id);
    setArmTightness(galaxy.visualPreset.armTightness);
    setBarStrength(galaxy.visualPreset.barLength);
    setMergerTimelineGyr(0);
  };

  const filteredGalaxies = GALAXIES_DATA.filter((g) => {
    if (selectedTypeFilter === "all") return true;
    if (selectedTypeFilter === "spiral")
      return g.type === "spiral" || g.type === "barred-spiral";
    if (selectedTypeFilter === "elliptical") return g.type === "elliptical";
    return g.type === "lenticular" || g.type === "irregular";
  });

  const credit =
    GALAXY_CREDITS[activeGalaxy.id]?.[language] || "NASA / ESA Hubble Archive";

  return (
    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Header & Morphology Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono tracking-wider text-cyan-400 uppercase mb-1.5">
            {t.kicker}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">{t.subtitle}</p>
        </div>

        {/* Interactive Morphology Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
          {[
            { id: "all", label: t.filterAll },
            { id: "spiral", label: t.filterSpiral },
            { id: "elliptical", label: t.filterElliptical },
            { id: "other", label: t.filterLenticular },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedTypeFilter === tab.id
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Galaxy Cards Selector Row with Real NASA / Hubble Photographs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {filteredGalaxies.map((galaxy) => {
          const isSelected = galaxy.id === activeGalaxy.id;
          return (
            <button
              key={galaxy.id}
              onClick={() => handleSelectGalaxy(galaxy)}
              className={`group text-start rounded-2xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/95 border-cyan-400 shadow-lg shadow-cyan-950/25"
                  : "bg-[#0B0E17]/85 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Real NASA Image Header */}
              <div className="relative w-full h-44 bg-black overflow-hidden border-b border-slate-800/80">
                {!imgError[galaxy.id] ? (
                  <img
                    src={`/images/space/${galaxy.id}.jpg`}
                    alt={galaxy.name[language]}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgError((prev) => ({ ...prev, [galaxy.id]: true }))
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 flex items-center justify-center">
                    <Orbit className="w-10 h-10 text-cyan-400/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent" />
                <div className="absolute bottom-2.5 start-4 end-4 flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-mono text-cyan-300">
                    {galaxy.catalogId}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between w-full">
                <div>
                  <span className="block text-xs text-slate-400 mb-1 truncate">
                    {galaxy.typeLabel[language]}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mb-1.5">
                    {galaxy.name[language]}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                    {galaxy.summary[language]}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400 tabular-nums">
                  <span>{galaxy.distanceLightYears[language]}</span>
                  <span className="text-violet-300">{galaxy.massSolar}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Galaxy Deep-Dive & Interactive Morphology Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Real NASA Telescope Image / Interactive Morphology Simulator */}
        <div className="lg:col-span-6 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-xs font-mono text-cyan-400">
                {activeGalaxy.catalogId}
              </span>
              <h3 className="text-xl font-bold text-white">
                {activeGalaxy.name[language]}
              </h3>
            </div>

            {/* Switcher between Real NASA/Hubble Photo & Interactive Simulator */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setVisualMode("photo")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  visualMode === "photo"
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Camera className="w-3 h-3" />
                <span>
                  {language === "ar"
                    ? "صورة تلسكوب ناسا/هابل"
                    : "Real NASA/Hubble Photo"}
                </span>
              </button>
              <button
                onClick={() => setVisualMode("sim")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  visualMode === "sim"
                    ? "bg-violet-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Orbit className="w-3 h-3" />
                <span>
                  {language === "ar"
                    ? "محاكاة الاندماج التفاعلية"
                    : "Interactive Simulator"}
                </span>
              </button>
            </div>
          </div>

          {visualMode === "photo" && !imgError[activeGalaxy.id] ? (
            <div>
              <div className="relative w-full h-[280px] sm:h-[340px] rounded-xl overflow-hidden border border-slate-800 bg-black">
                <img
                  src={`/images/space/${activeGalaxy.id}.jpg`}
                  alt={activeGalaxy.name[language]}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgError((prev) => ({
                      ...prev,
                      [activeGalaxy.id]: true,
                    }))
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-2">
                {credit}
              </p>
            </div>
          ) : (
            <GalaxyAstrophotoCanvas
              galaxy={activeGalaxy}
              customTightness={armTightness}
              customBar={barStrength}
              mergerProgress={mergerTimelineGyr}
            />
          )}

          {/* Interactive Galactic Morphology & Merger Controls */}
          <div className="mt-5 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">
                  {t.simulatorTitle}
                </h4>
              </div>
              {visualMode === "photo" && (
                <span className="text-[11px] font-mono text-violet-300">
                  {language === "ar"
                    ? "حرّك المؤشرات لتشغيل المحاكاة"
                    : "Move sliders to activate simulator"}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-4">{t.simulatorSubtitle}</p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="galaxy-winding" className="text-slate-300">
                    {t.armTightness}
                  </label>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {(armTightness * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="galaxy-winding"
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.02"
                  value={armTightness}
                  onChange={(e) => {
                    setVisualMode("sim");
                    setArmTightness(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="galaxy-bar" className="text-slate-300">
                    {t.barStrength}
                  </label>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {(barStrength * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  id="galaxy-bar"
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.02"
                  value={barStrength}
                  onChange={(e) => {
                    setVisualMode("sim");
                    setBarStrength(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <label htmlFor="galaxy-merger" className="text-slate-300">
                    {t.mergerTimeline}
                  </label>
                  <span className="font-mono text-violet-300 tabular-nums">
                    T + {mergerTimelineGyr.toFixed(1)} Gyr
                  </span>
                </div>
                <input
                  id="galaxy-merger"
                  type="range"
                  min="0"
                  max="4.5"
                  step="0.1"
                  value={mergerTimelineGyr}
                  onChange={(e) => {
                    setVisualMode("sim");
                    setMergerTimelineGyr(parseFloat(e.target.value));
                  }}
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Galactic Telemetry & Scientific Observations */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              {activeGalaxy.name[language]}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeGalaxy.summary[language]}
            </p>

            {/* Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="block text-xs text-slate-400 mb-1">
                  {t.distanceLabel}
                </span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {activeGalaxy.distanceLightYears[language]}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="block text-xs text-slate-400 mb-1">
                  {t.diameterLabel}
                </span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {activeGalaxy.diameterLightYears[language]}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="block text-xs text-slate-400 mb-1">
                  {t.starsLabel}
                </span>
                <span className="text-sm font-mono font-bold text-cyan-400 tabular-nums">
                  {activeGalaxy.estimatedStars[language]}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="block text-xs text-slate-400 mb-1">
                  {t.constellationLabel} · {t.massLabel}
                </span>
                <span className="text-sm font-mono font-bold text-violet-300 tabular-nums">
                  {activeGalaxy.constellation[language]} ({activeGalaxy.massSolar})
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onAskAiAbout(
                  language === "ar"
                    ? `اشرح بنية ${activeGalaxy.name.ar}، وكيف تتماسك المجرات بواسطة المادة المظلمة، وما يميز هذا النوع من المجرات.`
                    : `Explain the astrophysical structure of ${activeGalaxy.name.en}, how dark matter halos bind galaxies together, and what makes this galaxy unique.`
                )
              }
              className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === "ar"
                  ? `اسأل المرشد الفضائي الذكي عن ${activeGalaxy.name.ar}`
                  : `Ask AI Space Guide About ${activeGalaxy.name.en}`}
              </span>
            </button>
          </div>

          {/* Scientific Highlights */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
            <span className="block text-xs font-mono text-cyan-400 uppercase mb-4">
              {language === "ar"
                ? "الاكتشافات والخصائص الرصدية"
                : "Observational Highlights & Astrophysics"}
            </span>
            <div className="space-y-4">
              {activeGalaxy.scientificHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="pb-4 last:pb-0 border-b last:border-b-0 border-slate-800/80 flex items-start gap-3.5"
                >
                  <span className="font-mono text-xs text-cyan-400 font-semibold tabular-nums mt-0.5">
                    0{idx + 1}.
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item[language]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
