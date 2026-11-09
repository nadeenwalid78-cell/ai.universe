import React, { useEffect, useState } from "react";
import {
  Language,
  SectionId,
  UI_TRANSLATIONS,
} from "./data/spaceData";
import { StarfieldBackground } from "./components/StarfieldBackground";
import { HeroSection } from "./components/HeroSection";
import { SolarSystemExplorer } from "./components/SolarSystemExplorer";
import { PlanetDiscovery } from "./components/PlanetDiscovery";
import { GalaxyExplorer } from "./components/GalaxyExplorer";
import { BlackHoleDiscovery } from "./components/BlackHoleDiscovery";
import { AiSpaceGuide, FloatingAiChatWidget } from "./components/AiSpaceGuide";
import { SpaceQuiz } from "./components/SpaceQuiz";
import { HeaderSearchBar } from "./components/HeaderSearchBar";
import { Globe, Compass, Layers } from "lucide-react";

export default function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("earth");
  const [selectedGalaxyId, setSelectedGalaxyId] = useState<string>("milky-way");
  const [astroUnits, setAstroUnits] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | null>(null);
  const [showAllSectionsOnHome, setShowAllSectionsOnHome] =
    useState<boolean>(true);

  const t = UI_TRANSLATIONS[language];
  const isRtl = language === "ar";

  // Sync HTML lang and dir attributes for proper RTL/LTR layout throughout the app
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [language, isRtl]);

  const handleNavigate = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPlanetAndOpenDossier = (planetId: string) => {
    setSelectedPlanetId(planetId);
    setActiveSection("planets");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFocusPlanetIn3D = (planetId: string) => {
    setSelectedPlanetId(planetId);
    setActiveSection("solar-system");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectGalaxyAndOpen = (galaxyId: string) => {
    setSelectedGalaxyId(galaxyId);
    setActiveSection("galaxies");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskAiAbout = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setActiveSection("ai-guide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems: { id: SectionId; label: string }[] = [
    { id: "solar-system", label: t.nav.solarSystem },
    { id: "planets", label: t.nav.planets },
    { id: "galaxies", label: t.nav.galaxies },
    { id: "black-holes", label: t.nav.blackHoles },
    { id: "quiz", label: t.nav.quiz },
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col relative selection:bg-violet-500/30 selection:text-violet-200"
    >
      {/* Persistent Animated Starfield & Nebula Canvas */}
      <StarfieldBackground />

      {/* Top Header with Wordmark, Navigation Links, Search Bar & AI Guide Action */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-3.5 bg-[#07090E]/90 backdrop-blur-md border-b border-slate-800/90">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("home");
          }}
          className="text-lg sm:text-xl font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-300 transition-colors"
        >
          AI UNIVERSE
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                className={`transition-colors whitespace-nowrap shrink-0 underline-offset-8 ${
                  isActive
                    ? "text-cyan-400 underline font-semibold"
                    : "hover:text-white hover:underline"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Instant Search Bar & AI Space Guide Action */}
        <div className="flex items-center gap-3 flex-1 sm:flex-initial justify-end min-w-[220px]">
          <HeaderSearchBar
            language={language}
            onNavigate={handleNavigate}
            onSelectPlanetAndOpen={handleSelectPlanetAndOpenDossier}
            onFocusPlanetIn3D={handleFocusPlanetIn3D}
            onSelectGalaxyAndOpen={handleSelectGalaxyAndOpen}
            onAskAiAbout={handleAskAiAbout}
          />

          <button
            onClick={() => handleNavigate("ai-guide")}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === "ai-guide"
                ? "bg-cyan-500 text-slate-950"
                : "bg-violet-600 hover:bg-violet-500 text-white"
            }`}
          >
            {t.nav.aiGuide}
          </button>
        </div>
      </header>

      {/* Workspace Observatory Toolbar (Below Header for Language Switcher, Units & Mobile Navigation) */}
      <div className="relative z-20 w-full bg-[#0B0E17]/90 border-b border-slate-800/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Home & Mobile Section Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => handleNavigate("home")}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === "home"
                  ? "bg-slate-800 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5 inline me-1" />
              {t.subbar.home}
            </button>

            {/* Mobile/tablet-visible navigation pills */}
            <div className="flex lg:hidden items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeSection === item.id
                      ? "bg-violet-600 text-white"
                      : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Unit System Switcher, Stream Mode & Bilingual RTL/LTR Switcher */}
          <div className="flex items-center gap-2 ms-auto">
            {activeSection === "home" && (
              <button
                onClick={() => setShowAllSectionsOnHome((prev) => !prev)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>
                  {showAllSectionsOnHome
                    ? language === "ar"
                      ? "وضع الجولة الكاملة: مفعّل"
                      : "Full Observatory Stream: ON"
                    : language === "ar"
                    ? "وضع الصفحة المستقلة"
                    : "Focused Module Mode"}
                </span>
              </button>
            )}

            {/* Metric vs Astronomical Units Toggle */}
            <button
              onClick={() => setAstroUnits((u) => !u)}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {astroUnits ? t.subbar.unitsAstro : t.subbar.unitsMetric}
            </button>

            {/* Arabic / English Language Switcher */}
            <button
              onClick={() =>
                setLanguage((prev) => (prev === "en" ? "ar" : "en"))
              }
              className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.subbar.langSwitchLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 relative z-10">
        {activeSection === "home" && (
          <>
            <HeroSection
              language={language}
              onNavigate={handleNavigate}
              onSelectPlanetAndOpen={handleSelectPlanetAndOpenDossier}
              astroUnits={astroUnits}
            />

            {showAllSectionsOnHome && (
              <div className="space-y-12 pb-16">
                <div className="border-t border-slate-800/80 pt-8">
                  <SolarSystemExplorer
                    language={language}
                    selectedPlanetId={selectedPlanetId}
                    onSelectPlanet={setSelectedPlanetId}
                    onOpenPlanetDossier={handleSelectPlanetAndOpenDossier}
                    onAskAiAbout={handleAskAiAbout}
                    astroUnits={astroUnits}
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-8">
                  <PlanetDiscovery
                    language={language}
                    selectedPlanetId={selectedPlanetId}
                    onSelectPlanet={setSelectedPlanetId}
                    onFocusIn3D={handleFocusPlanetIn3D}
                    onAskAiAbout={handleAskAiAbout}
                    astroUnits={astroUnits}
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-8">
                  <GalaxyExplorer
                    language={language}
                    onAskAiAbout={handleAskAiAbout}
                    selectedGalaxyId={selectedGalaxyId}
                    onSelectGalaxy={setSelectedGalaxyId}
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-8">
                  <BlackHoleDiscovery
                    language={language}
                    onAskAiAbout={handleAskAiAbout}
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-8">
                  <AiSpaceGuide
                    language={language}
                    initialPrompt={aiInitialPrompt}
                    onConsumeInitialPrompt={() => setAiInitialPrompt(null)}
                  />
                </div>

                <div className="border-t border-slate-800/80 pt-8">
                  <SpaceQuiz
                    language={language}
                    onAskAiAbout={handleAskAiAbout}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === "solar-system" && (
          <SolarSystemExplorer
            language={language}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={setSelectedPlanetId}
            onOpenPlanetDossier={handleSelectPlanetAndOpenDossier}
            onAskAiAbout={handleAskAiAbout}
            astroUnits={astroUnits}
          />
        )}

        {activeSection === "planets" && (
          <PlanetDiscovery
            language={language}
            selectedPlanetId={selectedPlanetId}
            onSelectPlanet={setSelectedPlanetId}
            onFocusIn3D={handleFocusPlanetIn3D}
            onAskAiAbout={handleAskAiAbout}
            astroUnits={astroUnits}
          />
        )}

        {activeSection === "galaxies" && (
          <GalaxyExplorer
            language={language}
            onAskAiAbout={handleAskAiAbout}
            selectedGalaxyId={selectedGalaxyId}
            onSelectGalaxy={setSelectedGalaxyId}
          />
        )}

        {activeSection === "black-holes" && (
          <BlackHoleDiscovery
            language={language}
            onAskAiAbout={handleAskAiAbout}
          />
        )}

        {activeSection === "ai-guide" && (
          <AiSpaceGuide
            language={language}
            initialPrompt={aiInitialPrompt}
            onConsumeInitialPrompt={() => setAiInitialPrompt(null)}
          />
        )}

        {activeSection === "quiz" && (
          <SpaceQuiz
            language={language}
            onAskAiAbout={handleAskAiAbout}
          />
        )}
      </main>

      {/* Persistent Floating Gemini AI Space Guide Widget across all sections */}
      <FloatingAiChatWidget
        language={language}
        activeSection={activeSection}
        onOpenFullGuide={() => handleNavigate("ai-guide")}
      />

      {/* Clean Observatory Footer (Zero Fake Telemetry Tickers) */}
      <footer className="relative z-10 border-t border-slate-800/90 bg-[#05070C] py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-5 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-white">
                AI UNIVERSE
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.tagline}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <button
                onClick={() => handleNavigate("home")}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t.subbar.home}
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => handleNavigate("ai-guide")}
                className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
              >
                {t.nav.aiGuide}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-start">
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
            <span className="font-mono text-[11px] text-slate-500">
              {language === "ar"
                ? "حقوق الملكية الفكرية محفوظة · Nadeen Walid"
                : "Intellectual Property & Design · Nadeen Walid"}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
