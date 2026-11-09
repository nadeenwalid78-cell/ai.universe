import React, { useEffect, useRef, useState } from "react";
import {
  FEATURED_DISCOVERIES,
  Language,
  PLANETS_DATA,
  SectionId,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import { Compass, Sparkles, ArrowUpRight, Play, Pause } from "lucide-react";

interface HeroSectionProps {
  language: Language;
  onNavigate: (section: SectionId) => void;
  onSelectPlanetAndOpen: (planetId: string) => void;
  astroUnits: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onNavigate,
  onSelectPlanetAndOpen,
  astroUnits,
}) => {
  const t = UI_TRANSLATIONS[language].hero;
  const orreryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewSelectedPlanetId, setPreviewSelectedPlanetId] =
    useState<string>("earth");
  const [previewPaused, setPreviewPaused] = useState(false);
  const [activeDiscoveryFilter, setActiveDiscoveryFilter] =
    useState<string>("all");

  const pausedRef = useRef(previewPaused);
  const selectedIdRef = useRef(previewSelectedPlanetId);
  const langRef = useRef(language);

  useEffect(() => {
    pausedRef.current = previewPaused;
  }, [previewPaused]);

  useEffect(() => {
    selectedIdRef.current = previewSelectedPlanetId;
  }, [previewSelectedPlanetId]);

  useEffect(() => {
    langRef.current = language;
  }, [language]);

  // Interactive 2D/2.5D Heliocentric Solar System Preview on the Landing Page
  useEffect(() => {
    const canvas = orreryCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    const angles = PLANETS_DATA.map((_, i) => i * 0.9 + 0.5);
    const planetScreenCoords: {
      id: string;
      x: number;
      y: number;
      r: number;
    }[] = [];

    // Preload real photographic planetary & solar images for the moving preview
    const planetImages: Record<string, HTMLImageElement> = {};
    const sunImg = new Image();
    sunImg.src = "/images/space/sun.jpg";
    planetImages["sun"] = sunImg;
    PLANETS_DATA.forEach((p) => {
      const img = new Image();
      img.src = `/images/space/${p.id}.jpg`;
      planetImages[p.id] = img;
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const draw = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxRadius = Math.min(w, h) * 0.44;

      ctx.clearRect(0, 0, w, h);

      // Deep radial nebula backdrop
      const bgGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, maxRadius * 1.15);
      bgGrad.addColorStop(0, "rgba(245, 158, 11, 0.16)");
      bgGrad.addColorStop(0.35, "rgba(109, 40, 217, 0.09)");
      bgGrad.addColorStop(1, "rgba(7, 9, 14, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw Sun at center with real solar photograph
      const sunGlow = ctx.createRadialGradient(cx, cy, 4, cx, cy, 30);
      sunGlow.addColorStop(0, "#fffbeb");
      sunGlow.addColorStop(0.45, "#f59e0b");
      sunGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fill();

      const sImg = planetImages["sun"];
      if (sImg && sImg.complete && sImg.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(sImg, cx - 15, cy - 15, 30, 30);
        ctx.restore();
      } else {
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.arc(cx, cy, 13, 0, Math.PI * 2);
        ctx.fill();
      }

      planetScreenCoords.length = 0;

      // Draw 8 Planets & Orbits
      PLANETS_DATA.forEach((planet, idx) => {
        if (!pausedRef.current) {
          angles[idx] += dt * planet.visualConfig.orbitSpeed * 0.55;
        }
        const orbitR =
          28 + ((idx + 1) / PLANETS_DATA.length) * (maxRadius - 32);

        // Orbit ring
        const isSelected = selectedIdRef.current === planet.id;
        ctx.strokeStyle = isSelected
          ? "rgba(34, 211, 238, 0.55)"
          : "rgba(148, 163, 184, 0.16)";
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.stroke();

        const px = cx + Math.cos(angles[idx]) * orbitR;
        const py = cy + Math.sin(angles[idx]) * orbitR;
        const pr = Math.max(6.5, Math.min(13.5, planet.visualConfig.radius3D * 5.8));

        // Saturn / Uranus ring hint
        if (planet.visualConfig.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(-0.4);
          ctx.strokeStyle = planet.visualConfig.ringColor || "#fde68a";
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, pr * 1.9, pr * 0.65, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Planet body rendered with real photograph clipped to circular disc
        const pImg = planetImages[planet.id];
        if (pImg && pImg.complete && pImg.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(pImg, px - pr * 1.15, py - pr * 1.15, pr * 2.3, pr * 2.3);
          ctx.restore();
        } else {
          ctx.fillStyle = planet.visualConfig.primaryColor;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle rim outline
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.stroke();

        // Selection reticle
        if (isSelected) {
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, pr + 5, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#e2e8f0";
          ctx.font = "600 11px 'Plus Jakarta Sans', 'Cairo', sans-serif";
          ctx.fillText(planet.name[langRef.current], px + pr + 8, py + 4);
        }

        planetScreenCoords.push({ id: planet.id, x: px, y: py, r: Math.max(pr + 8, 16) });
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (const item of planetScreenCoords) {
        if (Math.hypot(mx - item.x, my - item.y) <= item.r) {
          setPreviewSelectedPlanetId(item.id);
          break;
        }
      }
    };

    canvas.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  const previewPlanet =
    PLANETS_DATA.find((p) => p.id === previewSelectedPlanetId) ||
    PLANETS_DATA[2];

  const filteredDiscoveries =
    activeDiscoveryFilter === "all"
      ? FEATURED_DISCOVERIES
      : FEATURED_DISCOVERIES.filter((d) => d.targetSection === activeDiscoveryFilter);

  return (
    <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 pb-16">
      {/* Hero 2-Column Asymmetric Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
        {/* Left Column: Brand Narrative & Primary Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center py-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <p className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
              {t.kicker}
            </p>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span className="text-xs font-mono text-violet-300 bg-violet-950/50 border border-violet-500/30 px-2.5 py-0.5 rounded-md">
              {language === "ar"
                ? "تم الإنشاء بواسطة Nadeen Walid"
                : "Created by Nadeen Walid"}
            </span>
          </div>
          <h1
            className="font-display font-bold tracking-tight text-white mb-3"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)", lineHeight: 1.08 }}
          >
            {t.title}
          </h1>
          <p className="text-xl sm:text-2xl font-display font-medium text-violet-300 mb-5">
            {t.subtitle}
          </p>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mb-8">
            {t.description}
          </p>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              onClick={() => onNavigate("solar-system")}
              className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-950/50 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{t.exploreBtn}</span>
            </button>

            <button
              onClick={() => onNavigate("planets")}
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{UI_TRANSLATIONS[language].nav.planets}</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </button>

            <button
              onClick={() => onNavigate("ai-guide")}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-violet-500/40 text-violet-200 font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>{t.aiGuideBtn}</span>
            </button>
          </div>

          {/* Observatory Quantitative Benchmark Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/90">
            <div>
              <span className="block text-xs text-slate-400 mb-1">
                {language === "ar" ? "كواكب النظام الشمسي" : "Major Planets"}
              </span>
              <span className="text-2xl font-mono font-bold text-white tabular-nums">
                08
              </span>
              <span className="text-xs font-mono text-cyan-400 ms-1.5">
                1.00 Sol
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-1">
                {language === "ar" ? "الأقمار الطبيعية الموثقة" : "Cataloged Moons"}
              </span>
              <span className="text-2xl font-mono font-bold text-white tabular-nums">
                288
              </span>
              <span className="text-xs font-mono text-slate-400 ms-1.5">
                IAU
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-1">
                {language === "ar" ? "قطر درب التبانة" : "Milky Way Span"}
              </span>
              <span className="text-2xl font-mono font-bold text-white tabular-nums">
                105.7k
              </span>
              <span className="text-xs font-mono text-violet-400 ms-1.5">
                ly
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-1">
                {language === "ar" ? "سرعة الضوء في الفراغ" : "Light Velocity (c)"}
              </span>
              <span className="text-2xl font-mono font-bold text-white tabular-nums">
                299,792
              </span>
              <span className="text-xs font-mono text-cyan-400 ms-1.5">
                km/s
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Heliocentric Solar System Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h2 className="text-sm font-semibold text-white">
                {t.interactivePreviewTitle}
              </h2>
              <p className="text-xs text-slate-400">{t.interactivePreviewHint}</p>
            </div>
            <button
              onClick={() => setPreviewPaused((p) => !p)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              {previewPaused ? (
                <>
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>{UI_TRANSLATIONS[language].solarSystem.resume}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-cyan-400" />
                  <span>{UI_TRANSLATIONS[language].solarSystem.pause}</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Orrery Canvas */}
          <div className="relative w-full h-[300px] sm:h-[330px] rounded-xl bg-[#060810] border border-slate-800/80 overflow-hidden my-2">
            <canvas
              ref={orreryCanvasRef}
              className="w-full h-full cursor-pointer"
            />
          </div>

          {/* Quick Planet Selector & Selected Planet Summary */}
          <div>
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3">
              {PLANETS_DATA.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreviewSelectedPlanetId(p.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    previewSelectedPlanetId === p.id
                      ? "bg-cyan-500 text-slate-950 font-semibold"
                      : "bg-slate-900 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {p.name[language]}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-white">
                    {previewPlanet.name[language]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{previewPlanet.classification[language]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-cyan-400 tabular-nums">
                    {astroUnits
                      ? `${previewPlanet.distanceAU} AU`
                      : previewPlanet.distanceKm}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {previewPlanet.tagline[language]}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectPlanetAndOpen(previewPlanet.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 transition-colors whitespace-nowrap"
                >
                  {language === "ar" ? "تفاصيل الكوكب" : "Inspect Planet"}
                </button>
                <button
                  onClick={() => onNavigate("solar-system")}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white transition-colors whitespace-nowrap"
                >
                  3D View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Discoveries & Interesting Space Facts */}
      <div className="pt-12 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
              {t.featuredHeading}
            </h2>
            <p className="text-sm text-slate-400">{t.featuredSubheading}</p>
          </div>

          {/* Interactive Filter Controls (Segmented Control per frontend-design §1.A) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start">
            {[
              { id: "all", label: language === "ar" ? "الكل" : "All Discoveries" },
              {
                id: "planets",
                label: language === "ar" ? "الكواكب" : "Exoplanets",
              },
              {
                id: "black-holes",
                label: language === "ar" ? "الثقوب السوداء" : "Black Holes",
              },
              {
                id: "solar-system",
                label: language === "ar" ? "الأقمار الجليدية" : "Ocean Moons",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveDiscoveryFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeDiscoveryFilter === tab.id
                    ? "bg-violet-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDiscoveries.map((disc) => (
            <article
              key={disc.id}
              className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Clean unboxed metadata with typographic separators (Zero-Pill Rule) */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <span className="text-cyan-400 font-medium">
                    {disc.category[language]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{disc.mission}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{disc.year}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5">
                  {disc.title[language]}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {disc.summary[language]}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {disc.deepDive[language]}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div>
                  <span className="block text-xs text-slate-400">
                    {disc.keyMetricLabel[language]}
                  </span>
                  <span className="text-sm font-mono font-semibold text-violet-300 tabular-nums">
                    {disc.keyMetricValue}
                  </span>
                </div>
                <button
                  onClick={() => onNavigate(disc.targetSection)}
                  className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-white flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>
                    {language === "ar" ? "استكشف الوحدة" : "Open Module"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Home Section Copyright & Creator Signature */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="text-slate-300">
            {language === "ar" ? (
              <>
                © 2026 AI UNIVERSE — تم الإنشاء بواسطة{" "}
                <span className="text-cyan-400 font-semibold">
                  Nadeen Walid
                </span>
                . جميع الحقوق محفوظة.
              </>
            ) : (
              <>
                © 2026 AI UNIVERSE — Created by{" "}
                <span className="text-cyan-400 font-semibold">
                  Nadeen Walid
                </span>
                . All rights reserved.
              </>
            )}
          </p>
          <span className="font-mono text-[11px] text-slate-400">
            Created by Nadeen Walid
          </span>
        </div>
      </div>
    </div>
  );
};
