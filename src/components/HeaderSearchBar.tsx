import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BLACK_HOLE_ANATOMY,
  BLACK_HOLE_FACTS,
  FEATURED_DISCOVERIES,
  GALAXIES_DATA,
  Language,
  PLANETS_DATA,
  SectionId,
} from "../data/spaceData";
import {
  Search,
  X,
  Sparkles,
  Compass,
  Orbit,
  Eye,
  ArrowUpRight,
} from "lucide-react";

export interface SearchResultItem {
  id: string;
  category: "planet" | "galaxy" | "black-hole" | "discovery" | "module";
  categoryLabel: { en: string; ar: string };
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  meta?: string;
  image?: string;
  keywords: string;
  targetSection: SectionId;
  planetId?: string;
  galaxyId?: string;
  aiPrompt?: { en: string; ar: string };
}

interface HeaderSearchBarProps {
  language: Language;
  onNavigate: (section: SectionId) => void;
  onSelectPlanetAndOpen: (planetId: string) => void;
  onFocusPlanetIn3D: (planetId: string) => void;
  onSelectGalaxyAndOpen: (galaxyId: string) => void;
  onAskAiAbout: (prompt: string) => void;
}

const EXTRA_PHYSICS_TOPICS: SearchResultItem[] = [
  {
    id: "bh-schwarzschild",
    category: "black-hole",
    categoryLabel: { en: "Black Hole Physics", ar: "فيزياء الثقوب السوداء" },
    title: {
      en: "Schwarzschild Radius & Event Horizon",
      ar: "نصف قطر شفارتزشيلد وأفق الحدث",
    },
    subtitle: {
      en: "Rs = 2GM/c² — Critical gravitational boundary where escape velocity equals light speed",
      ar: "Rs = 2GM/c² — الحد الحرج الذي تساوي عنده سرعة الإفلات سرعة الضوء",
    },
    meta: "Rs = 2GM / c²",
    image: "/images/space/black-hole.jpg",
    keywords:
      "schwarzschild radius event horizon black hole physics gravity escape velocity نصف قطر شفارتزشيلد أفق الحدث فيزياء الثقوب السوداء الجاذبية",
    targetSection: "black-holes",
    aiPrompt: {
      en: "Explain the Schwarzschild radius formula (Rs = 2GM/c²) and what physically happens at a black hole's event horizon.",
      ar: "اشرح معادلة نصف قطر شفارتزشيلد (Rs = 2GM/c²) وما الذي يحدث فيزيائياً عند أفق الحدث للثقب الأسود.",
    },
  },
  {
    id: "bh-time-dilation",
    category: "black-hole",
    categoryLabel: { en: "Black Hole Physics", ar: "فيزياء الثقوب السوداء" },
    title: {
      en: "Gravitational Time Dilation & General Relativity",
      ar: "تمدد الزمن الثقالي والنسبية العامة",
    },
    subtitle: {
      en: "How extreme spacetime curvature near a black hole slows down clocks relative to distant observers",
      ar: "كيف يؤدي انحناء الزمكان الشديد قرب الثقب الأسود إلى إبطاء مرور الزمن مقارنة بمراقب بعيد",
    },
    meta: "Δt∞ = Δt₀ / √(1 - Rs/r)",
    image: "/images/space/black-hole.jpg",
    keywords:
      "gravitational time dilation general relativity einstein spacetime clock black hole physics تمدد الزمن الثقالي النسبية العامة أينشتاين الزمكان",
    targetSection: "black-holes",
    aiPrompt: {
      en: "How does gravitational time dilation work near a black hole according to Einstein's General Relativity?",
      ar: "كيف يعمل تمدد الزمن الثقالي بالقرب من الثقب الأسود وفقاً لنظرية النسبية العامة لأينشتاين؟",
    },
  },
  {
    id: "bh-lensing",
    category: "black-hole",
    categoryLabel: { en: "Black Hole Physics", ar: "فيزياء الثقوب السوداء" },
    title: {
      en: "Gravitational Lensing & Einstein Rings",
      ar: "العدسة الجاذبية وحلقات أينشتاين",
    },
    subtitle: {
      en: "Deflection of light rays along warped spacetime geodesics around massive black holes and galaxies",
      ar: "انحراف أشعة الضوء عبر مسارات الزمكان المنحنية حول الثقوب السوداء والمجرات الضخمة",
    },
    meta: "r_ph = 1.5 Rs",
    image: "/images/space/black-hole.jpg",
    keywords:
      "gravitational lensing einstein ring photon sphere light bending black hole physics العدسة الجاذبية انحناء الضوء كرة الفوتونات",
    targetSection: "black-holes",
    aiPrompt: {
      en: "Explain gravitational lensing and how a black hole bends light to show the back of its accretion disk.",
      ar: "اشرح ظاهرة العدسة الجاذبية وكيف يحني الثقب الأسود الضوء ليُظهر الجزء الخلفي من قرص التزود.",
    },
  },
  {
    id: "bh-hawking",
    category: "black-hole",
    categoryLabel: { en: "Black Hole Physics", ar: "فيزياء الثقوب السوداء" },
    title: {
      en: "Hawking Radiation & Black Hole Thermodynamics",
      ar: "إشعاع هوكينغ والديناميكا الحرارية للثقوب السوداء",
    },
    subtitle: {
      en: "Quantum effects near the event horizon causing black holes to slowly radiate thermal energy",
      ar: "التأثيرات الكمومية قرب أفق الحدث التي تجعل الثقوب السوداء تشع طاقة حرارية ببطء",
    },
    meta: "T_H = ℏc³ / 8πGMk_B",
    image: "/images/space/black-hole.jpg",
    keywords:
      "hawking radiation quantum mechanics black hole evaporation entropy thermodynamics إشعاع هوكينغ تبخر الثقب الأسود فيزياء الكم",
    targetSection: "black-holes",
    aiPrompt: {
      en: "What is Hawking radiation and how do quantum effects allow black holes to evaporate over cosmic timescales?",
      ar: "ما هو إشعاع هوكينغ وكيف تسمح التأثيرات الكمومية بتبخر الثقوب السوداء عبر الأزمنة الكونية؟",
    },
  },
  {
    id: "sun-sol",
    category: "module",
    categoryLabel: { en: "Star · Solar System", ar: "نجم · النظام الشمسي" },
    title: { en: "The Sun (Sol)", ar: "الشمس (Sol)" },
    subtitle: {
      en: "G2V main-sequence star powering our Solar System via core hydrogen fusion",
      ar: "نجم النسق الأساسي (G2V) الذي يمد النظام الشمسي بالطاقة عبر الاندماج النووي",
    },
    meta: "5,778 K · 99.86% Mass",
    image: "/images/space/sun.jpg",
    keywords:
      "sun sol star solar system fusion corona solar wind الشمس النجم النظام الشمسي الاندماج النووي",
    targetSection: "solar-system",
    aiPrompt: {
      en: "Explain how nuclear fusion inside the Sun's core works and how solar wind affects the planets.",
      ar: "اشرح كيف يولّد الاندماج النووي في نواة الشمس طاقتها وكيف تؤثر الرياح الشمسية على الكواكب.",
    },
  },
];

