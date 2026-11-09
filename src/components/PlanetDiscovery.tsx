import React, { useEffect, useRef, useState } from "react";
import {
  Language,
  PLANETS_DATA,
  PlanetData,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import { Sparkles, Compass, Camera, Globe2 } from "lucide-react";

interface PlanetDiscoveryProps {
  language: Language;
  selectedPlanetId: string;
  onSelectPlanet: (planetId: string) => void;
  onFocusIn3D: (planetId: string) => void;
  onAskAiAbout: (prompt: string) => void;
  astroUnits: boolean;
}

const NASA_CREDITS: Record<string, { en: string; ar: string }> = {
  mercury: {
    en: "NASA / Johns Hopkins University APL / Carnegie Institution (MESSENGER)",
    ar: "وكالة ناسا · مسبار مسنجر (MESSENGER)",
  },
  venus: {
    en: "NASA / JPL-Caltech (Magellan Radar & Pioneer Orbiter)",
    ar: "وكالة ناسا · مسبار ماجلان الفضائي",
  },
  earth: {
    en: "NASA Goddard Space Flight Center (Blue Marble Observational Composite)",
    ar: "وكالة ناسا · مرصد الأرض (Blue Marble)",
  },
  mars: {
    en: "NASA / ESA / Hubble Space Telescope Planetary Camera",
    ar: "وكالة ناسا وتلسكوب هابل الفضائي",
  },
  jupiter: {
    en: "NASA / JPL-Caltech / SwRI / MSSS (Juno Mission)",
    ar: "وكالة ناسا · مسبار جونو (Juno)",
  },
  saturn: {
    en: "NASA / JPL-Caltech / Space Science Institute (Cassini Orbiter)",
    ar: "وكالة ناسا · مركبة كاسيني (Cassini)",
  },
  uranus: {
    en: "NASA / JPL-Caltech (Voyager 2 Flyby Imaging)",
    ar: "وكالة ناسا · مسبار فوياجر 2 (Voyager 2)",
  },
  neptune: {
    en: "NASA / JPL-Caltech (Voyager 2 Narrow-Angle Camera)",
    ar: "وكالة ناسا · مسبار فوياجر 2 (Voyager 2)",
  },
};

/**
 * Interactive high-resolution 2D/3D-shaded procedural planetary globe canvas
 * for the selected planet in Planet Discovery.
 */
const InteractivePlanetGlobe: React.FC<{ planet: PlanetData }> = ({
  planet,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const size = 340;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = planet.visualConfig.hasRings ? 82 : 108;
    const startTime = performance.now();

    // Load real NASA equirectangular planetary surface map
    const texImg = new Image();
    texImg.src = `/images/textures/${planet.id}.jpg`;

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, size, size);

      // Subtle atmospheric outer halo
      const halo = ctx.createRadialGradient(
        cx,
        cy,
        radius * 0.85,
        cx,
        cy,
        radius * 1.45
      );
      halo.addColorStop(0, `${planet.visualConfig.atmosphereColor}38`);
      halo.addColorStop(0.6, `${planet.visualConfig.primaryColor}12`);
      halo.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Draw Axial Tilt Reference Axis Line
      const tiltRad = (Math.min(planet.axialTiltDeg, 98) * Math.PI) / 180;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltRad);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -radius * 1.32);
      ctx.lineTo(0, radius * 1.32);
      ctx.stroke();
      ctx.setLineDash([]);

      // Back half of planetary rings (if Saturn or Uranus)
      if (planet.visualConfig.hasRings) {
        ctx.save();
        ctx.strokeStyle = planet.visualConfig.ringColor || "#fde68a";
        ctx.lineWidth = planet.id === "saturn" ? 16 : 6;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.85, radius * 0.48, 0, Math.PI, Math.PI * 2);
        ctx.stroke();

        if (planet.id === "saturn") {
          ctx.lineWidth = 7;
          ctx.globalAlpha = 0.4;
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            radius * 1.48,
            radius * 0.36,
            0,
            Math.PI,
            Math.PI * 2
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // Clip to planetary sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();

      if (texImg.complete && texImg.naturalWidth > 0) {
        // Scroll the real equirectangular NASA planetary texture seamlessly across the sphere
        const mapHeight = radius * 2;
        const mapWidth = radius * 4;
        const scrollX = (elapsed * 28) % mapWidth;
        ctx.drawImage(texImg, -radius - scrollX, -radius, mapWidth, mapHeight);
        ctx.drawImage(
          texImg,
          -radius - scrollX + mapWidth,
          -radius,
          mapWidth,
          mapHeight
        );
      } else {
        // Fallback while texture image finishes loading
        const sphereGrad = ctx.createRadialGradient(
          -radius * 0.32,
          -radius * 0.32,
          radius * 0.1,
          0,
          0,
          radius * 1.1
        );
        sphereGrad.addColorStop(0, planet.visualConfig.accentColor);
        sphereGrad.addColorStop(0.45, planet.visualConfig.primaryColor);
        sphereGrad.addColorStop(0.95, planet.visualConfig.secondaryColor);
        sphereGrad.addColorStop(1, "#020617");
        ctx.fillStyle = sphereGrad;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
      }

      // 3D Spherical Limb Darkening + Day/Night Terminator Shadow
      const limbGrad = ctx.createRadialGradient(
        -radius * 0.25,
        -radius * 0.25,
        radius * 0.25,
        0,
        0,
        radius
      );
      limbGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      limbGrad.addColorStop(0.65, "rgba(0, 0, 0, 0)");
      limbGrad.addColorStop(0.9, "rgba(2, 6, 23, 0.38)");
      limbGrad.addColorStop(1, "rgba(2, 6, 23, 0.78)");
      ctx.fillStyle = limbGrad;
      ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

      ctx.restore(); // End sphere clip

      // Front half of planetary rings (if Saturn or Uranus)
      if (planet.visualConfig.hasRings) {
        ctx.save();
        ctx.strokeStyle = planet.visualConfig.ringColor || "#fde68a";
        ctx.lineWidth = planet.id === "saturn" ? 16 : 6;
        ctx.globalAlpha = 0.92;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.85, radius * 0.48, 0, 0, Math.PI);
        ctx.stroke();

        if (planet.id === "saturn") {
          ctx.lineWidth = 7;
          ctx.globalAlpha = 0.65;
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * 1.48, radius * 0.36, 0, 0, Math.PI);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore(); // End tilt rotation

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [planet]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
      />
    </div>
  );
};

export const PlanetDiscovery: React.FC<PlanetDiscoveryProps> = ({
  language,
  selectedPlanetId,
  onSelectPlanet,
  onFocusIn3D,
  onAskAiAbout,
  astroUnits,
}) => {
  const t = UI_TRANSLATIONS[language].planets;
  const activePlanet =
    PLANETS_DATA.find((p) => p.id === selectedPlanetId) || PLANETS_DATA[2];

  // Default to showing the real NASA photograph!
  const [visualMode, setVisualMode] = useState<"photo" | "globe">("photo");
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  const credit =
    NASA_CREDITS[activePlanet.id]?.[language] || "NASA Planetary Photojournal";

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

      {/* 8-Planet Interactive Selector Cards Grid with Real NASA Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
        {PLANETS_DATA.map((planet) => {
          const isSelected = planet.id === activePlanet.id;
          return (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet.id)}
              className={`group text-start p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-900/95 border-cyan-400 shadow-lg shadow-cyan-950/30"
                  : "bg-[#0B0E17]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  0{planet.order}
                </span>
                {!imgError[planet.id] ? (
                  <img
                    src={`/images/space/${planet.id}.jpg`}
                    alt={planet.name[language]}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgError((prev) => ({ ...prev, [planet.id]: true }))
                    }
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 transition-transform group-hover:scale-110 bg-black"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full shadow-inner transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${planet.visualConfig.accentColor}, ${planet.visualConfig.primaryColor}, ${planet.visualConfig.secondaryColor})`,
                    }}
                  />
                )}
              </div>
              <div className="font-display font-bold text-sm text-white truncate">
                {planet.name[language]}
              </div>
              <div className="text-xs font-mono text-slate-400 tabular-nums mt-0.5 truncate">
                {astroUnits ? `${planet.distanceAU} AU` : planet.distanceKm}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Planet Dossier (2-Zone Asymmetric Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Real NASA Photograph / Interactive Globe + Primary Telemetry Matrix */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6 flex flex-col items-center">
          <div className="w-full flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-3">
            <span className="font-mono text-cyan-400">
              0{activePlanet.order} · {activePlanet.classification[language]}
            </span>

            {/* Switcher between Real NASA Photo & Interactive Simulation */}
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
                  {language === "ar" ? "صورة ناسا الحقيقية" : "Real NASA Photo"}
                </span>
              </button>
              <button
                onClick={() => setVisualMode("globe")}
                className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer ${
                  visualMode === "globe"
                    ? "bg-violet-600 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe2 className="w-3 h-3" />
                <span>
                  {language === "ar" ? "محاكاة تفاعلية" : "Interactive Globe"}
                </span>
              </button>
            </div>
          </div>

          {visualMode === "photo" && !imgError[activePlanet.id] ? (
            <div className="w-full flex flex-col items-center my-2">
              <div className="relative w-full h-[290px] sm:h-[320px] rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={`/images/space/${activePlanet.id}.jpg`}
                  alt={activePlanet.name[language]}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgError((prev) => ({
                      ...prev,
                      [activePlanet.id]: true,
                    }))
                  }
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-2 text-center">
                {credit} · {t.axialTilt}: {activePlanet.axialTiltDeg}°
              </span>
            </div>
          ) : (
            <InteractivePlanetGlobe planet={activePlanet} />
          )}

          <div className="w-full text-center mt-3 mb-6">
            <h3 className="text-3xl font-display font-bold text-white mb-1">
              {activePlanet.name[language]}
            </h3>
            <p className="text-sm text-slate-300">
              {activePlanet.tagline[language]}
            </p>
          </div>

          {/* 6-Metric Quantitative Grid (Tabular Numerals) */}
          <div className="w-full grid grid-cols-2 gap-3 pt-5 border-t border-slate-800 text-start">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.distanceFromSun}
              </span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                {astroUnits
                  ? `${activePlanet.distanceAU} AU`
                  : activePlanet.distanceKm}
              </span>
              <span className="block text-xs font-mono text-slate-400 tabular-nums mt-0.5">
                {astroUnits
                  ? activePlanet.distanceKm
                  : `${activePlanet.distanceAU} AU`}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.diameter}
              </span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                {activePlanet.diameterKm.toLocaleString()} km
              </span>
              <span className="block text-xs font-mono text-cyan-400 tabular-nums mt-0.5">
                {activePlanet.earthSizeRatio}
                {t.compareEarth}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.avgTemperature}
              </span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                {activePlanet.avgTempC > 0
                  ? `+${activePlanet.avgTempC}`
                  : activePlanet.avgTempC}{" "}
                °C
              </span>
              <span className="block text-xs font-mono text-slate-400 tabular-nums mt-0.5">
                {activePlanet.avgTempK} K
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.moons}
              </span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                {activePlanet.moonsCount}
              </span>
              <span className="block text-xs text-slate-400 truncate mt-0.5">
                {activePlanet.notableMoons[language]}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.orbitalPeriod}
              </span>
              <span className="text-sm font-mono font-semibold text-white tabular-nums">
                {activePlanet.orbitalPeriod[language]}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="block text-xs text-slate-400 mb-1">
                {t.rotationPeriod}
              </span>
              <span className="text-sm font-mono font-semibold text-white tabular-nums">
                {activePlanet.rotationPeriod[language]}
              </span>
            </div>
          </div>

          {/* Interactive Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-5">
            <button
              onClick={() => onFocusIn3D(activePlanet.id)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>{t.viewIn3DBtn}</span>
            </button>
            <button
              onClick={() =>
                onAskAiAbout(
                  language === "ar"
                    ? `أخبرني بمزيد من التفاصيل العلمية عن كوكب ${activePlanet.name.ar}، غلافه الجوي، وأهم البعثات الفضائية التي استكشفته.`
                    : `Tell me more scientific details about ${activePlanet.name.en}, its atmospheric dynamics, and the key spacecraft missions that explored it.`
                )
              }
              className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.askAiPlanetBtn}</span>
            </button>
          </div>
        </div>

        {/* Right Zone: Composition, Unique Characteristics & Scientific Facts */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* What Makes This Planet Unique */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
            <span className="block text-xs font-mono text-violet-400 uppercase mb-1.5">
              01 · {t.uniqueTitle}
            </span>
            <p className="text-base text-slate-100 leading-relaxed">
              {activePlanet.uniqueFeature[language]}
            </p>
          </div>

          {/* Atmospheric & Internal Composition */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
            <span className="block text-xs font-mono text-cyan-400 uppercase mb-3">
              02 · {t.compositionTitle}
            </span>

            <div className="space-y-3 mb-6">
              {activePlanet.atmosphereComposition.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-200 font-medium">
                      {item.component[language]}
                    </span>
                    <span className="font-mono text-slate-300 tabular-nums">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(item.percentage, 3)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-mono text-slate-400 uppercase mb-1.5">
                {t.internalStructureTitle} · {t.surfaceGravity}:{" "}
                <span className="text-slate-200 tabular-nums">
                  {activePlanet.gravityMs2} m/s²
                </span>
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activePlanet.internalStructure[language]}
              </p>
            </div>
          </div>

          {/* Interesting Scientific Facts */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6">
            <span className="block text-xs font-mono text-cyan-400 uppercase mb-4">
              03 · {t.factsTitle}
            </span>
            <div className="space-y-4">
              {activePlanet.scientificFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="pb-4 last:pb-0 border-b last:border-b-0 border-slate-800/80 flex items-start gap-3.5"
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
      </div>
    </section>
  );
};