export const HeaderSearchBar: React.FC<HeaderSearchBarProps> = ({
  language,
  onNavigate,
  onSelectPlanetAndOpen,
  onFocusPlanetIn3D,
  onSelectGalaxyAndOpen,
  onAskAiAbout,
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Build unified searchable index across planets, galaxies, black hole physics, and discoveries
  const allItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. All 8 Planets
    PLANETS_DATA.forEach((p) => {
      items.push({
        id: `planet-${p.id}`,
        category: "planet",
        categoryLabel: {
          en: `Planet 0${p.order} · ${p.classification.en}`,
          ar: `كوكب 0${p.order} · ${p.classification.ar}`,
        },
        title: p.name,
        subtitle: p.tagline,
        meta: `${p.distanceAU} AU · ${p.moonsCount} ${
          language === "ar" ? "قمر" : "moons"
        }`,
        image: `/images/space/${p.id}.jpg`,
        keywords: [
          p.id,
          p.name.en,
          p.name.ar,
          p.classification.en,
          p.classification.ar,
          p.tagline.en,
          p.tagline.ar,
          p.notableMoons.en,
          p.notableMoons.ar,
          p.internalStructure.en,
          p.internalStructure.ar,
          ...p.atmosphereComposition.map((a) => `${a.component.en} ${a.component.ar}`),
          p.uniqueFeature.en,
          p.uniqueFeature.ar,
          ...p.scientificFacts.map((f) => `${f.en} ${f.ar}`),
          "planet planets كوكب كواكب",
        ]
          .join(" ")
          .toLowerCase(),
        targetSection: "planets",
        planetId: p.id,
        aiPrompt: {
          en: `Tell me the most fascinating scientific facts about planet ${p.name.en}.`,
          ar: `أخبرني بأبرز الحقائق العلمية المذهلة عن كوكب ${p.name.ar}.`,
        },
      });
    });

    // 2. All 6 Galaxies
    GALAXIES_DATA.forEach((g) => {
      items.push({
        id: `galaxy-${g.id}`,
        category: "galaxy",
        categoryLabel: {
          en: `Galaxy · ${g.typeLabel.en}`,
          ar: `مجرة · ${g.typeLabel.ar}`,
        },
        title: g.name,
        subtitle: g.summary,
        meta: `${g.catalogId} · ${g.distanceLightYears[language]}`,
        image: `/images/space/${g.id}.jpg`,
        keywords: [
          g.id,
          g.catalogId,
          g.name.en,
          g.name.ar,
          g.type,
          g.typeLabel.en,
          g.typeLabel.ar,
          g.constellation.en,
          g.constellation.ar,
          g.summary.en,
          g.summary.ar,
          ...g.scientificHighlights.map((h) => `${h.en} ${h.ar}`),
          "galaxy galaxies مجرة مجرات",
        ]
          .join(" ")
          .toLowerCase(),
        targetSection: "galaxies",
        galaxyId: g.id,
        aiPrompt: {
          en: `Explain the structure, history, and astrophysics of ${g.name.en} (${g.catalogId}).`,
          ar: `اشرح البنية والتاريخ والفيزياء الفلكية الخاصة بـ ${g.name.ar} (${g.catalogId}).`,
        },
      });
    });

    // 3. Black Hole Anatomy & Relativistic Physics
    BLACK_HOLE_ANATOMY.forEach((bh) => {
      items.push({
        id: `bh-anatomy-${bh.id}`,
        category: "black-hole",
        categoryLabel: {
          en: "Black Hole Anatomy",
          ar: "تشريح وفيزياء الثقب الأسود",
        },
        title: bh.title,
        subtitle: bh.description,
        meta: bh.formula,
        image: "/images/space/black-hole.jpg",
        keywords: [
          bh.id,
          bh.title.en,
          bh.title.ar,
          bh.formula,
          bh.description.en,
          bh.description.ar,
          "black hole physics relativity event horizon ثقب أسود ثقوب سوداء فيزياء النسبية",
        ]
          .join(" ")
          .toLowerCase(),
        targetSection: "black-holes",
        aiPrompt: {
          en: `Explain the physics of ${bh.title.en} (${bh.formula}) around a black hole.`,
          ar: `اشرح الفيزياء الخاصة بـ ${bh.title.ar} (${bh.formula}) حول الثقب الأسود.`,
        },
      });
    });

    BLACK_HOLE_FACTS.forEach((fact, idx) => {
      items.push({
        id: `bh-fact-${idx}`,
        category: "black-hole",
        categoryLabel: {
          en: "Black Hole Astrophysics",
          ar: "فيزياء الثقوب السوداء",
        },
        title: {
          en: `Black Hole Insight #${idx + 1}`,
          ar: `حقيقة فيزيائية عن الثقوب السوداء #${idx + 1}`,
        },
        subtitle: fact,
        image: "/images/space/black-hole.jpg",
        keywords: [
          fact.en,
          fact.ar,
          "black hole physics spaghettification tidal force sagittarius hawking ثقب أسود فيزياء",
        ]
          .join(" ")
          .toLowerCase(),
        targetSection: "black-holes",
        aiPrompt: {
          en: `Explain this black hole astrophysics fact in detail: ${fact.en}`,
          ar: `اشرح هذه الحقيقة الفيزيائية عن الثقوب السوداء بالتفصيل: ${fact.ar}`,
        },
      });
    });

    // 4. Extra Relativistic & Solar System Physics Topics
    EXTRA_PHYSICS_TOPICS.forEach((topic) => {
      items.push({
        ...topic,
        keywords: topic.keywords.toLowerCase(),
      });
    });

    // 5. Featured Discoveries
    FEATURED_DISCOVERIES.forEach((disc) => {
      items.push({
        id: `disc-${disc.id}`,
        category: "discovery",
        categoryLabel: disc.category,
        title: disc.title,
        subtitle: disc.summary,
        meta: `${disc.mission} · ${disc.year}`,
        keywords: [
          disc.title.en,
          disc.title.ar,
          disc.summary.en,
          disc.summary.ar,
          disc.deepDive.en,
          disc.deepDive.ar,
          disc.mission,
          disc.keyMetricValue,
        ]
          .join(" ")
          .toLowerCase(),
        targetSection: disc.targetSection,
      });
    });

    return items;
  }, [language]);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      // Curated quick-access items when user focuses the empty search bar
      return allItems.filter((item) =>
        [
          "planet-saturn",
          "planet-earth",
          "galaxy-andromeda",
          "bh-schwarzschild",
          "bh-time-dilation",
          "galaxy-messier-87",
        ].includes(item.id)
      );
    }

    const terms = trimmed.split(/\s+/).filter(Boolean);

    const scored = allItems
      .map((item) => {
        const titleEn = item.title.en.toLowerCase();
        const titleAr = item.title.ar.toLowerCase();
        const subEn = item.subtitle.en.toLowerCase();
        const subAr = item.subtitle.ar.toLowerCase();

        let score = 0;
        for (const term of terms) {
          if (titleEn.startsWith(term) || titleAr.startsWith(term)) {
            score += 12;
          } else if (titleEn.includes(term) || titleAr.includes(term)) {
            score += 8;
          } else if (subEn.includes(term) || subAr.includes(term)) {
            score += 4;
          } else if (item.keywords.includes(term)) {
            score += 2;
          } else {
            return { item, score: 0 };
          }
        }
        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((entry) => entry.item);

    return scored;
  }, [query, allItems]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  // Global keyboard shortcut (Ctrl+K / Cmd+K or '/') to focus the header search bar
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    if (item.category === "planet" && item.planetId) {
      onSelectPlanetAndOpen(item.planetId);
    } else if (item.category === "galaxy" && item.galaxyId) {
      onSelectGalaxyAndOpen(item.galaxyId);
    } else {
      onNavigate(item.targetSection);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        filteredResults.length > 0
          ? (prev - 1 + filteredResults.length) % filteredResults.length
          : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[activeIndex]) {
        handleSelectItem(filteredResults[activeIndex]);
      } else if (query.trim()) {
        const q = query.trim();
        setIsOpen(false);
        setQuery("");
        onAskAiAbout(q);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      {/* Search Input Box */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border transition-colors ${
          isOpen
            ? "border-cyan-400/70 ring-2 ring-cyan-500/20"
            : "border-slate-800 hover:border-slate-700"
        }`}
      >
        <Search className="w-4 h-4 text-cyan-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            language === "ar"
              ? "ابحث عن كوكب، مجرة، أو فيزياء الثقوب السوداء..."
              : "Search planets, galaxies, black hole physics..."
          }
          aria-label={
            language === "ar"
              ? "البحث في الكون"
              : "Search planets, galaxies, or black hole physics"
          }
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label={language === "ar" ? "مسح البحث" : "Clear search"}
            className="p-0.5 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 rounded shrink-0">
            /
          </kbd>
        )}
      </div>

      {/* Instant Dropdown Results Modal */}
      {isOpen && (
        <div className="absolute top-full mt-2 inset-x-0 sm:w-[420px] sm:end-0 sm:inset-x-auto z-50 rounded-2xl bg-[#0B0E17]/98 border border-slate-700/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header status label */}
          <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800/90 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              {query.trim()
                ? language === "ar"
                  ? `نتائج البحث (${filteredResults.length})`
                  : `Matching Observatory Records (${filteredResults.length})`
                : language === "ar"
                ? "استكشاف سريع مقترح"
                : "Suggested Quick Jump"}
            </span>
            <span className="text-cyan-400">
              {language === "ar" ? "↑↓ للتنقل · Enter للفتح" : "↑↓ Navigate · Enter"}
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[370px] overflow-y-auto divide-y divide-slate-800/60">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected ? "bg-slate-800/90" : "hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title[language]}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0 bg-black mt-0.5"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Orbit className="w-4 h-4 text-cyan-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                          <span className="truncate">
                            {item.categoryLabel[language]}
                          </span>
                          {item.meta && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-violet-300 truncate">
                                {item.meta}
                              </span>
                            </>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">
                          {item.title[language]}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {item.subtitle[language]}
                        </p>
                      </div>
                    </div>

                    {/* Action Shortcuts */}
                    <div className="flex items-center gap-1.5 shrink-0 self-center">
                      {item.category === "planet" && item.planetId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            setQuery("");
                            onFocusPlanetIn3D(item.planetId!);
                          }}
                          title={
                            language === "ar"
                              ? "عرض في النظام الشمسي ثلاثي الأبعاد"
                              : "Focus in 3D Solar System"
                          }
                          className="px-2 py-1 rounded-md bg-slate-900 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-400/50 text-[11px] font-mono text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Compass className="w-3 h-3" />
                          <span>3D</span>
                        </button>
                      )}

                      {item.aiPrompt && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            setQuery("");
                            onAskAiAbout(item.aiPrompt![language]);
                          }}
                          title={
                            language === "ar"
                              ? "اسأل المرشد الفضائي الذكي"
                              : "Ask AI Space Guide"
                          }
                          className="p-1.5 rounded-md bg-slate-900 hover:bg-violet-600/30 border border-slate-700 hover:border-violet-400/50 text-violet-300 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="p-1 text-slate-400">
                        {item.category === "planet" ? (
                          <Eye className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        )}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-5 text-center">
                <p className="text-xs text-slate-400 mb-3">
                  {language === "ar"
                    ? `لا توجد مطابقات مباشرة لـ "${query}" في السجل المحلي.`
                    : `No direct catalog matches for "${query}".`}
                </p>
              </div>
            )}
          </div>

          {/* Direct Gemini AI Space Guide Query Footer */}
          {query.trim().length > 0 && (
            <div className="p-2.5 bg-slate-950/95 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const q = query.trim();
                  setIsOpen(false);
                  setQuery("");
                  onAskAiAbout(q);
                }}
                className="w-full py-2 px-3 rounded-xl bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/40 text-xs font-medium text-violet-200 flex items-center justify-between gap-2 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 truncate">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="truncate">
                    {language === "ar"
                      ? `اسأل المرشد الفضائي الذكي عن: "${query.trim()}"`
                      : `Ask AI Space Guide about "${query.trim()}"`}
                  </span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-violet-300 shrink-0" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
