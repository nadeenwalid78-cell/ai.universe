export type Language = "en" | "ar";

export type SectionId =
  | "home"
  | "solar-system"
  | "planets"
  | "galaxies"
  | "black-holes"
  | "ai-guide"
  | "quiz";

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface PlanetData {
  id: string;
  order: number;
  name: LocalizedText;
  classification: LocalizedText;
  tagline: LocalizedText;
  distanceKm: string;
  distanceAU: number;
  diameterKm: number;
  earthSizeRatio: number;
  avgTempC: number;
  avgTempK: number;
  moonsCount: number;
  notableMoons: LocalizedText;
  orbitalPeriod: LocalizedText;
  rotationPeriod: LocalizedText;
  axialTiltDeg: number;
  gravityMs2: number;
  atmosphereComposition: {
    component: LocalizedText;
    percentage: number;
    color: string;
  }[];
  internalStructure: LocalizedText;
  uniqueFeature: LocalizedText;
  scientificFacts: LocalizedText[];
  visualConfig: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    atmosphereColor: string;
    hasRings?: boolean;
    ringColor?: string;
    ringTilt?: number;
    orbitRadius3D: number;
    radius3D: number;
    orbitSpeed: number;
    rotationSpeed: number;
    textureType: "cratered" | "cloud-sulfuric" | "terrestrial" | "rusty-desert" | "banded-storm" | "ringed-gold" | "ice-cyan" | "deep-azure";
  };
}

export interface GalaxyData {
  id: string;
  name: LocalizedText;
  catalogId: string;
  type: "barred-spiral" | "spiral" | "elliptical" | "lenticular" | "irregular";
  typeLabel: LocalizedText;
  distanceLightYears: LocalizedText;
  diameterLightYears: LocalizedText;
  estimatedStars: LocalizedText;
  constellation: LocalizedText;
  massSolar: string;
  summary: LocalizedText;
  scientificHighlights: LocalizedText[];
  visualPreset: {
    coreColor: string;
    armColor: string;
    dustColor: string;
    armCount: number;
    armTightness: number;
    barLength: number;
    inclinationDeg: number;
    hasRelativisticJet?: boolean;
  };
}

export interface QuizQuestion {
  id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: LocalizedText;
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export interface FeaturedDiscovery {
  id: string;
  category: LocalizedText;
  mission: string;
  year: string;
  title: LocalizedText;
  summary: LocalizedText;
  keyMetricLabel: LocalizedText;
  keyMetricValue: string;
  deepDive: LocalizedText;
  targetSection: SectionId;
}

export const UI_TRANSLATIONS = {
  en: {
    brand: "AI UNIVERSE",
    tagline: "Explore Beyond Earth.",
    nav: {
      solarSystem: "Solar System",
      planets: "Planets",
      galaxies: "Galaxies",
      blackHoles: "Black Holes",
      quiz: "Space Quiz",
      aiGuide: "AI Space Guide",
    },
    subbar: {
      home: "Observatory Home",
      activeModule: "Active Module",
      unitsMetric: "Metric (km / °C)",
      unitsAstro: "Astronomical (AU / K)",
      askAiQuick: "Ask AI Guide",
      langSwitchLabel: "العربية",
    },
    hero: {
      kicker: "DIGITAL PLANETARIUM & ASTROPHYSICS OBSERVATORY",
      title: "AI UNIVERSE",
      subtitle: "Explore Beyond Earth.",
      description:
        "Journey through our Solar System in real-time 3D, inspect the atmospheric chemistry of all eight planets, simulate relativistic black hole horizons, and converse with our Gemini-powered Astrophysics Guide.",
      exploreBtn: "Explore Universe",
      planetariumBtn: "Launch 3D Solar System",
      aiGuideBtn: "Consult AI Space Guide",
      interactivePreviewTitle: "Interactive Heliocentric Orrery Preview",
      interactivePreviewHint: "Click any orbiting planet in the preview to inspect its telemetry or launch the full 3D view.",
      featuredHeading: "Featured Astrophysical Discoveries & Cosmic Benchmarks",
      featuredSubheading: "Empirical milestones shaping modern planetary science and deep-space cosmology.",
    },
    solarSystem: {
      kicker: "3D HELIOCENTRIC SIMULATION",
      title: "Solar System Explorer",
      subtitle: "Interactive orbital mechanics of the Sun and all eight major planets. Select any celestial body to focus the camera and inspect live orbital telemetry.",
      pause: "Pause Orbits",
      resume: "Resume Orbits",
      speedLabel: "Orbital Speed",
      showOrbits: "Orbital Paths",
      scaleModeObservatory: "Observatory Scale",
      scaleModeRelative: "Logarithmic Size",
      resetCamera: "Reset View",
      hideDock: "Hide Controls",
      showDock: "Show Controls",
      openFullDossier: "Open Full Planet Dossier",
      askAiAbout: "Ask AI About",
      sunTitle: "The Sun (Sol)",
      sunType: "G2V Yellow Dwarf Star",
      sunTemp: "5,500 °C (Photosphere) · 15,000,000 °C (Core)",
      sunMass: "99.86% of Total Solar System Mass",
      sunDesc:
        "Our parent star fuses roughly 600 million metric tons of hydrogen into helium every second in its core, generating the gravitational anchor and radiative energy that governs the entire Solar System.",
    },
    planets: {
      kicker: "COMPARATIVE PLANETOLOGY",
      title: "Planet Discovery Archive",
      subtitle: "Comprehensive physical, orbital, and atmospheric profiles for all eight planets orbiting our Sun.",
      distanceFromSun: "Distance from Sun",
      diameter: "Equatorial Diameter",
      avgTemperature: "Mean Temperature",
      moons: "Known Moons",
      orbitalPeriod: "Orbital Period (Year)",
      rotationPeriod: "Rotation Period (Day)",
      surfaceGravity: "Surface Gravity",
      axialTilt: "Axial Tilt",
      compositionTitle: "Atmospheric & Chemical Composition",
      internalStructureTitle: "Internal Structure",
      uniqueTitle: "What Makes This Planet Unique",
      factsTitle: "Key Scientific Observations",
      askAiPlanetBtn: "Ask AI Space Guide About This Planet",
      viewIn3DBtn: "Focus in 3D Solar System",
      compareEarth: "× Earth Diameter",
    },
    galaxies: {
      kicker: "EXTRAGALACTIC ASTROPHYSICS",
      title: "Galaxy Explorer",
      subtitle: "Discover the morphological diversity of island universes—from grand barred spirals like our Milky Way to supergiant ellipticals.",
      filterAll: "All Morphologies",
      filterSpiral: "Spiral & Barred Spiral",
      filterElliptical: "Elliptical",
      filterLenticular: "Lenticular & Irregular",
      distanceLabel: "Distance from Earth",
      diameterLabel: "Galactic Diameter",
      starsLabel: "Estimated Stars",
      constellationLabel: "Constellation",
      massLabel: "Total Halo Mass",
      simulatorTitle: "Interactive Galactic Morphology & Merger Lab",
      simulatorSubtitle: "Adjust spiral arm winding, central bar prominence, and simulate the 4.5-billion-year Milky Way–Andromeda gravitational encounter.",
      armTightness: "Spiral Arm Winding",
      barStrength: "Central Bar Ratio",
      starFormation: "Star-Forming H-II Density",
      mergerTimeline: "Milky Way–Andromeda Encounter (Billion Years)",
    },
    blackHoles: {
      kicker: "RELATIVISTIC GRAVITY & SPACETIME",
      title: "Black Hole Discovery",
      subtitle: "Explore regions of spacetime where gravitational curvature becomes so extreme that not even light can escape beyond the Event Horizon.",
      simTitle: "Relativistic Event Horizon & Gravitational Lensing Simulator",
      simSubtitle: "Manipulate black hole mass, spin parameter, and observer proximity to measure real-time Schwarzschild radius and gravitational time dilation.",
      massSlider: "Black Hole Mass",
      distanceSlider: "Probe Distance (in Rs)",
      spinSlider: "Kerr Spin Parameter (a*)",
      lensingToggle: "Einstein Lensing Grid",
      schwarzschildLabel: "Schwarzschild Radius (Rs)",
      timeDilationLabel: "Gravitational Time Dilation",
      tidalForceLabel: "Tidal Regime",
      escapeVelocityLabel: "Local Escape Velocity",
      anatomyTitle: "Anatomy of a Relativistic Black Hole",
      factsTitle: "Observational Evidence & Relativistic Facts",
    },
    aiGuide: {
      kicker: "GEMINI ASTROPHYSICS INTELLIGENCE",
      title: "AI Space Guide",
      subtitle: "Ask any question about planetary science, stellar evolution, black holes, or cosmology. Powered by Gemini with scientific accuracy guardrails.",
      placeholder: "Ask about black holes, exoplanets, the James Webb Telescope, or why Venus is hotter than Mercury...",
      sendBtn: "Transmit Query",
      loadingText: "Synthesizing astrophysical data...",
      clearChat: "Reset Session",
      suggestedLabel: "Suggested Scientific Inquiries",
      disclaimer: "Scientifically grounded educational responses. Distinguishes observational data from theoretical astrophysics.",
    },
    quiz: {
      kicker: "ASTRONOMICAL KNOWLEDGE ASSESSMENT",
      title: "Interactive Space Quiz",
      subtitle: "Test your understanding of planetary atmospheres, orbital mechanics, galactic structures, and relativistic physics.",
      diffAll: "All Levels",
      diffBeginner: "Beginner",
      diffIntermediate: "Intermediate",
      diffAdvanced: "Advanced",
      questionProgress: "Question",
      scoreLabel: "Current Score",
      streakLabel: "Streak",
      nextQuestion: "Next Question",
      finishQuiz: "View Final Assessment",
      restartQuiz: "Start New Assessment",
      correctBadge: "● Empirical Match — Correct",
      incorrectBadge: "▲ Calibration Error — Incorrect",
      explanationHeading: "Scientific Explanation",
      finalTitle: "Observatory Assessment Complete",
      finalSubtitle: "Review your astrophysical proficiency across the completed mission questions.",
    },
  },
  ar: {
    brand: "عالم الذكاء الفضائي · AI UNIVERSE",
    tagline: "استكشف ما وراء الأرض.",
    nav: {
      solarSystem: "النظام الشمسي",
      planets: "الكواكب",
      galaxies: "المجرات",
      blackHoles: "الثقوب السوداء",
      quiz: "اختبار الفضاء",
      aiGuide: "المرشد الفضائي الذكي",
    },
    subbar: {
      home: "الرئيسية للمرصد",
      activeModule: "الوحدة النشطة",
      unitsMetric: "وحدات قياسية (كم / °م)",
      unitsAstro: "وحدات فلكية (و.ف / كلفن)",
      askAiQuick: "اسأل المرشد الذكي",
      langSwitchLabel: "English",
    },
    hero: {
      kicker: "القبة السماوية الرقمية ومرصد الفيزياء الفلكية",
      title: "AI UNIVERSE",
      subtitle: "استكشف ما وراء الأرض.",
      description:
        "انطلق في رحلة تفاعلية ثلاثية الأبعاد عبر النظام الشمسي، واستكشف التركيب الكيميائي لجميع الكواكب الثمانية، وحاكِ فيزياء الثقوب السوداء وآفاق الحدث، وتحدث مع المرشد الفضائي الذكي المدعوم بنموذج Gemini.",
      exploreBtn: "استكشف الكون الآن",
      planetariumBtn: "تشغيل النظام الشمسي 3D",
      aiGuideBtn: "حاور المرشد الفضائي الذكي",
      interactivePreviewTitle: "معاينة حية لمدارات النظام الشمسي",
      interactivePreviewHint: "انقر على أي كوكب في المعاينة لاستعراض بياناته المدارية أو انتقل للعرض ثلاثي الأبعاد الكامل.",
      featuredHeading: "أبرز الاكتشافات الفلكية والحقائق الكونية",
      featuredSubheading: "معالم علمية رصدية شكّلت فهمنا الحديث لعلوم الكواكب والكون العميق.",
    },
    solarSystem: {
      kicker: "محاكاة ثلاثية الأبعاد للميكانيكا المدارية",
      title: "مستكشف النظام الشمسي",
      subtitle: "تصور تفاعلي للشمس والكواكب الثمانية ومساراتها المدارية. انقر على أي جرم سماوي لتقريب الكاميرا وعرض بياناته الفيزيائية.",
      pause: "إيقاف الحركة",
      resume: "استئناف الحركة",
      speedLabel: "سرعة المدار",
      showOrbits: "المسارات المدارية",
      scaleModeObservatory: "مقياس المرصد",
      scaleModeRelative: "الحجم النسبي",
      resetCamera: "إعادة ضبط الكاميرا",
      hideDock: "إخفاء لوحة التحكم",
      showDock: "إظهار لوحة التحكم",
      openFullDossier: "فتح الملف العلمي الكامل للكوكب",
      askAiAbout: "اسأل المرشد الذكي عن",
      sunTitle: "الشمس (Sol)",
      sunType: "نجم قزم أصفر من الفئة الطيفية G2V",
      sunTemp: "5,500 °م (السطح) · 15,000,000 °م (النواة)",
      sunMass: "99.86% من إجمالي كتلة النظام الشمسي",
      sunDesc:
        "يدمج نجمنا الأم نحو 600 مليون طن من الهيدروجين إلى هيليوم في كل ثانية داخل نواته، مما يوفر الجاذبية المركزية والطاقة الإشعاعية التي تحكم النظام الشمسي بأكمله.",
    },
    planets: {
      kicker: "علم الكواكب المقارن",
      title: "موسوعة استكشاف الكواكب",
      subtitle: "بطاقات علمية شاملة للخصائص الفيزيائية والمدارية والغلاف الجوي لجميع كواكب النظام الشمسي الثمانية.",
      distanceFromSun: "المسافة عن الشمس",
      diameter: "القطر الاستوائي",
      avgTemperature: "متوسط درجة الحرارة",
      moons: "الأقمار المعروفة",
      orbitalPeriod: "الفترة المدارية (السنة)",
      rotationPeriod: "فترة الدوران المحوري (اليوم)",
      surfaceGravity: "الجاذبية السطحية",
      axialTilt: "الميل المحوري",
      compositionTitle: "التركيب الكيميائي والغلاف الجوي",
      internalStructureTitle: "البنية الداخلية",
      uniqueTitle: "ما الذي يجعل هذا الكوكب فريداً؟",
      factsTitle: "حقائق علمية مذهلة",
      askAiPlanetBtn: "اسأل المرشد الفضائي الذكي عن هذا الكوكب",
      viewIn3DBtn: "استعراض في النظام الشمسي 3D",
      compareEarth: "× قطر الأرض",
    },
    galaxies: {
      kicker: "الفيزياء الفلكية خارج المجرية",
      title: "مستكشف المجرات",
      subtitle: "تعرّف على أنواع المجرات المختلفة في الكون المرئي — من المجرات الحلزونية الضلعية مثل درب التبانة إلى المجرات الإهليلجية العملاقة.",
      filterAll: "جميع التصنيفات",
      filterSpiral: "حلزونية وحلزونية ضلعية",
      filterElliptical: "إهليلجية (بيضاوية)",
      filterLenticular: "عدسية وغير منتظمة",
      distanceLabel: "المسافة عن الأرض",
      diameterLabel: "قطر المجرة",
      starsLabel: "عدد النجوم التقديري",
      constellationLabel: "الكوكبة السماوية",
      massLabel: "الكتلة الكلية",
      simulatorTitle: "مختبر محاكاة بنية المجرات واندماجها",
      simulatorSubtitle: "تحكم في التفاف الأذرع الحلزونية، وبروز الضلع المركزي، وحاكِ اقتراب مجرة أندروميدا ودرب التبانة خلال 4.5 مليار سنة.",
      armTightness: "التفاف الأذرع الحلزونية",
      barStrength: "نسبة الضلع المركزي",
      starFormation: "كثافة مناطق تشكل النجوم",
      mergerTimeline: "الخط الزمني لاندماج درب التبانة وأندروميدا (مليار سنة)",
    },
    blackHoles: {
      kicker: "الجاذبية النسبية وانحناء الزمكان",
      title: "استكشاف الثقوب السوداء",
      subtitle: "اكتشف ماهية الثقوب السوداء، وكيف يعمل أفق الحدث، وتأثيرات الجاذبية القصوى مثل تمدد الزمن وانحناء الضوء.",
      simTitle: "محاكي أفق الحدث وعدسة الجاذبية النسبية",
      simSubtitle: "غيّر كتلة الثقب الأسود ومعدل دورانه ومسافة المسبار لحساب نصف قطر شفارتزشيلد ومعامل تمدد الزمن الجاذبي لحظياً.",
      massSlider: "كتلة الثقب الأسود",
      distanceSlider: "مسافة الرصد (بوحدة Rs)",
      spinSlider: "معامل دوران كير (a*)",
      lensingToggle: "شبكة انحناء الزمكان",
      schwarzschildLabel: "نصف قطر شفارتزشيلد (Rs)",
      timeDilationLabel: "معامل تمدد الزمن الجاذبي",
      tidalForceLabel: "نطاق قوى المد والجزر",
      escapeVelocityLabel: "سرعة الإفلات المحلية",
      anatomyTitle: "التشريح الفيزيائي للثقب الأسود",
      factsTitle: "أدلة رصدية وحقائق علمية",
    },
    aiGuide: {
      kicker: "الذكاء الاصطناعي الفلكي المدعوم بـ GEMINI",
      title: "المرشد الفضائي الذكي",
      subtitle: "اطرح أي سؤال حول الفضاء، الكواكب، النجوم، المجرات، أو الثقوب السوداء واحصل على شرح علمي مبسط ودقيق باللغتين العربية والإنجليزية.",
      placeholder: "اسأل عن الثقوب السوداء، كواكب النظام الشمسي، تلسكوب جيمس ويب، أو لماذا كوكب الزهرة أشد حرارة من عطارد...",
      sendBtn: "إرسال السؤال",
      loadingText: "جارٍ تحليل البيانات الفلكية...",
      clearChat: "بدء جلسة جديدة",
      suggestedLabel: "أسئلة علمية مقترحة",
      disclaimer: "إجابات تعليمية مبنية على الحقائق العلمية الموثقة مع التمييز الدقيق بين الرصد الفلكي والنظريات الفيزيائية.",
    },
    quiz: {
      kicker: "تقييم المعرفة الفلكية",
      title: "اختبار الفضاء التفاعلي",
      subtitle: "اختبر معلوماتك الفلكية عبر أسئلة متعددة الخيارات بمستويات صعوبة متدرجة مع تغذية راجعة فورية وشرح علمي بعد كل إجابة.",
      diffAll: "جميع المستويات",
      diffBeginner: "مبتدئ",
      diffIntermediate: "متوسط",
      diffAdvanced: "متقدم",
      questionProgress: "السؤال",
      scoreLabel: "النتيجة الحالية",
      streakLabel: "سلسلة الإجابات",
      nextQuestion: "السؤال التالي",
      finishQuiz: "عرض التقييم النهائي",
      restartQuiz: "إعادة الاختبار",
      correctBadge: "● إجابة علمية صحيحة",
      incorrectBadge: "▲ إجابة غير دقيقة",
      explanationHeading: "التفسير العلمي",
      finalTitle: "اكتمل تقييم القبة السماوية",
      finalSubtitle: "راجع أداءك العلمي عبر الأسئلة الفلكية التي أجبت عنها.",
    },
  },
};

export const PLANETS_DATA: PlanetData[] = [
  {
    id: "mercury",
    order: 1,
    name: { en: "Mercury", ar: "عطارد" },
    classification: { en: "Terrestrial Planet", ar: "كوكب صخري أرضي" },
    tagline: {
      en: "The sun-scorched iron world of extreme thermal contrasts.",
      ar: "العالم الحديدي الأقرب إلى الشمس ذو التقلبات الحرارية القصوى.",
    },
    distanceKm: "57.9 Million km",
    distanceAU: 0.39,
    diameterKm: 4879,
    earthSizeRatio: 0.38,
    avgTempC: 167,
    avgTempK: 440,
    moonsCount: 0,
    notableMoons: { en: "None", ar: "لا توجد أقمار" },
    orbitalPeriod: { en: "88 Earth Days", ar: "88 يوماً أرضياً" },
    rotationPeriod: { en: "58.6 Earth Days", ar: "58.6 يوماً أرضياً" },
    axialTiltDeg: 0.03,
    gravityMs2: 3.7,
    atmosphereComposition: [
      { component: { en: "Oxygen (Exosphere)", ar: "أكسجين (غلاف خارجي رقيق)" }, percentage: 42, color: "#38bdf8" },
      { component: { en: "Sodium", ar: "صوديوم" }, percentage: 29, color: "#fbbf24" },
      { component: { en: "Hydrogen", ar: "هيدروجين" }, percentage: 22, color: "#a855f7" },
      { component: { en: "Helium & Potassium", ar: "هيليوم وبوتاسيوم" }, percentage: 7, color: "#94a3b8" },
    ],
    internalStructure: {
      en: "Possesses an enormous metallic iron-nickel core occupying nearly 85% of the planet's radius, surrounded by a thin silicate mantle and cratered crust.",
      ar: "يمتلك نواة معدنية هائلة من الحديد والنيكل تشكل نحو 85% من نصف قطر الكوكب، يحيط بها وشاح سيليكاتي رقيق وقشرة مليئة بالفوهات.",
    },
    uniqueFeature: {
      en: "Because of its 3:2 spin-orbit resonance and lack of a heat-retaining atmosphere, Mercury experiences the most extreme surface temperature swing in the Solar System: from 430 °C during the day to -180 °C at night.",
      ar: "بسبب رنينه المداري 3:2 وافتقاره لغلاف جوي يحبس الحرارة، يشهد عطارد أكبر تفاوت حراري سطحي في النظام الشمسي: من +430 °م نهاراً إلى -180 °م ليلاً.",
    },
    scientificFacts: [
      {
        en: "Despite being the closest planet to the Sun, permanent water ice exists deep inside permanently shadowed craters at Mercury's north and south poles.",
        ar: "رغم كونه الكوكب الأقرب للشمس، يوجد جليد مائي دائم في أعماق الفوهات المظللة دائماً عند قطبي عطارد الشمالي والجنوبي.",
      },
      {
        en: "As Mercury's massive iron core slowly cooled and contracted over billions of years, the entire planet shrank radially by about 7 kilometers, creating giant cliff-like thrust faults called lobate scarps.",
        ar: "مع تبرد نواته الحديدية العملاقة وانكماشها عبر مليارات السنين، تقلص نصف قطر عطارد بنحو 7 كيلومترات مما شكّل منحدرات صخرية عملاقة على سطحه.",
      },
      {
        en: "Mercury's elliptical orbit exhibits perihelion precession that provided one of the first empirical confirmations of Einstein's General Theory of Relativity.",
        ar: "أظهر انحراف حضيض مدار عطارد الإهليلجي أحد أوائل التأكيدات الرصدية لنظرية النسبية العامة لأينشتاين.",
      },
    ],
    visualConfig: {
      primaryColor: "#9ca3af",
      secondaryColor: "#52525b",
      accentColor: "#d4d4d8",
      atmosphereColor: "#71717a",
      orbitRadius3D: 10,
      radius3D: 0.75,
      orbitSpeed: 1.6,
      rotationSpeed: 0.004,
      textureType: "cratered",
    },
  },
  {
    id: "venus",
    order: 2,
    name: { en: "Venus", ar: "الزهرة" },
    classification: { en: "Terrestrial Planet", ar: "كوكب صخري أرضي" },
    tagline: {
      en: "Earth's structural twin locked in a runaway supercritical greenhouse atmosphere.",
      ar: "توأم الأرض حجماً والمحاط بغلاف جوي كثيف يولد احتباساً حرارياً هائلاً.",
    },
    distanceKm: "108.2 Million km",
    distanceAU: 0.72,
    diameterKm: 12104,
    earthSizeRatio: 0.95,
    avgTempC: 464,
    avgTempK: 737,
    moonsCount: 0,
    notableMoons: { en: "None", ar: "لا توجد أقمار" },
    orbitalPeriod: { en: "225 Earth Days", ar: "225 يوماً أرضياً" },
    rotationPeriod: { en: "243 Earth Days (Retrograde)", ar: "243 يوماً أرضياً (دوران تراجعي)" },
    axialTiltDeg: 177.36,
    gravityMs2: 8.87,
    atmosphereComposition: [
      { component: { en: "Carbon Dioxide (CO₂)", ar: "ثاني أكسيد الكربون (CO₂)" }, percentage: 96.5, color: "#f59e0b" },
      { component: { en: "Molecular Nitrogen (N₂)", ar: "نيتروجين جزيئي (N₂)" }, percentage: 3.5, color: "#fde047" },
    ],
    internalStructure: {
      en: "Similar in bulk density to Earth with an iron-nickel core and rocky silicate mantle, but lacks active Earth-style plate tectonics, releasing internal heat through widespread volcanic resurfacing.",
      ar: "يشبه الأرض في الكثافة ويمتلك نواة حديدية ووشاحاً صخرياً، لكنه يفتقر إلى الصفائح التكتونية النشطة على غرار الأرض وتتشكل تضاريسه عبر النشاط البركاني الواسع.",
    },
    uniqueFeature: {
      en: "Venus is the hottest planet in the Solar System (464 °C—hot enough to melt lead) and rotates backward (retrograde) so slowly that its sidereal day is longer than its year.",
      ar: "الزهرة هو الكوكب الأشد حرارة في النظام الشمسي (464 °م، ما يكفي لصهر الرصاص) ويدور حول نفسه باتجاه معاكس ببطء شديد يجعل يومه أطول من سنته.",
    },
    scientificFacts: [
      {
        en: "Surface atmospheric pressure on Venus is 92 bar—equivalent to the pressure found 900 meters underwater on Earth.",
        ar: "يبلغ الضغط الجوي على سطح الزهرة نحو 92 ضغطاً جوياً أرضياً، وهو ما يعادل الضغط على عمق 900 متر تحت سطح المحيط على الأرض.",
      },
      {
        en: "Opaque clouds of sulfuric acid droplets reflect 75% of incoming sunlight, making Venus the brightest natural point of light in Earth's night sky after the Moon.",
        ar: "تعكس سحب حمض الكبريتيك الكثيفة نحو 75% من ضوء الشمس الساقط عليها، مما يجعل الزهرة ألمع جرم في سماء الليل بعد القمر.",
      },
      {
        en: "Radar mapping by the Magellan spacecraft revealed over 1,600 major volcanoes and vast highland continents such as Ishtar Terra and Aphrodite Terra.",
        ar: "كشفت الخرائط الرادارية لمركبة ماجلان عن أكثر من 1,600 بركان رئيسي ومرتفعات قارية شاسعة مثل أرض عشتار وأرض أفروديت.",
      },
    ],
    visualConfig: {
      primaryColor: "#eab308",
      secondaryColor: "#ca8a04",
      accentColor: "#fef08a",
      atmosphereColor: "#facc15",
      orbitRadius3D: 14,
      radius3D: 1.1,
      orbitSpeed: 1.18,
      rotationSpeed: -0.002,
      textureType: "cloud-sulfuric",
    },
  },
  {
    id: "earth",
    order: 3,
    name: { en: "Earth", ar: "الأرض" },
    classification: { en: "Terrestrial Ocean World", ar: "كوكب صخري محيطي" },
    tagline: {
      en: "The pale blue oasis harboring liquid oceans, active plate tectonics, and a biosphere.",
      ar: "الواحة الزرقاء الوحيدة المعروفة باحتضان المحيطات السائلة والحياة والغلاف المغناطيسي الواقي.",
    },
    distanceKm: "149.6 Million km",
    distanceAU: 1.0,
    diameterKm: 12742,
    earthSizeRatio: 1.0,
    avgTempC: 15,
    avgTempK: 288,
    moonsCount: 1,
    notableMoons: { en: "The Moon (Luna)", ar: "القمر (لونا)" },
    orbitalPeriod: { en: "365.25 Days", ar: "365.25 يوماً" },
    rotationPeriod: { en: "23h 56m 4s", ar: "23 ساعة و56 دقيقة" },
    axialTiltDeg: 23.44,
    gravityMs2: 9.81,
    atmosphereComposition: [
      { component: { en: "Nitrogen (N₂)", ar: "نيتروجين (N₂)" }, percentage: 78.08, color: "#3b82f6" },
      { component: { en: "Oxygen (O₂)", ar: "أكسجين (O₂)" }, percentage: 20.95, color: "#10b981" },
      { component: { en: "Argon & Trace Gases (CO₂, H₂O)", ar: "أرغون وغازات ضئيلة" }, percentage: 0.97, color: "#38bdf8" },
    ],
    internalStructure: {
      en: "Differentiated into a solid inner iron-nickel core, a convecting liquid outer core generating the magnetosphere, a viscous silicate mantle, and tectonic crustal plates.",
      ar: "تتكون من نواة داخلية صلبة من الحديد والنيكل، ونواة خارجية سائلة تولد المجال المغناطيسي الواقي، ووشاح سيليكاتي، وقشرة مقسمة إلى صفائح تكتونية.",
    },
    uniqueFeature: {
      en: "Earth is the only known celestial body where water coexists stably at the surface in all three phases (liquid, ice, vapor) and where photosynthetic life maintains an oxygen-rich atmosphere.",
      ar: "الأرض هي الجرم السماوي الوحيد المعروف الذي يتواجد فيه الماء بصوره الثلاث (السائلة والصلبة والغازية) بوفرة على السطح مع غلاف جوي غني بالأكسجين الحيوي.",
    },
    scientificFacts: [
      {
        en: "Earth's magnetosphere deflects high-energy solar wind particles, preventing atmospheric stripping and creating polar auroras.",
        ar: "يصد الغلاف المغناطيسي للأرض الجسيمات المشحونة للرياح الشمسية، مما يحمي الغلاف الجوي من التآكل ويصنع ظاهرة الشفق القطبي.",
      },
      {
        en: "Our Moon is unusually large relative to Earth (about 27% of Earth's diameter), stabilizing Earth's 23.4° axial tilt and moderating long-term climate cycles.",
        ar: "يعد قمر الأرض كبيراً بشكل استثنائي مقارنة بحجم كوكبنا (نحو 27% من قطر الأرض)، وهو ما يحفظ استقرار ميل محور الأرض ومناخها عبر العصور.",
      },
      {
        en: "Approximately 71% of Earth's lithosphere is submerged beneath interconnected saline oceans with an average depth of 3.7 kilometers.",
        ar: "تغطي المحيطات المالحة المترابطة نحو 71% من سطح الأرض بمتوسط عمق يبلغ 3.7 كيلومتر.",
      },
    ],
    visualConfig: {
      primaryColor: "#2563eb",
      secondaryColor: "#10b981",
      accentColor: "#ffffff",
      atmosphereColor: "#38bdf8",
      orbitRadius3D: 18.5,
      radius3D: 1.18,
      orbitSpeed: 1.0,
      rotationSpeed: 0.015,
      textureType: "terrestrial",
    },
  },
  {
    id: "mars",
    order: 4,
    name: { en: "Mars", ar: "المريخ" },
    classification: { en: "Terrestrial Planet", ar: "كوكب صخري أرضي" },
    tagline: {
      en: "The iron-oxide desert world sculpted by ancient river valleys and colossal shield volcanoes.",
      ar: "الكوكب الأحمر الغني بأكسيد الحديد، موطن أكبر البراكين والأودية النهرية القديمة في النظام الشمسي.",
    },
    distanceKm: "227.9 Million km",
    distanceAU: 1.52,
    diameterKm: 6779,
    earthSizeRatio: 0.53,
    avgTempC: -65,
    avgTempK: 208,
    moonsCount: 2,
    notableMoons: { en: "Phobos & Deimos", ar: "فوبوس وديموس" },
    orbitalPeriod: { en: "687 Earth Days", ar: "687 يوماً أرضياً" },
    rotationPeriod: { en: "24h 37m (1 Sol)", ar: "24 ساعة و37 دقيقة" },
    axialTiltDeg: 25.19,
    gravityMs2: 3.71,
    atmosphereComposition: [
      { component: { en: "Carbon Dioxide (CO₂)", ar: "ثاني أكسيد الكربون (CO₂)" }, percentage: 95.3, color: "#ef4444" },
      { component: { en: "Molecular Nitrogen (N₂)", ar: "نيتروجين (N₂)" }, percentage: 2.6, color: "#f97316" },
      { component: { en: "Argon (Ar)", ar: "أرغون (Ar)" }, percentage: 1.9, color: "#fbbf24" },
    ],
    internalStructure: {
      en: "Contains a dense liquid iron-nickel-sulfur core, a dormant silicate mantle, and a thick iron-rich basaltic crust averaging 50 km in thickness.",
      ar: "يتكون من نواة سائلة غنية بالحديد والنيكل والكبريت، ووشاح سيليكاتي خامل، وقشرة بازلتية سميكة غنية بأكسيد الحديد.",
    },
    uniqueFeature: {
      en: "Home to Olympus Mons—the largest volcano in the Solar System at 21.9 km high (nearly three times the height of Mount Everest)—and Valles Marineris, a canyon system stretching 4,000 km.",
      ar: "يضم جبل أوليمبوس (أضخم بركان في النظام الشمسي بارتفاع 21.9 كم، أي ثلاثة أضعاف قمة إيفرست) وأخدود فاليس مارينيريس الممتد بطول 4,000 كم.",
    },
    scientificFacts: [
      {
        en: "Rovers like Perseverance and Curiosity have discovered ancient lakebeds, clay minerals, and river deltas proving liquid water flowed across Mars over 3.5 billion years ago.",
        ar: "اكتشفت المركبات الجوالة مثل بيرسيفيرانس وكيوريوسيتي قيعان بحيرات قديمة ومعادن طينية ودلتا أنهار تثبت تدفق المياه السائلة على المريخ قبل 3.5 مليار سنة.",
      },
      {
        en: "Mars experiences planet-encircling dust storms powered by solar heating that can obscure the entire surface for months.",
        ar: "يشهد المريخ عواصف ترابية كوكبية هائلة قد تغطي سطحه بالكامل لعدة أشهر متواصلة.",
      },
      {
        en: "Its inner moon Phobos orbits so close (6,000 km above the surface) that tidal deceleration will eventually tear it apart into a planetary ring in ~50 million years.",
        ar: "يدور قمره الداخلي فوبوس على ارتفاع قريب جداً (6,000 كم) بحيث ستؤدي قوى المد الجاذبية إلى تفكيكه وتشكيل حلقة حول المريخ خلال نحو 50 مليون سنة.",
      },
    ],
    visualConfig: {
      primaryColor: "#dc2626",
      secondaryColor: "#9a3412",
      accentColor: "#fdba74",
      atmosphereColor: "#f97316",
      orbitRadius3D: 23,
      radius3D: 0.9,
      orbitSpeed: 0.8,
      rotationSpeed: 0.014,
      textureType: "rusty-desert",
    },
  },
  {
    id: "jupiter",
    order: 5,
    name: { en: "Jupiter", ar: "المشتري" },
    classification: { en: "Gas Giant", ar: "عملاق غازي" },
    tagline: {
      en: "The colossal king of planets with metallic hydrogen depths and centuries-old cyclonic storms.",
      ar: "عملاق النظام الشمسي الأكبر ذو الأعاصير العاتية والأقمار الغاليليّة الأربعة.",
    },
    distanceKm: "778.5 Million km",
    distanceAU: 5.2,
    diameterKm: 139820,
    earthSizeRatio: 10.97,
    avgTempC: -110,
    avgTempK: 163,
    moonsCount: 95,
    notableMoons: { en: "Io, Europa, Ganymede, Callisto", ar: "آيو، أوروبا، غانيميد، كاليستو" },
    orbitalPeriod: { en: "11.86 Earth Years", ar: "11.86 سنة أرضية" },
    rotationPeriod: { en: "9h 55m (Fastest in Solar System)", ar: "9 ساعات و55 دقيقة (الأسرع دوراناً)" },
    axialTiltDeg: 3.13,
    gravityMs2: 24.79,
    atmosphereComposition: [
      { component: { en: "Molecular Hydrogen (H₂)", ar: "هيدروجين جزيئي (H₂)" }, percentage: 89.8, color: "#d97706" },
      { component: { en: "Helium (He)", ar: "هيليوم (He)" }, percentage: 10.2, color: "#fde68a" },
    ],
    internalStructure: {
      en: "Lacks a solid surface; gaseous hydrogen transitions under immense pressure into a vast ocean of liquid metallic hydrogen surrounding a diffuse rocky-ice core.",
      ar: "لا يمتلك سطحاً صلباً؛ بل يتحول غاز الهيدروجين تحت الضغط الهائل إلى محيط شاسع من الهيدروجين المعدني السائل يحيط بنواة كثيفة من الصخور والجليد.",
    },
    uniqueFeature: {
      en: "Jupiter has 2.5 times the combined mass of all other planets in the Solar System, and its Great Red Spot is a high-pressure anticyclone larger than Earth that has raged for over 300 years.",
      ar: "يفوق المشتري في كتلته ضعفي ونصف مجموع كتل بقية كواكب النظام الشمسي مجتمعة، وتعد البقعة الحمراء العظيمة إعصاراً أكبر من قطر الأرض مستمراً منذ أكثر من 300 عام.",
    },
    scientificFacts: [
      {
        en: "Jupiter rotates in under 10 hours, causing an equatorial bulge where its equatorial diameter is over 9,000 km wider than its pole-to-pole diameter.",
        ar: "يدور المشتري حول محوره في أقل من 10 ساعات، مما يسبب انتفاخاً استوائياً يجعل قطره الاستوائي أعرض بأكثر من 9,000 كم من قطره القطبي.",
      },
      {
        en: "Its moon Europa harbors a global subsurface saltwater ocean beneath an icy crust containing roughly twice the liquid water volume of all Earth's oceans.",
        ar: "يحتوي قمره الجليدي (أوروبا) على محيط مائي مالح تحت قشرته الجليدية يضم ضعف كمية المياه الموجودة في محيطات الأرض مجتمعة.",
      },
      {
        en: "Ganymede, Jupiter's largest moon, is larger than the planet Mercury and is the only moon known to generate its own internal magnetic field.",
        ar: "يعد قمره (غانيميد) أكبر حجماً من كوكب عطارد، وهو القمر الوحيد في النظام الشمسي الذي يمتلك غلافاً مغناطيسياً خاصاً به.",
      },
    ],
    visualConfig: {
      primaryColor: "#d97706",
      secondaryColor: "#92400e",
      accentColor: "#fef3c7",
      atmosphereColor: "#f59e0b",
      orbitRadius3D: 30,
      radius3D: 2.35,
      orbitSpeed: 0.44,
      rotationSpeed: 0.032,
      textureType: "banded-storm",
    },
  },
  {
    id: "saturn",
    order: 6,
    name: { en: "Saturn", ar: "زحل" },
    classification: { en: "Gas Giant", ar: "عملاق غازي" },
    tagline: {
      en: "The jewel of the Solar System crowned by an expansive architecture of crystalline ice rings.",
      ar: "جوهرة النظام الشمسي المتوج بنظام مهيب من الحلقات الجليدية البراقة.",
    },
    distanceKm: "1.43 Billion km",
    distanceAU: 9.58,
    diameterKm: 116460,
    earthSizeRatio: 9.14,
    avgTempC: -140,
    avgTempK: 133,
    moonsCount: 146,
    notableMoons: { en: "Titan, Enceladus, Mimas, Iapetus", ar: "تيتان، إنسيلادوس، ميماس، إيابيتوس" },
    orbitalPeriod: { en: "29.45 Earth Years", ar: "29.45 سنة أرضية" },
    rotationPeriod: { en: "10h 33m", ar: "10 ساعات و33 دقيقة" },
    axialTiltDeg: 26.73,
    gravityMs2: 10.44,
    atmosphereComposition: [
      { component: { en: "Molecular Hydrogen (H₂)", ar: "هيدروجين جزيئي (H₂)" }, percentage: 96.3, color: "#eab308" },
      { component: { en: "Helium (He)", ar: "هيليوم (He)" }, percentage: 3.25, color: "#fef08a" },
      { component: { en: "Methane & Ammonia", ar: "ميثان وأمونيا" }, percentage: 0.45, color: "#ca8a04" },
    ],
    internalStructure: {
      en: "Composed predominantly of hydrogen and helium with a mean density of 0.687 g/cm³—less dense than liquid water—enclosing a metallic hydrogen layer and rocky core.",
      ar: "يتكون أساساً من الهيدروجين والهيليوم بمتوسط كثافة 0.687 غ/سم³ (أقل من كثافة الماء السائل) مع طبقة هيدروجين معدني ونواة صخرية.",
    },
    uniqueFeature: {
      en: "Saturn's ring system spans 282,000 km across (three-quarters the distance from Earth to the Moon) yet averages only 10 to 30 meters in vertical thickness, composed of 99% pure water ice.",
      ar: "يمتد نظام حلقات زحل لمسافة 282,000 كم، لكن سمكه العمودي لا يتجاوز 10 إلى 30 متراً في المتوسط، ويتكون بنسبة 99% من جليد الماء النقي.",
    },
    scientificFacts: [
      {
        en: "Saturn's north pole hosts a persistent six-sided jet stream pattern—the Hexagon—measuring 29,000 km across with 320 km/h winds.",
        ar: "يوجد عند القطب الشمالي لزحل تيار نفاث سداسي الأضلاع فريد من نوعه يبلغ عرضه 29,000 كم وتصل سرعة رياحه إلى 320 كم/ساعة.",
      },
      {
        en: "Its moon Titan is the only moon in the Solar System with a thick nitrogen atmosphere and liquid hydrocarbon lakes of methane and ethane on its surface.",
        ar: "يعد قمره (تيتان) القمر الوحيد في النظام الشمسي الذي يمتلك غلافاً جوياً كثيفاً وبحيرات وأنهاراً سائلة من الميثان والإيثان على سطحه.",
      },
      {
        en: "Cryovolcanic geysers at the south pole of Saturn's moon Enceladus vent plumes of water vapor, organic molecules, and silica nanoparticles into space, feeding Saturn's E ring.",
        ar: "تطلق الينابيع الجليدية الحارة في القطب الجنوبي لقمر (إنسيلادوس) أعمدة من بخار الماء والجزيئات العضوية نحو الفضاء، مغذيةً الحلقة E لكوكب زحل.",
      },
    ],
    visualConfig: {
      primaryColor: "#eab308",
      secondaryColor: "#a16207",
      accentColor: "#fef9c3",
      atmosphereColor: "#fde047",
      hasRings: true,
      ringColor: "#fde68a",
      ringTilt: 0.46,
      orbitRadius3D: 38.5,
      radius3D: 2.0,
      orbitSpeed: 0.32,
      rotationSpeed: 0.028,
      textureType: "ringed-gold",
    },
  },
  {
    id: "uranus",
    order: 7,
    name: { en: "Uranus", ar: "أورانوس" },
    classification: { en: "Ice Giant", ar: "عملاق جليدي" },
    tagline: {
      en: "The sideways-rolling cyan ice giant with the coldest planetary atmosphere in the Solar System.",
      ar: "العملاق الجليدي الأزرق السماوي الذي يدور على جانبه بزاوية ميل محوري تبلغ 98 درجة.",
    },
    distanceKm: "2.87 Billion km",
    distanceAU: 19.2,
    diameterKm: 50724,
    earthSizeRatio: 3.98,
    avgTempC: -195,
    avgTempK: 78,
    moonsCount: 28,
    notableMoons: { en: "Miranda, Ariel, Umbriel, Titania, Oberon", ar: "ميراندا، أرييل، أومبريل، تيتانيا، أوبيرون" },
    orbitalPeriod: { en: "84 Earth Years", ar: "84 سنة أرضية" },
    rotationPeriod: { en: "17h 14m (Retrograde)", ar: "17 ساعة و14 دقيقة (تراجعي)" },
    axialTiltDeg: 97.77,
    gravityMs2: 8.69,
    atmosphereComposition: [
      { component: { en: "Molecular Hydrogen (H₂)", ar: "هيدروجين جزيئي (H₂)" }, percentage: 82.5, color: "#06b6d4" },
      { component: { en: "Helium (He)", ar: "هيليوم (He)" }, percentage: 15.2, color: "#67e8f9" },
      { component: { en: "Methane (CH₄)", ar: "ميثان (CH₄)" }, percentage: 2.3, color: "#0891b2" },
    ],
    internalStructure: {
      en: "Over 80% of its mass consists of a hot, dense fluid mantle of 'ices'—water, ammonia, and methane—surrounding a small rocky core.",
      ar: "يتكون أكثر من 80% من كتلته من وشاح مائع عالي الكثافة من الجليد الحار (الماء والأمونيا والميثان) يحيط بنواة صخرية صغيرة.",
    },
    uniqueFeature: {
      en: "Tilted at 97.77 degrees—likely due to a cataclysmic protoplanetary collision—Uranus effectively rolls around the Sun on its side, subjecting each pole to 42 continuous Earth years of sunlight followed by 42 years of darkness.",
      ar: "يميل محور دوران أورانوس بزاوية 97.77 درجة (ربما نتيجة اصطدام كوني قديم)، مما يجعله يتدحرج على جانبه حول الشمس بحيث يشهد كل قطب 42 سنة متواصلة من النهار تليها 42 سنة من الليل.",
    },
    scientificFacts: [
      {
        en: "Atmospheric methane absorbs red wavelengths of sunlight and scatters blue-green wavelengths back into space, giving Uranus its serene aquamarine hue.",
        ar: "يمتص غاز الميثان في غلافه الجوي الضوء الأحمر من أشعة الشمس ويعكس الأطوال الموجية الزرقاء والخضراء، مما يمنح أورانوس لونه الفيروزي المميز.",
      },
      {
        en: "Uranus radiates almost no excess internal heat compared to the other giant planets, allowing its tropopause to drop to 49 K (-224 °C).",
        ar: "لا يشع أورانوس حرارة داخلية تذكر مقارنة بالعمالقة الغازية الأخرى، مما يجعل غلافه الجوي يسجل أدنى حرارة كوكبية في النظام الشمسي (-224 °م).",
      },
      {
        en: "It is encircled by 13 faint, dark narrow rings and moons named after characters from the works of William Shakespeare and Alexander Pope.",
        ar: "تحيط به 13 حلقة خافتة وداكنة، وقد سُمّيت أقماره تيمناً بشخصيات أدبية من أعمال ويليام شكسبير وألكسندر بوب.",
      },
    ],
    visualConfig: {
      primaryColor: "#06b6d4",
      secondaryColor: "#0e7490",
      accentColor: "#cffafe",
      atmosphereColor: "#22d3ee",
      hasRings: true,
      ringColor: "#67e8f9",
      ringTilt: 1.5,
      orbitRadius3D: 46.5,
      radius3D: 1.55,
      orbitSpeed: 0.22,
      rotationSpeed: -0.02,
      textureType: "ice-cyan",
    },
  },
  {
    id: "neptune",
    order: 8,
    name: { en: "Neptune", ar: "نبتون" },
    classification: { en: "Ice Giant", ar: "عملاق جليدي" },
    tagline: {
      en: "The distant sapphire world whipped by supersonic winds at the frontier of the Kuiper Belt.",
      ar: "الكوكب الأزرق العميق الأبعد عن الشمس، موطن أسرع الرياح الفائقة للصوت في النظام الشمسي.",
    },
    distanceKm: "4.50 Billion km",
    distanceAU: 30.07,
    diameterKm: 49244,
    earthSizeRatio: 3.86,
    avgTempC: -200,
    avgTempK: 73,
    moonsCount: 16,
    notableMoons: { en: "Triton, Proteus, Nereid", ar: "ترايتون، بروتيوس، نيريد" },
    orbitalPeriod: { en: "164.8 Earth Years", ar: "164.8 سنة أرضية" },
    rotationPeriod: { en: "16h 6m", ar: "16 ساعة و6 دقائق" },
    axialTiltDeg: 28.32,
    gravityMs2: 11.15,
    atmosphereComposition: [
      { component: { en: "Molecular Hydrogen (H₂)", ar: "هيدروجين جزيئي (H₂)" }, percentage: 80.0, color: "#2563eb" },
      { component: { en: "Helium (He)", ar: "هيليوم (He)" }, percentage: 19.0, color: "#60a5fa" },
      { component: { en: "Methane (CH₄)", ar: "ميثان (CH₄)" }, percentage: 1.5, color: "#1d4ed8" },
    ],
    internalStructure: {
      en: "Dense mantle of superionic water, ammonia, and methane where extreme pressures compress carbon atoms into sinking diamond crystals.",
      ar: "وشاح كثيف من الماء المتأين والأمونيا والميثان، حيث يؤدي الضغط الهائل في طبقاته العميقة إلى ضغط ذرات الكربون وتحويلها إلى بلورات ألماس.",
    },
    uniqueFeature: {
      en: "Neptune was the first planet discovered through mathematical prediction (by Urbain Le Verrier and John Couch Adams in 1846) rather than direct sky scanning, and sustains the fastest winds in the Solar System at over 2,100 km/h.",
      ar: "نبتون هو أول كوكب يُكتشف عبر الحسابات الرياضية لقوانين الجاذبية (عام 1846) قبل رصده بالتلسكوب، وتهب في غلافه الجوي أسرع رياح في النظام الشمسي بسرعة تتجاوز 2,100 كم/ساعة.",
    },
    scientificFacts: [
      {
        en: "Neptune radiates 2.6 times more thermal energy than it receives from the distant Sun, driving violent convective storm systems.",
        ar: "يبعث نبتون طاقة حرارية داخلية تزيد بنحو 2.6 مرة عما يتلقاه من أشعة الشمس البعيدة، مما يغذي عواصفه الجوية العنيفة.",
      },
      {
        en: "Its largest moon, Triton, orbits in a retrograde direction and has active nitrogen ice geysers—strong evidence that Triton is a captured Kuiper Belt dwarf planet.",
        ar: "يدور قمره الأكبر (ترايتون) في مدار تراجعي معاكس لدوران الكوكب ويضم ينابيع نشطة من النيتروجين المتجمد، مما يدل على أنه جرم التقطته جاذبية نبتون من حزام كايبر.",
      },
      {
        en: "In 2011, Neptune completed its very first full 164.8-year orbit around the Sun since its discovery in 1846.",
        ar: "في عام 2011، أتم كوكب نبتون أول دورة مدارية كاملة له حول الشمس (مدتها 164.8 سنة) منذ لحظة اكتشافه عام 1846.",
      },
    ],
    visualConfig: {
      primaryColor: "#2563eb",
      secondaryColor: "#1e3a8a",
      accentColor: "#93c5fd",
      atmosphereColor: "#3b82f6",
      orbitRadius3D: 54,
      radius3D: 1.5,
      orbitSpeed: 0.16,
      rotationSpeed: 0.022,
      textureType: "deep-azure",
    },
  },
];

export const GALAXIES_DATA: GalaxyData[] = [
  {
    id: "milky-way",
    name: { en: "The Milky Way", ar: "مجرة درب التبانة" },
    catalogId: "Local Group Primary · SBbc",
    type: "barred-spiral",
    typeLabel: { en: "Barred Spiral Galaxy (SBbc)", ar: "مجرة حلزونية ضلعية (SBbc)" },
    distanceLightYears: { en: "26,670 ly (to Galactic Center)", ar: "26,670 سنة ضوئية (عن المركز المجري)" },
    diameterLightYears: { en: "105,700 Light-Years", ar: "105,700 سنة ضوئية" },
    estimatedStars: { en: "100 – 400 Billion Stars", ar: "100 – 400 مليار نجم" },
    constellation: { en: "Sagittarius (Galactic Core)", ar: "كوكبة القوس (المركز المجري)" },
    massSolar: "1.5 × 10¹² M☉",
    summary: {
      en: "Our home galaxy is a grand barred spiral disk consisting of a peanut-shaped central bulge of older stars, four primary spiral arms rich in interstellar gas and dust, and an expansive dark matter halo.",
      ar: "مجرتنا الأم هي مجرة حلزونية ضلعية ضخمة تتكون من انتفاخ مركزي ضلعي من النجوم المعمرة، وأربعة أذرع حلزونية غنية بالغاز والغبار الكوني، وهالة هائلة من المادة المظلمة.",
    },
    scientificHighlights: [
      {
        en: "Our Solar System resides in the Orion-Cygnus Spur, approximately 27,000 light-years from the supermassive black hole Sagittarius A* (4.15 million solar masses) at the Galactic Center.",
        ar: "يقع نظامنا الشمسي في ذراع الجبار الفرعي على بعد 27,000 سنة ضوئية تقريباً من الثقب الأسود الفائق (الرامي A*) البالغة كتلته 4.15 مليون كتلة شمسية في مركز المجرة.",
      },
      {
        en: "Orbiting at ~230 km/s, the Sun and Solar System take approximately 225–250 million years (one 'Galactic Year') to complete a single revolution around the Milky Way.",
        ar: "يدور النظام الشمسي بسرعة 230 كم/ثانية حول مركز المجرة، ويستغرق نحو 225 إلى 250 مليون سنة لإتمام دورة مجرية واحدة كاملة.",
      },
      {
        en: "Data from ESA's Gaia space observatory shows the Milky Way's outer disk is subtly warped and twisted due to gravitational interactions with satellite galaxies like the Sagittarius Dwarf.",
        ar: "أظهرت بيانات مرصد (غايا) الفضائي أن القرص الخارجي لمجرة درب التبانة منحني قليلاً نتيجة التفاعلات الجاذبية مع المجرات القزمة التابعة لها.",
      },
    ],
    visualPreset: {
      coreColor: "#fef08a",
      armColor: "#60a5fa",
      dustColor: "#a855f7",
      armCount: 4,
      armTightness: 0.42,
      barLength: 0.28,
      inclinationDeg: 32,
    },
  },
  {
    id: "andromeda",
    name: { en: "Andromeda Galaxy", ar: "مجرة المرأة المسلسلة (أندروميدا)" },
    catalogId: "Messier 31 · NGC 224",
    type: "spiral",
    typeLabel: { en: "SA(s)b Grand Spiral Galaxy", ar: "مجرة حلزونية عظمى SA(s)b" },
    distanceLightYears: { en: "2.537 Million Light-Years", ar: "2.537 مليون سنة ضوئية" },
    diameterLightYears: { en: "152,000 Light-Years", ar: "152,000 سنة ضوئية" },
    estimatedStars: { en: "~1 Trillion Stars", ar: "نحو تريليون (1,000 مليار) نجم" },
    constellation: { en: "Andromeda", ar: "كوكبة المرأة المسلسلة" },
    massSolar: "1.5 × 10¹² M☉",
    summary: {
      en: "The largest galaxy in our Local Group and the most distant celestial object visible to the unaided human eye from Earth. Andromeda contains roughly double the stellar population of the Milky Way.",
      ar: "أكبر مجرات مجموعتنا المحلية وأبعد جرم كوني يمكن رؤيته بالعين المجردة من الأرض في الليالي الصافية، وتضم قرابة ضعف عدد نجوم مجرتنا.",
    },
    scientificHighlights: [
      {
        en: "Andromeda is approaching the Milky Way at approximately 110 kilometers per second (blueshifted); in ~4.5 billion years the two galaxies will merge to form a giant elliptical galaxy ('Milkomeda').",
        ar: "تقترب مجرة أندروميدا من مجرتنا بسرعة 110 كم/ثانية؛ وخلال نحو 4.5 مليار سنة ستندمج المجرتان لتشكلا مجرة إهليلجية عملاقة.",
      },
      {
        en: "Hubble Space Telescope observations revealed that Andromeda's nucleus has a double-peaked stellar concentration orbiting a central black hole of over 100 million solar masses.",
        ar: "كشفت أرصاد تلسكوب هابل أن نواة أندروميدا تحتوي على تجمع نجمي مزدوج يدور حول ثقب أسود مركزي فائق الكتلة تتجاوز كتلته 100 مليون شمس.",
      },
      {
        en: "In 1924, Edwin Hubble measured Cepheid variable stars inside M31, proving definitively that 'spiral nebulae' are independent external galaxies far beyond the Milky Way.",
        ar: "في عام 1924، رصد إدوين هابل نجوماً متغيرة قيفاوية داخل أندروميدا، مثبتاً لأول مرة أن السدم الحلزونية هي مجرات مستقلة تقع خارج درب التبانة.",
      },
    ],
    visualPreset: {
      coreColor: "#fde68a",
      armColor: "#818cf8",
      dustColor: "#f59e0b",
      armCount: 2,
      armTightness: 0.34,
      barLength: 0.1,
      inclinationDeg: 62,
    },
  },
  {
    id: "sombrero",
    name: { en: "Sombrero Galaxy", ar: "مجرة القبعة المكسيكية (سومبريرو)" },
    catalogId: "Messier 104 · NGC 4594",
    type: "lenticular",
    typeLabel: { en: "Unbarred Spiral / Lenticular (SA(s)a)", ar: "مجرة حلزونية/عدسية ذات حزام غباري" },
    distanceLightYears: { en: "31.1 Million Light-Years", ar: "31.1 مليون سنة ضوئية" },
    diameterLightYears: { en: "49,000 Light-Years", ar: "49,000 سنة ضوئية" },
    estimatedStars: { en: "~100 Billion Stars", ar: "نحو 100 مليار نجم" },
    constellation: { en: "Virgo", ar: "كوكبة العذراء" },
    massSolar: "8.0 × 10¹¹ M☉",
    summary: {
      en: "Viewed nearly edge-on (tilted just 6 degrees from our line of sight), Messier 104 is renowned for its brilliant white nuclear bulge encircled by a remarkably symmetric, opaque ring of cold molecular dust.",
      ar: "تُرى هذه المجرة من حافتها تقريباً (بميل 6 درجات فقط عن خط نظرنا)، وتشتهر بانتفاخها المركزي الساطع المحاط بحلقة متناظرة وكثيفة من الغبار الكوني البارد.",
    },
    scientificHighlights: [
      {
        en: "Infrared observations by the James Webb Space Telescope (MIRI) resolved intricate clumpy rings of polycyclic aromatic hydrocarbons (PAHs) along the outer dust ring.",
        ar: "كشفت أرصاد الأشعة تحت الحمراء لتلسكوب جيمس ويب الفضائي عن تفاصيل دقيقة لحلقة الغبار الخارجية ومناطق تشكل النجوم داخلها.",
      },
      {
        en: "Its halo hosts an extraordinary population of nearly 2,000 globular star clusters—roughly ten times more than orbit the Milky Way.",
        ar: "تحتضن هالتها نحو 2,000 عنقود نجمي كروي، أي ما يعادل عشرة أضعاف عدد العناقيد الكروية في مجرة درب التبانة.",
      },
      {
        en: "At the core of the Sombrero Galaxy lies a 1-billion-solar-mass supermassive black hole—one of the most massive measured in nearby galaxies.",
        ar: "يقبع في قلب مجرة سومبريرو ثقب أسود فائق الكتلة تقدر كتلته بنحو مليار كتلة شمسية.",
      },
    ],
    visualPreset: {
      coreColor: "#fffbeb",
      armColor: "#f59e0b",
      dustColor: "#451a03",
      armCount: 2,
      armTightness: 0.18,
      barLength: 0.0,
      inclinationDeg: 82,
    },
  },
  {
    id: "messier-87",
    name: { en: "Virgo A (Messier 87)", ar: "مجرة العذراء A (مسييه 87)" },
    catalogId: "Messier 87 · NGC 4486",
    type: "elliptical",
    typeLabel: { en: "Supergiant Elliptical Galaxy (E0p)", ar: "مجرة إهليلجية فوق عملاقة (E0p)" },
    distanceLightYears: { en: "53.5 Million Light-Years", ar: "53.5 مليون سنة ضوئية" },
    diameterLightYears: { en: "132,000 Light-Years", ar: "132,000 سنة ضوئية" },
    estimatedStars: { en: "1 – 2 Trillion Stars", ar: "1 إلى 2 تريليون نجم" },
    constellation: { en: "Virgo", ar: "كوكبة العذراء" },
    massSolar: "2.4 × 10¹² M☉",
    summary: {
      en: "The dominant central galaxy of the Virgo Cluster. Unlike flat spiral disks, M87 is a colossal golden ellipsoid of ancient stars pierced by a 5,000-light-year relativistic plasma jet launched from its core.",
      ar: "المجرة المركزية المهيمنة في عنقود العذراء المجري؛ وهي كرة ذهبية هائلة من تريليونات النجوم المعمرة ينطلق من نواتها تدفق بلازمي نسبي يمتد لـ 5,000 سنة ضوئية.",
    },
    scientificHighlights: [
      {
        en: "In April 2019, the Event Horizon Telescope (EHT) collaboration captured history's first direct image of a black hole shadow by resolving M87*, M87's 6.5-billion-solar-mass central black hole.",
        ar: "في أبريل 2019، التقطت شبكة تلسكوب أفق الحدث (EHT) أول صورة مباشرة في التاريخ لظل ثقب أسود، وهو الثقب المركزي (M87*) البالغة كتلته 6.5 مليار شمس.",
      },
      {
        en: "M87 possesses over 12,000 globular clusters, accumulated through billions of years of galactic mergers at the gravitational center of the Virgo Cluster.",
        ar: "تمتلك المجرة أكثر من 12,000 عنقود نجمي كروي تجمعت عبر مليارات السنين من عمليات الاندماج المجري في قلب عنقود العذراء.",
      },
      {
        en: "Its relativistic jet accelerates electrons along twisted magnetic field lines at nearly the speed of light, emitting brilliant synchrotron radiation from radio to X-rays.",
        ar: "يسرّع التدفق النفاث الخارج من مركزها الإلكترونات عبر خطوط المجال المغناطيسي إلى سرعات تقارب سرعة الضوء، مطلقاً إشعاعاً سنكروترونياً ساطعاً.",
      },
    ],
    visualPreset: {
      coreColor: "#fef3c7",
      armColor: "#fbbf24",
      dustColor: "#38bdf8",
      armCount: 0,
      armTightness: 0.1,
      barLength: 0.0,
      inclinationDeg: 15,
      hasRelativisticJet: true,
    },
  },
  {
    id: "whirlpool",
    name: { en: "Whirlpool Galaxy", ar: "مجرة الدوامة (Whirlpool)" },
    catalogId: "Messier 51a · NGC 5194",
    type: "spiral",
    typeLabel: { en: "Grand-Design Spiral Galaxy (SA(s)bc)", ar: "مجرة حلزونية متناظرة التصميم" },
    distanceLightYears: { en: "31 Million Light-Years", ar: "31 مليون سنة ضوئية" },
    diameterLightYears: { en: "76,900 Light-Years", ar: "76,900 سنة ضوئية" },
    estimatedStars: { en: "~100 Billion Stars", ar: "نحو 100 مليار نجم" },
    constellation: { en: "Canes Venatici", ar: "كوكبة السلوقيان" },
    massSolar: "1.6 × 10¹¹ M☉",
    summary: {
      en: "The archetype of a face-on grand-design spiral galaxy. Its two sweeping logarithmic arms are compressed by tidal interaction with companion galaxy NGC 5195, triggering intense bursts of crimson H-II star formation.",
      ar: "النموذج الكلاسيكي للمجرات الحلزونية المواجهة للأرض، حيث تتفاعل أذرعها الحلزونية جاذبياً مع المجرة المرافقة NGC 5195 مما يحفز ولادة النجوم بكثافة عالية.",
    },
    scientificHighlights: [
      {
        en: "M51 was the very first celestial object in history where spiral structure was recognized (by Lord Rosse in 1845 using the Leviathan of Parsonstown telescope).",
        ar: "تعد مجرة الدوامة أول جرم في تاريخ علم الفلك تُكتشف بنيته الحلزونية (على يد اللورد روس عام 1845).",
      },
      {
        en: "Spiral density waves sweep through the disk, compressing cold hydrogen clouds into luminous knots of massive O and B blue supergiant stars.",
        ar: "تعمل موجات الكثافة الحلزونية على ضغط سحب الهيدروجين الباردة، مما يؤدي إلى ولادة عناقيد ساطعة من النجوم العملاقة الزرقاء.",
      },
    ],
    visualPreset: {
      coreColor: "#fef9c3",
      armColor: "#38bdf8",
      dustColor: "#ec4899",
      armCount: 2,
      armTightness: 0.52,
      barLength: 0.08,
      inclinationDeg: 18,
    },
  },
  {
    id: "lmc",
    name: { en: "Large Magellanic Cloud", ar: "سحابة ماجلان الكبرى" },
    catalogId: "PGC 17223 · LMC",
    type: "irregular",
    typeLabel: { en: "Magellanic Irregular / Dwarf Barred (SB(s)m)", ar: "مجرة قزمة غير منتظمة / ضلعية" },
    distanceLightYears: { en: "163,000 Light-Years", ar: "163,000 سنة ضوئية" },
    diameterLightYears: { en: "32,200 Light-Years", ar: "32,200 سنة ضوئية" },
    estimatedStars: { en: "~20 Billion Stars", ar: "نحو 20 مليار نجم" },
    constellation: { en: "Dorado / Mensa", ar: "كوكبة أبو سيف / الجبل" },
    massSolar: "1.38 × 10¹¹ M☉",
    summary: {
      en: "A prominent satellite galaxy orbiting the Milky Way whose asymmetric bar and single spiral arm have been sculpted by tidal forces. It contains the Tarantula Nebula, the most active starburst region in the Local Group.",
      ar: "مجرة تابعة بارزة تدور حول درب التبانة، شوّهت قوى الجاذبية شكلها، وتضم سديم الرتيلاء الذي يعد أنشط منطقة لتشكل النجوم في المجموعة المحلية.",
    },
    scientificHighlights: [
      {
        en: "Hosted Supernova 1987A, the closest observed supernova since the invention of the telescope, whose neutrino burst was detected on Earth hours before the optical flash arrived.",
        ar: "شهدت انفجار المستعر الأعظم (SN 1987A)، وهو أقرب مستعر أعظم يُرصد بالتلسكوبات الحديثة، حيث رُصدت جسيمات النيوترينو المنبعثة منه على الأرض قبل وصول ضوئه بساعات.",
      },
      {
        en: "The Tarantula Nebula (30 Doradus) inside the LMC harbors R136a1, one of the most massive and luminous stars known (~200 solar masses and 6 million times the Sun's luminosity).",
        ar: "يحتوي سديم الرتيلاء داخلها على النجم العملاق (R136a1)، وهو من أكثر النجوم المكتشفة كتلةً ولمعاناً (نحو 200 كتلة شمسية و6 ملايين ضعف سطوع الشمس).",
      },
    ],
    visualPreset: {
      coreColor: "#e0e7ff",
      armColor: "#a855f7",
      dustColor: "#38bdf8",
      armCount: 1,
      armTightness: 0.65,
      barLength: 0.38,
      inclinationDeg: 35,
    },
  },
];

export const BLACK_HOLE_ANATOMY = [
  {
    id: "event-horizon",
    title: { en: "01. Event Horizon (Schwarzschild Radius)", ar: "01. أفق الحدث (نصف قطر شفارتزشيلد)" },
    formula: "R_s = 2GM / c²",
    description: {
      en: "The causal boundary in spacetime where the gravitational escape velocity equals the speed of light (c = 299,792 km/s). Inside this boundary, all future-directed light cones tilt inward toward the center.",
      ar: "الحد الفاصل في الزمكان الذي تصبح عنده سرعة الإفلات الجاذبية مساوية لسرعة الضوء (299,792 كم/ث). بمجرد عبور أفق الحدث، لا يمكن لأي مادة أو إشعاع كهرومغناطيسي العودة للخارج.",
    },
  },
  {
    id: "photon-sphere",
    title: { en: "02. Photon Sphere & Shadow Ring", ar: "02. كرة الفوتونات وحلقة الظل" },
    formula: "R_p = 1.5 R_s (Non-rotating)",
    description: {
      en: "At 1.5 times the Schwarzschild radius (for a non-spinning black hole), gravity bends spacetime so strongly that photons are forced to travel in unstable circular orbits, producing a bright lensed photon ring.",
      ar: "على مسافة تعادل 1.5 مرة من نصف قطر شفارتزشيلد، تنحني مسارات الضوء بشدة تجعل الفوتونات تدور في مدارات دائرية غير مستقرة حول الثقب الأسود مشكلةً حلقة ضوئية ساطعة.",
    },
  },
  {
    id: "accretion-disk",
    title: { en: "03. Relativistic Accretion Disk", ar: "03. قرص التزود (الالتحام) النسبي" },
    formula: "η ≈ 6% – 42% mc²",
    description: {
      en: "Infalling gas and plasma spiral inward at relativistic speeds. Viscous friction heats the inner disk to millions of Kelvin, converting up to 42% of rest-mass energy into X-rays and optical radiation—far more efficient than stellar fusion.",
      ar: "يدور الغاز والبلازما الساقطة نحو الثقب الأسود بسرعات تقارب سرعة الضوء، فيؤدي الاحتكاك الهائل إلى تسخين القرص لملايين الدرجات وتحويل ما يصل إلى 42% من كتلة المادة إلى إشعاع ساطع.",
    },
  },
  {
    id: "gravitational-time-dilation",
    title: { en: "04. Gravitational Time Dilation & Spaghettification", ar: "04. تمدد الزمن الجاذبي وقوى المد (المعكرونة)" },
    formula: "Δt_∞ = Δt_0 / √(1 - R_s/r)",
    description: {
      en: "According to General Relativity, clocks deeper in a gravitational well tick slower relative to a distant observer. Meanwhile, steep gravity gradients stretch infalling objects vertically and compress them horizontally ('spaghettification').",
      ar: "وفقاً للنسبية العامة، يتباطأ مرور الزمن كلما اقتربنا من أفق الحدث مقارنة براصد بعيد. كما يؤدي التفاوت الشديد في الجاذبية بين طرفي الجسم الساقط إلى تمدده طولياً وانضغاطه عرضياً.",
    },
  },
];

export const BLACK_HOLE_FACTS: LocalizedText[] = [
  {
    en: "Sagittarius A*, the supermassive black hole at the center of our Milky Way, packs 4.15 million solar masses into a region smaller than Mercury's orbit.",
    ar: "يجمع الثقب الأسود (الرامي A*) في مركز مجرتنا درب التبانة كتلة تعادل 4.15 مليون شمس داخل حيز أصغر من مدار كوكب عطارد.",
  },
  {
    en: "If Earth were compressed to become a black hole while keeping its current mass, its Event Horizon radius (Rs) would be just 8.87 millimeters—about the size of a marble.",
    ar: "لو ضُغطت الكرة الأرضية بالكامل لتتحول إلى ثقب أسود مع احتفاظها بكتلتها الحالية، لبلغ نصف قطر أفق الحدث لها 8.87 مليمتر فقط (بحجم حبة زجاجية صغيرة).",
  },
  {
    en: "Paradoxically, supermassive black holes have much weaker tidal forces right at their Event Horizon than stellar-mass black holes, allowing an astronaut to cross the horizon of a 10-billion-solar-mass black hole without immediate spaghettification.",
    ar: "من المفارقات الفيزيائية أن قوى المد عند أفق الحدث للثقوب السوداء الفائقة الكتلة أضعف بكثير منها في الثقوب السوداء النجمية الصغيرة، لأن أفق الحدث فيها يقع على مسافة شاسعة من المركز.",
  },
  {
    en: "In 1974, Stephen Hawking demonstrated that quantum field effects near the Event Horizon cause black holes to emit thermal 'Hawking Radiation', slowly losing mass over cosmological timescales.",
    ar: "في عام 1974، أثبت الفيزيائي ستيفن هوكينغ نظرياً أن التأثيرات الكمومية قرب أفق الحدث تجعل الثقوب السوداء تشع طاقة حرارية خافتة تُعرف بـ (إشعاع هوكينغ).",
  },
];

export const FEATURED_DISCOVERIES: FeaturedDiscovery[] = [
  {
    id: "jwst-exoplanets",
    category: { en: "Atmospheric Spectroscopy", ar: "التحليل الطيفي للأغلفة الجوية" },
    mission: "James Webb Space Telescope (JWST)",
    year: "2023–2026",
    title: {
      en: "Chemical Fingerprints in Deep Exoplanet Atmospheres",
      ar: "البصمات الكيميائية في الأغلفة الجوية للكواكب الخارجية",
    },
    summary: {
      en: "Using transmission spectroscopy, JWST resolved carbon dioxide, water vapor, methane, and photochemically produced sulfur dioxide in exoplanet atmospheres light-years away.",
      ar: "باستخدام التحليل الطيفي العابر، رصد تلسكوب جيمس ويب جزيئات ثاني أكسيد الكربون وبخار الماء والميثان وثاني أكسيد الكبريت في أغلفة كواكب خارج النظام الشمسي.",
    },
    keyMetricLabel: { en: "Spectral Resolution Range", ar: "نطاق الطول الموجي للأشعة تحت الحمراء" },
    keyMetricValue: "0.6 – 28.5 μm",
    deepDive: {
      en: "When an exoplanet transits in front of its host star, a tiny fraction of starlight filters through its atmospheric limb. By measuring which infrared wavelengths are absorbed, astronomers map cloud altitudes and atmospheric chemistry with unprecedented precision.",
      ar: "عندما يعبر كوكب خارجي أمام نجمه المضيف، يمر جزء ضئيل من ضوء النجم عبر غلافه الجوي. ومن خلال تحليل الأطوال الموجية الممتصة في الأشعة تحت الحمراء، يحدد العلماء التركيب الكيميائي بدقة غير مسبوقة.",
    },
    targetSection: "planets",
  },
  {
    id: "eht-sgr-a",
    category: { en: "Relativistic Interferometry", ar: "التداخل الراديوي النسبي" },
    mission: "Event Horizon Telescope (EHT)",
    year: "2022–2025",
    title: {
      en: "Direct Polarized Imaging of Sagittarius A* & M87*",
      ar: "التصوير المباشر والمستقطب للثقبين الأسودين Sgr A* و M87*",
    },
    summary: {
      en: "Linking radio observatories across the globe into an Earth-sized virtual telescope, EHT mapped the twisted magnetic fields spiraling around the event horizons of two supermassive black holes.",
      ar: "عبر ربط المراصد الراديوية حول العالم لتشكيل تلسكوب افتراضي بحجم كوكب الأرض، نجح العلماء في رسم خرائط المجالات المغناطيسية الحلزونية المحيطة بأفق الحدث.",
    },
    keyMetricLabel: { en: "Angular Resolution", ar: "دقة الفصل الزاوي" },
    keyMetricValue: "20 μas (Microarcseconds)",
    deepDive: {
      en: "The shadow diameter of both M87* and Sagittarius A* matched the predictions of Einstein's General Relativity (Kerr metric) within 10%, confirming that spacetime geometry around black holes behaves identically across three orders of magnitude in mass.",
      ar: "تطابق قطر ظل الثقبين الأسودين مع معادلات النسبية العامة لأينشتاين (مترية كير) بهامش دقة مذهل، مما أكد صحة قوانين انحناء الزمكان حول الثقوب السوداء.",
    },
    targetSection: "black-holes",
  },
  {
    id: "europa-clipper",
    category: { en: "Ocean Worlds Exploration", ar: "استكشاف العوالم المحيطية" },
    mission: "Jovian Icy Moons & Ocean Worlds",
    year: "2024–2030",
    title: {
      en: "Subsurface Habitability of Jupiter & Saturn's Icy Moons",
      ar: "المحيطات الجوفية وقابلية الحياة في أقمار المشتري وزحل الجليدية",
    },
    summary: {
      en: "Tidal flexing from giant planets heats the interiors of moons like Europa and Enceladus, maintaining liquid saltwater oceans beneath kilometers of protective surface ice.",
      ar: "تعمل قوى المد الجاذبية للكواكب العملاقة على تسخين باطن أقمار مثل أوروبا وإنسيلادوس، مما يحافظ على محيطات مائية سائلة تحت القشرة الجليدية.",
    },
    keyMetricLabel: { en: "Estimated Europa Ocean Volume", ar: "حجم محيط قمر أوروبا التقديري" },
    keyMetricValue: "~3 × 10⁹ km³ (2× Earth)",
    deepDive: {
      en: "Unlike Earth's surface biosphere powered by sunlight, subsurface ocean worlds rely on tidal dissipation and hydrothermal vents along their rocky seafloors, expanding the traditional stellar 'Habitable Zone' concept.",
      ar: "على عكس البيئات السطحية المعتمدة على ضوء الشمس، تستمد هذه المحيطات الجوفية طاقتها الحرارية والكيميائية من الفوهات الحرارية المائية في قاعها الصخري.",
    },
    targetSection: "solar-system",
  },
];

export const SUGGESTED_AI_QUESTIONS: { category: LocalizedText; question: LocalizedText }[] = [
  {
    category: { en: "Planetary Science", ar: "علوم الكواكب" },
    question: {
      en: "Why is Venus hotter than Mercury even though Mercury is much closer to the Sun?",
      ar: "لماذا يعد كوكب الزهرة أشد حرارة من عطارد رغم أن عطارد أقرب بكثير إلى الشمس؟",
    },
  },
  {
    category: { en: "Relativity & Black Holes", ar: "النسبية والثقوب السوداء" },
    question: {
      en: "How does gravitational time dilation work near a black hole's event horizon?",
      ar: "كيف يعمل تمدد الزمن الجاذبي عند الاقتراب من أفق الحدث لثقب أسود؟",
    },
  },
  {
    category: { en: "Galaxies & Cosmology", ar: "المجرات وعلم الكونيات" },
    question: {
      en: "What will happen to Earth and the Solar System when the Milky Way and Andromeda galaxies collide?",
      ar: "ماذا سيحدث للأرض والنظام الشمسي عندما تندمج مجرة درب التبانة مع مجرة أندروميدا؟",
    },
  },
  {
    category: { en: "Astrobiology", ar: "الأحياء الفلكية" },
    question: {
      en: "Why do scientists consider Jupiter's moon Europa and Saturn's moon Enceladus prime candidates in the search for life?",
      ar: "لماذا يعتبر العلماء قمري (أوروبا) و(إنسيلادوس) من أهم الأماكن الواعدة للبحث عن الحياة في النظام الشمسي؟",
    },
  },
  {
    category: { en: "Stellar Physics", ar: "فيزياء النجوم" },
    question: {
      en: "How will our Sun evolve over the next 5 billion years, and will it ever become a black hole?",
      ar: "كيف ستتطور الشمس خلال الـ 5 مليارات سنة القادمة، وهل يمكن أن تتحول إلى ثقب أسود؟",
    },
  },
  {
    category: { en: "Observational Astronomy", ar: "الرصد الفلكي" },
    question: {
      en: "Why does the James Webb Space Telescope observe in infrared light instead of visible light?",
      ar: "لماذا يرصد تلسكوب جيمس ويب الفضائي الكون بالأشعة تحت الحمراء بدلاً من الضوء المرئي؟",
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ============================================================================
  // BEGINNER LEVEL — 10 Questions (Derived directly from Planet & Galaxy Profiles)
  // ============================================================================
  {
    id: "b1",
    difficulty: "beginner",
    category: { en: "Solar System · Venus", ar: "النظام الشمسي · الزهرة" },
    question: {
      en: "Which planet in our Solar System has the highest average surface temperature (464 °C)?",
      ar: "أي كوكب في نظامنا الشمسي يمتلك أعلى متوسط لدرجة حرارة السطح (464 °م)؟",
    },
    options: [
      { en: "Mercury", ar: "عطارد" },
      { en: "Venus", ar: "الزهرة" },
      { en: "Mars", ar: "المريخ" },
      { en: "Jupiter", ar: "المشتري" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Although Mercury is closer to the Sun, Venus has a dense atmosphere composed of 96.5% carbon dioxide with thick sulfuric acid clouds, creating a runaway greenhouse effect that raises its surface temperature to 464 °C (hot enough to melt lead).",
      ar: "رغم أن عطارد أقرب إلى الشمس، إلا أن كوكب الزهرة يمتلك غلافاً جوياً شديد الكثافة يتكون بنسبة 96.5% من ثاني أكسيد الكربون، مما يسبب احتباساً حرارياً هائلاً يرفع حرارة سطحه إلى 464 °م (ما يكفي لصهر الرصاص).",
    },
  },
  {
    id: "b2",
    difficulty: "beginner",
    category: { en: "Solar System · Uranus", ar: "النظام الشمسي · أورانوس" },
    question: {
      en: "Which cyan ice giant rotates on its side with an extreme axial tilt of 97.77 degrees (nearly 98°)?",
      ar: "أي عملاق جليدي أزرق سماوي يدور حول الشمس على جانبه بزاوية ميل محوري تبلغ 97.77 درجة (نحو 98 درجة)؟",
    },
    options: [
      { en: "Saturn", ar: "زحل" },
      { en: "Neptune", ar: "نبتون" },
      { en: "Uranus", ar: "أورانوس" },
      { en: "Jupiter", ar: "المشتري" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Uranus has an axial tilt of 97.77 degrees, causing it to roll around the Sun on its side so each pole experiences 42 continuous Earth years of sunlight followed by 42 years of darkness.",
      ar: "يميل محور أورانوس بزاوية 97.77 درجة مما يجعله يتدحرج على جانبه حول الشمس، فيشهد كل قطب 42 سنة متواصلة من النهار تليها 42 سنة من الليل.",
    },
  },
  {
    id: "b3",
    difficulty: "beginner",
    category: { en: "Galaxies · Milky Way", ar: "المجرات · درب التبانة" },
    question: {
      en: "What morphological classification describes our home galaxy, the Milky Way (spanning 105,700 light-years)?",
      ar: "ما هو التصنيف الشكلي العلمي لمجرتنا الأم درب التبانة (البالغ قطرها 105,700 سنة ضوئية)؟",
    },
    options: [
      { en: "Supergiant Elliptical Galaxy (E0p)", ar: "مجرة إهليلجية فوق عملاقة (E0p)" },
      { en: "Barred Spiral Galaxy (SBbc)", ar: "مجرة حلزونية ضلعية (SBbc)" },
      { en: "Unbarred Lenticular Galaxy", ar: "مجرة عدسية غير ضلعية" },
      { en: "Magellanic Irregular Galaxy", ar: "مجرة قزمة غير منتظمة" },
    ],
    correctIndex: 1,
    explanation: {
      en: "The Milky Way is a Barred Spiral Galaxy (type SBbc) spanning 105,700 light-years with 100–400 billion stars, a central bar-shaped bulge, and four primary spiral arms.",
      ar: "مجرة درب التبانة هي مجرة حلزونية ضلعية (SBbc) يبلغ قطرها 105,700 سنة ضوئية وتضم 100–400 مليار نجم مع انتفاخ مركزي ضلعي وأربعة أذرع حلزونية.",
    },
  },
  {
    id: "b4",
    difficulty: "beginner",
    category: { en: "Solar System · Mercury", ar: "النظام الشمسي · عطارد" },
    question: {
      en: "Which planet is closest to the Sun (57.9 Million km / 0.39 AU) and completes its orbit in just 88 Earth days?",
      ar: "أي كوكب هو الأقرب إلى الشمس (57.9 مليون كم / 0.39 وحدة فلكية) ويكمل دورته المدارية في 88 يوماً أرضياً فقط؟",
    },
    options: [
      { en: "Mercury", ar: "عطارد" },
      { en: "Venus", ar: "الزهرة" },
      { en: "Mars", ar: "المريخ" },
      { en: "Earth", ar: "الأرض" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Mercury is the first and smallest planet in the Solar System (4,879 km diameter), orbiting at an average distance of 57.9 million km (0.39 AU) with an orbital period of 88 Earth days.",
      ar: "عطارد هو الكوكب الأول والأصغر في النظام الشمسي (بقطر 4,879 كم)، ويدور على مسافة 57.9 مليون كم (0.39 وحدة فلكية) خلال 88 يوماً أرضياً.",
    },
  },
  {
    id: "b5",
    difficulty: "beginner",
    category: { en: "Solar System · Mars", ar: "النظام الشمسي · المريخ" },
    question: {
      en: "Which red iron-oxide planet hosts Olympus Mons (the largest volcano in the Solar System at 21.9 km high) and two moons named Phobos and Deimos?",
      ar: "أي كوكب أحمر غني بأكسيد الحديد يضم بركان جبل أوليمبوس (بارتفاع 21.9 كم) والقمرين فوبوس وديموس؟",
    },
    options: [
      { en: "Venus", ar: "الزهرة" },
      { en: "Mercury", ar: "عطارد" },
      { en: "Mars", ar: "المريخ" },
      { en: "Jupiter", ar: "المشتري" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Mars is the fourth planet from the Sun (1.52 AU). It is home to Olympus Mons (21.9 km high, nearly three times Mount Everest), Valles Marineris (4,000 km long), and two moons: Phobos and Deimos.",
      ar: "المريخ هو الكوكب الرابع عن الشمس (1.52 وحدة فلكية)، ويضم جبل أوليمبوس (أضخم بركان في النظام الشمسي بارتفاع 21.9 كم) وأخدود فاليس مارينيريس والقمرين فوبوس وديموس.",
    },
  },
  {
    id: "b6",
    difficulty: "beginner",
    category: { en: "Solar System · Jupiter", ar: "النظام الشمسي · المشتري" },
    question: {
      en: "Which planet is the largest in the Solar System (139,820 km diameter), has the fastest rotation (9h 55m), and features the Great Red Spot?",
      ar: "أي كوكب هو الأكبر في النظام الشمسي (بقطر 139,820 كم)، والأسرع دوراناً حول نفسه (9 ساعات و55 دقيقة)، ويضم البقعة الحمراء العظيمة؟",
    },
    options: [
      { en: "Saturn", ar: "زحل" },
      { en: "Jupiter", ar: "المشتري" },
      { en: "Neptune", ar: "نبتون" },
      { en: "Uranus", ar: "أورانوس" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Jupiter is the fifth planet and largest gas giant (139,820 km diameter, 95 moons), rotating in 9h 55m with 2.5 times the combined mass of all other planets and a 300-year-old anticyclone called the Great Red Spot.",
      ar: "المشتري هو خامس الكواكب وأكبر عملاق غازي (بقطر 139,820 كم و95 قمراً)، ويدور حول نفسه في 9 ساعات و55 دقيقة، ويضم إعصار البقعة الحمراء العظيمة المستمر منذ أكثر من 300 عام.",
    },
  },
  {
    id: "b7",
    difficulty: "beginner",
    category: { en: "Solar System · Saturn", ar: "النظام الشمسي · زحل" },
    question: {
      en: "Which gas giant has a mean density of 0.687 g/cm³ (less dense than liquid water) and a 282,000-km ring system made of 99% pure water ice?",
      ar: "أي عملاق غازي تبلغ كثافته المتوسطة 0.687 غ/سم³ (أقل من كثافة الماء السائل) ويتوج بنظام حلقات يمتد لـ 282,000 كم من جليد الماء النقي بنسبة 99%؟",
    },
    options: [
      { en: "Uranus", ar: "أورانوس" },
      { en: "Jupiter", ar: "المشتري" },
      { en: "Saturn", ar: "زحل" },
      { en: "Neptune", ar: "نبتون" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Saturn (the 6th planet, with 146 moons) has a mean density of 0.687 g/cm³—less than liquid water—and a spectacular ring system spanning 282,000 km across yet averaging only 10 to 30 meters in vertical thickness.",
      ar: "يمتلك كوكب زحل (سادس الكواكب وله 146 قمراً) كثافة متوسطة تبلغ 0.687 غ/سم³ (أقل من الماء السائل)، ونظام حلقات يمتد لمسافة 282,000 كم بسمك عمودي لا يتجاوز 10 إلى 30 متراً.",
    },
  },
  {
    id: "b8",
    difficulty: "beginner",
    category: { en: "Solar System · Earth", ar: "النظام الشمسي · الأرض" },
    question: {
      en: "What percentage of Earth's surface is covered by interconnected saline oceans, and what are the two main gases in its atmosphere?",
      ar: "ما النسبة التي تغطيها المحيطات المالحة من سطح الأرض، وما هما الغازان الرئيسيان في غلافها الجوي؟",
    },
    options: [
      { en: "71% oceans; 78.08% Nitrogen (N₂) and 20.95% Oxygen (O₂)", ar: "71% محيطات؛ 78.08% نيتروجين (N₂) و20.95% أكسجين (O₂)" },
      { en: "50% oceans; 96.5% Carbon Dioxide and 3.5% Nitrogen", ar: "50% محيطات؛ 96.5% ثاني أكسيد الكربون و3.5% نيتروجين" },
      { en: "85% oceans; 89.8% Hydrogen and 10.2% Helium", ar: "85% محيطات؛ 89.8% هيدروجين و10.2% هيليوم" },
      { en: "29% oceans; 42% Oxygen and 29% Sodium", ar: "29% محيطات؛ 42% أكسجين و29% صوديوم" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Approximately 71% of Earth's surface is submerged beneath interconnected saline oceans (averaging 3.7 km deep), and its atmosphere consists of 78.08% Nitrogen, 20.95% Oxygen, and 0.97% Argon & trace gases.",
      ar: "تغطي المحيطات المالحة المترابطة نحو 71% من سطح الأرض بمتوسط عمق 3.7 كم، ويتكون غلافها الجوي من 78.08% نيتروجين و20.95% أكسجين و0.97% أرغون وغازات ضئيلة.",
    },
  },
  {
    id: "b9",
    difficulty: "beginner",
    category: { en: "Solar System · Neptune", ar: "النظام الشمسي · نبتون" },
    question: {
      en: "Which planet is the farthest from the Sun (4.50 Billion km / 30.07 AU) and sustains the fastest supersonic winds in the Solar System (over 2,100 km/h)?",
      ar: "أي كوكب هو الأبعد عن الشمس (4.50 مليار كم / 30.07 وحدة فلكية) وتهب فيه أسرع رياح فائقة للصوت في النظام الشمسي (أكثر من 2,100 كم/ساعة)؟",
    },
    options: [
      { en: "Uranus", ar: "أورانوس" },
      { en: "Saturn", ar: "زحل" },
      { en: "Neptune", ar: "نبتون" },
      { en: "Mars", ar: "المريخ" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Neptune is the 8th and most distant major planet at 4.50 billion km (30.07 AU), taking 164.8 Earth years to orbit the Sun and sustaining supersonic winds exceeding 2,100 km/h.",
      ar: "نبتون هو الكوكب الثامن والأبعد عن الشمس على مسافة 4.50 مليار كم (30.07 وحدة فلكية)، ويستغرق 164.8 سنة أرضية لإتمام مداره وتهب فيه أسرع رياح في النظام الشمسي بسرعة تتجاوز 2,100 كم/ساعة.",
    },
  },
  {
    id: "b10",
    difficulty: "beginner",
    category: { en: "Galaxies · Andromeda", ar: "المجرات · أندروميدا" },
    question: {
      en: "Which spiral galaxy (Messier 31, located 2.537 million light-years away with ~1 trillion stars) is the largest galaxy in our Local Group?",
      ar: "أي مجرة حلزونية (مسييه 31، على بُعد 2.537 مليون سنة ضوئية وتضم نحو تريليون نجم) تعد أكبر مجرات مجموعتنا المحلية؟",
    },
    options: [
      { en: "Sombrero Galaxy (M104)", ar: "مجرة سومبريرو (M104)" },
      { en: "Andromeda Galaxy (M31)", ar: "مجرة المرأة المسلسلة — أندروميدا (M31)" },
      { en: "Whirlpool Galaxy (M51a)", ar: "مجرة الدوامة (M51a)" },
      { en: "Large Magellanic Cloud (LMC)", ar: "سحابة ماجلان الكبرى (LMC)" },
    ],
    correctIndex: 1,
    explanation: {
      en: "The Andromeda Galaxy (Messier 31 / NGC 224) spans 152,000 light-years at a distance of 2.537 million light-years, containing ~1 trillion stars—roughly double the stellar population of the Milky Way.",
      ar: "تمتد مجرة أندروميدا (مسييه 31) بقطر 152,000 سنة ضوئية على بُعد 2.537 مليون سنة ضوئية، وتضم نحو تريليون نجم وهي أكبر مجرات المجموعة المحلية وأبعد جرم يُرى بالعين المجردة.",
    },
  },

  // ============================================================================
  // INTERMEDIATE LEVEL — 10 Questions (Derived from Moons, Atmospheres & Galaxies)
  // ============================================================================
  {
    id: "i1",
    difficulty: "intermediate",
    category: { en: "Planetary Moons · Saturn", ar: "أقمار الكواكب · زحل" },
    question: {
      en: "Which moon in the Solar System is the only one with a thick nitrogen atmosphere and liquid lakes and rivers of methane and ethane on its surface?",
      ar: "أي قمر في النظام الشمسي هو الوحيد الذي يمتلك غلافاً جوياً كثيفاً وبحيرات وأنهاراً سائلة من الميثان والإيثان على سطحه؟",
    },
    options: [
      { en: "Io (Jupiter)", ar: "آيو (المشتري)" },
      { en: "Titan (Saturn)", ar: "تيتان (زحل)" },
      { en: "Phobos (Mars)", ar: "فوبوس (المريخ)" },
      { en: "Miranda (Uranus)", ar: "ميراندا (أورانوس)" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Saturn's largest moon, Titan, is the only moon in the Solar System with a thick nitrogen-rich atmosphere and liquid hydrocarbon lakes and rivers of methane and ethane on its surface.",
      ar: "يعد قمر (تيتان) التابع لكوكب زحل القمر الوحيد في النظام الشمسي الذي يمتلك غلافاً جوياً كثيفاً وبحيرات وأنهاراً سائلة من الميثان والإيثان على سطحه.",
    },
  },
  {
    id: "i2",
    difficulty: "intermediate",
    category: { en: "Celestial Mechanics · Neptune", ar: "الميكانيكا السماوية · نبتون" },
    question: {
      en: "Which planet was discovered in 1846 through mathematical predictions (by Urbain Le Verrier and John Couch Adams) before being observed through a telescope, and completed its first full orbit since discovery in 2011?",
      ar: "أي كوكب اكتُشف عام 1846 عبر الحسابات الرياضية لقوانين الجاذبية قبل رصده بالتلسكوب، وأتم أول دورة مدارية كاملة له منذ اكتشافه في عام 2011؟",
    },
    options: [
      { en: "Uranus", ar: "أورانوس" },
      { en: "Saturn", ar: "زحل" },
      { en: "Neptune", ar: "نبتون" },
      { en: "Mercury", ar: "عطارد" },
    ],
    correctIndex: 2,
    explanation: {
      en: "Neptune was discovered in 1846 through mathematical predictions of gravitational perturbations by Urbain Le Verrier and John Couch Adams, and completed its first full 164.8-year orbit since discovery in 2011.",
      ar: "نبتون هو أول كوكب يُكتشف عبر الحسابات الرياضية (عام 1846 على يد لوفيرييه وآدامز)، وفي عام 2011 أتم أول دورة مدارية كاملة له حول الشمس (مدتها 164.8 سنة) منذ لحظة اكتشافه.",
    },
  },
  {
    id: "i3",
    difficulty: "intermediate",
    category: { en: "Galilean Moons · Jupiter", ar: "الأقمار الغاليليّة · المشتري" },
    question: {
      en: "Which of Jupiter's moons is larger than the planet Mercury and is the only moon in the Solar System known to generate its own internal magnetic field?",
      ar: "أي من أقمار كوكب المشتري يعد أكبر حجماً من كوكب عطارد وهو القمر الوحيد في النظام الشمسي الذي يولد مجالاً مغناطيسياً خاصاً به؟",
    },
    options: [
      { en: "Ganymede", ar: "غانيميد" },
      { en: "Callisto", ar: "كاليستو" },
      { en: "Io", ar: "آيو" },
      { en: "Deimos", ar: "ديموس" },
    ],
    correctIndex: 0,
    explanation: {
      en: "Ganymede, Jupiter's largest moon, is larger than the planet Mercury and is the only moon in the Solar System known to generate its own internal magnetosphere.",
      ar: "يعد قمر (غانيميد)، أكبر أقمار المشتري، أكبر حجماً من كوكب عطارد، وهو القمر الوحيد في النظام الشمسي الذي يمتلك غلافاً مغناطيسياً داخلياً خاصاً به.",
    },
  },
  {
    id: "i4",
    difficulty: "intermediate",
    category: { en: "Ocean Worlds · Europa & Enceladus", ar: "العوالم المحيطية · أوروبا وإنسيلادوس" },
    question: {
      en: "How much liquid saltwater is estimated to exist beneath the icy crust of Jupiter's moon Europa, and what feeds Saturn's E ring from the moon Enceladus?",
      ar: "كم تبلغ كمية المياه المالحة السائلة تحت قشرة قمر المشتري (أوروبا)، وما الظاهرة التي تغذي الحلقة E لكوكب زحل من قمره (إنسيلادوس)؟",
    },
    options: [
      {
        en: "Europa has dry lava plains; Enceladus captures solar wind hydrogen to build Saturn's rings",
        ar: "سطح أوروبا سهول بركانية جافة؛ ويلتقط إنسيلادوس غاز الهيدروجين من الرياح الشمسية",
      },
      {
        en: "Europa holds ~2× the water volume of Earth's oceans (~3 × 10⁹ km³); Enceladus vents south-polar cryovolcanic water-vapor geysers into Saturn's E ring",
        ar: "يضم محيط أوروبا ضعف مياه محيطات الأرض (~3 × 10⁹ كم³)؛ وتطلق ينابيع القطب الجنوبي الجليدية في إنسيلادوس بخار الماء والجزيئات العضوية لتغذي الحلقة E لزحل",
      },
      {
        en: "Europa holds 1% of Earth's water; Enceladus is a captured metallic asteroid",
        ar: "يحتوي أوروبا على 1% فقط من مياه الأرض؛ وإنسيلادوس كويكب معدني ملتقط",
      },
      {
        en: "Both moons are solid iron cores with no water ice",
        ar: "كلا القمرين يتكونان من الحديد المصمت دون أي جليد مائي",
      },
    ],
    correctIndex: 1,
    explanation: {
      en: "Jupiter's moon Europa harbors a global subsurface saltwater ocean with roughly twice the liquid water volume of all Earth's oceans (~3 × 10⁹ km³), while cryovolcanic geysers at the south pole of Saturn's moon Enceladus vent water vapor and organic molecules into space, feeding Saturn's E ring.",
      ar: "يحتوي قمر المشتري (أوروبا) على محيط مائي جوفي يضم ضعف كمية المياه في محيطات الأرض (~3 × 10⁹ كم³)، بينما تطلق الينابيع الجليدية الحارة في القطب الجنوبي لقمر (إنسيلادوس) أعمدة من بخار الماء والجزيئات العضوية مغذيةً الحلقة E لكوكب زحل.",
    },
  },
  {
    id: "i5",
    difficulty: "intermediate",
    category: { en: "Thermal Extremes · Mercury", ar: "التقلبات الحرارية · عطارد" },
    question: {
      en: "What is Mercury's day-to-night surface temperature swing, and where does permanent water ice survive on the planet?",
      ar: "ما مدى التفاوت الحراري بين النهار والليل على سطح عطارد، وأين يتواجد الجليد المائي الدائم عليه؟",
    },
    options: [
      {
        en: "A constant 167 °C everywhere; water ice floats in equatorial clouds",
        ar: "درجة حرارة ثابتة 167 °م في كل مكان؛ ويطفو الجليد في سحب استوائية",
      },
      {
        en: "From +100 °C to 0 °C; liquid water rivers flow across its equator",
        ar: "من +100 °م إلى 0 °م؛ وتجري أنهار مائية سائلة عند خط استوائه",
      },
      {
        en: "From +430 °C during the day to -180 °C at night; permanent water ice exists inside permanently shadowed craters at its north and south poles",
        ar: "من +430 °م نهاراً إلى -180 °م ليلاً؛ ويوجد جليد مائي دائم في أعماق الفوهات المظللة دائماً عند قطبيه الشمالي والجنوبي",
      },
      {
        en: "From +900 °C to +500 °C; no ice can exist anywhere on Mercury",
        ar: "من +900 °م إلى +500 °م؛ ولا يوجد أي جليد على عطارد إطلاقاً",
      },
    ],
    correctIndex: 2,
    explanation: {
      en: "Because of its 3:2 spin-orbit resonance and lack of a heat-retaining atmosphere, Mercury swings from 430 °C by day to -180 °C at night, while permanent water ice survives deep inside permanently shadowed polar craters.",
      ar: "بسبب رنينه المداري 3:2 وافتقاره لغلاف جوي يحبس الحرارة، تتراوح حرارة سطح عطارد بين +430 °م نهاراً و-180 °م ليلاً، بينما يبقى الجليد المائي الدائم في أعماق الفوهات المظللة دائماً عند قطبيه.",
    },
  },
  {
    id: "i6",
    difficulty: "intermediate",
    category: { en: "Atmospheric Physics · Venus", ar: "فيزياء الغلاف الجوي · الزهرة" },
    question: {
      en: "How high is the surface atmospheric pressure on Venus, and how does its retrograde sidereal rotation (243 Earth days) compare to its orbital year (225 Earth days)?",
      ar: "كم يبلغ الضغط الجوي على سطح الزهرة، وكيف تقارن مدة دورانه التراجعي حول نفسه (243 يوماً أرضياً) بمدة سنته المدارية (225 يوماً أرضياً)؟",
    },
    options: [
      {
        en: "1 bar (identical to Earth), and it rotates in 24 hours",
        ar: "1 ضغط جوي (مطابق للأرض)، ويدور حول نفسه في 24 ساعة",
      },
      {
        en: "10 bar, and its year is 10 times longer than its day",
        ar: "10 ضغط جوي، وسنته أطول بعشر مرات من يومه",
      },
      {
        en: "0.01 bar, with no clouds or volcanic features",
        ar: "0.01 ضغط جوي، بلا سحب أو معالم بركانية",
      },
      {
        en: "92 bar (equal to 900 meters underwater on Earth), and its sidereal day (243 Earth days) is longer than its year (225 Earth days)",
        ar: "92 ضغطاً جوياً (يعادل عمق 900 متر تحت سطح المحيط على الأرض)، ويومه النجمي (243 يوماً أرضياً) أطول من سنته المدارية (225 يوماً أرضياً)",
      },
    ],
    correctIndex: 3,
    explanation: {
      en: "Surface atmospheric pressure on Venus is 92 bar (equivalent to 900 meters underwater on Earth), and because it rotates backward (retrograde) in 243 Earth days while orbiting the Sun in 225 Earth days, its sidereal day is longer than its year.",
      ar: "يبلغ الضغط الجوي على سطح الزهرة 92 بار (ما يعادل عمق 900 متر تحت الماء على الأرض)، ولأنه يدور حول نفسه تراجعياً في 243 يوماً أرضياً بينما يتم مداره حول الشمس في 225 يوماً أرضياً، فإن يومه أطول من سنته.",
    },
  },
  {
    id: "i7",
    difficulty: "intermediate",
    category: { en: "Galactic Center · Milky Way", ar: "المركز المجري · درب التبانة" },
    question: {
      en: "What is the name and mass of the supermassive black hole at the center of our Milky Way (~27,000 light-years from the Solar System), and how long is one 'Galactic Year'?",
      ar: "ما اسم وكتلة الثقب الأسود الفائق في مركز مجرتنا درب التبانة (على بُعد ~27,000 سنة ضوئية من النظام الشمسي)، وكم تستغرق السنة المجرية الواحدة؟",
    },
    options: [
      {
        en: "M87* (6.5 billion solar masses); taking 10,000 years per orbit",
        ar: "الثقب M87* (6.5 مليار كتلة شمسية)؛ ويستغرق 10,000 سنة لكل دورة",
      },
      {
        en: "Sagittarius A* (4.15 million solar masses); the Solar System orbits at ~230 km/s, taking 225–250 million years per Galactic Year",
        ar: "الرامي A* (Sagittarius A* بكتلة 4.15 مليون كتلة شمسية)؛ ويدور النظام الشمسي بسرعة ~230 كم/ث مستغرقاً 225–250 مليون سنة لكل دورة مجرية",
      },
      {
        en: "Cygnus X-1 (15 solar masses); taking 1 billion years per orbit",
        ar: "الدجاجة X-1 (15 كتلة شمسية)؛ ويستغرق مليار سنة لكل دورة",
      },
      {
        en: "R136a1 (200 solar masses); the Solar System does not orbit the Milky Way",
        ar: "النجم R136a1 (200 كتلة شمسية)؛ والنظام الشمسي ثابت لا يدور حول المجرة",
      },
    ],
    correctIndex: 1,
    explanation: {
      en: "Our Solar System resides in the Orion-Cygnus Spur ~27,000 light-years from Sagittarius A* (4.15 million solar masses) and orbits the Milky Way at ~230 km/s, completing one Galactic Year every 225–250 million years.",
      ar: "يقع نظامنا الشمسي في ذراع الجبار الفرعي على بُعد 27,000 سنة ضوئية من الثقب الأسود الفائق (الرامي A* بكتلة 4.15 مليون شمس)، ويدور بسرعة 230 كم/ث ليكمل دورة مجرية واحدة كل 225 إلى 250 مليون سنة.",
    },
  },
  {
    id: "i8",
    difficulty: "intermediate",
    category: { en: "Galaxies · Whirlpool Galaxy", ar: "المجرات · مجرة الدوامة" },
    question: {
      en: "Which face-on spiral galaxy (Messier 51a, 31 million light-years away in Canes Venatici) was the very first celestial object in history where spiral structure was recognized (by Lord Rosse in 1845)?",
      ar: "أي مجرة حلزونية مواجهة للأرض (مسييه 51a على بُعد 31 مليون سنة ضوئية في كوكبة السلوقيان) كانت أول جرم في التاريخ تُكتشف بنيته الحلزونية (على يد اللورد روس عام 1845)؟",
    },
    options: [
      { en: "Sombrero Galaxy (Messier 104)", ar: "مجرة سومبريرو (M104)" },
      { en: "Virgo A (Messier 87)", ar: "مجرة العذراء A (M87)" },
      { en: "Whirlpool Galaxy (Messier 51a / NGC 5194)", ar: "مجرة الدوامة (Whirlpool Galaxy — M51a)" },
      { en: "Large Magellanic Cloud (LMC)", ar: "سحابة ماجلان الكبرى (LMC)" },
    ],
    correctIndex: 2,
    explanation: {
      en: "The Whirlpool Galaxy (Messier 51a / NGC 5194) interacts tidally with companion galaxy NGC 5195 and was the first celestial object in history where spiral structure was recognized by Lord Rosse in 1845.",
      ar: "تتفاعل مجرة الدوامة (M51a / NGC 5194) جاذبياً مع المجرة المرافقة NGC 5195، وتعد أول جرم سماوي في تاريخ علم الفلك تُكتشف بنيته الحلزونية على يد اللورد روس عام 1845.",
    },
  },
  {
    id: "i9",
    difficulty: "intermediate",
    category: { en: "Galaxies · Large Magellanic Cloud", ar: "المجرات · سحابة ماجلان الكبرى" },
    question: {
      en: "Which satellite galaxy orbiting the Milky Way (163,000 light-years away) contains the Tarantula Nebula (with massive star R136a1) and hosted Supernova 1987A?",
      ar: "أي مجرة تابعة تدور حول درب التبانة (على بُعد 163,000 سنة ضوئية) تضم سديم الرتيلاء (والنجم العملاق R136a1) وشهدت انفجار المستعر الأعظم 1987A؟",
    },
    options: [
      { en: "Andromeda Galaxy (M31)", ar: "مجرة أندروميدا (M31)" },
      { en: "Sombrero Galaxy (M104)", ar: "مجرة سومبريرو (M104)" },
      { en: "Virgo A (Messier 87)", ar: "مجرة مسييه 87 (M87)" },
      { en: "Large Magellanic Cloud (LMC)", ar: "سحابة ماجلان الكبرى (LMC)" },
    ],
    correctIndex: 3,
    explanation: {
      en: "The Large Magellanic Cloud (LMC, 163,000 light-years away) contains the Tarantula Nebula (harboring the ~200-solar-mass star R136a1) and hosted Supernova 1987A, whose neutrino burst was detected on Earth hours before its optical light arrived.",
      ar: "تقع سحابة ماجلان الكبرى (LMC) على بُعد 163,000 سنة ضوئية، وتضم سديم الرتيلاء (الذي يحتضن النجم العملاق R136a1 بكتلة ~200 شمس) كما شهدت انفجار المستعر الأعظم 1987A.",
    },
  },
  {
    id: "i10",
    difficulty: "intermediate",
    category: { en: "Planetary Moons · Mars & Neptune", ar: "أقمار الكواكب · المريخ ونبتون" },
    question: {
      en: "What fate awaits Mars's inner moon Phobos (orbiting 6,000 km above Mars) in ~50 million years, and what indicates that Neptune's moon Triton is a captured Kuiper Belt object?",
      ar: "ما المصير الذي ينتظر قمر المريخ الداخلي (فوبوس، على ارتفاع 6,000 كم) خلال ~50 مليون سنة، وما الدليل على أن قمر نبتون الأكبر (ترايتون) جرم ملتقط من حزام كايبر؟",
    },
    options: [
      {
        en: "Phobos will escape into the asteroid belt; Triton is made of molten iron",
        ar: "سيفلت فوبوس نحو حزام الكويكبات؛ ويتكون ترايتون من الحديد المنصهر",
      },
      {
        en: "Tidal forces will tear Phobos apart into a planetary ring around Mars; Triton orbits Neptune in a retrograde direction with active nitrogen ice geysers",
        ar: "ستفكك قوى المد القمر فوبوس ليشكل حلقة حول المريخ؛ ويدور ترايتون في مدار تراجعي معاكس لدوران نبتون مع ينابيع نشطة من النيتروجين المتجمد",
      },
      {
        en: "Phobos will ignite into a miniature star; Triton has no geological activity",
        ar: "سيتحول فوبوس إلى نجم صغير؛ ولا يمتلك ترايتون أي نشاط جيولوجي",
      },
      {
        en: "Both moons will collide with Earth's Moon",
        ar: "سيصطدم القمران بقمر الأرض",
      },
    ],
    correctIndex: 1,
    explanation: {
      en: "Phobos orbits so close to Mars (6,000 km) that tidal deceleration will tear it apart into a planetary ring in ~50 million years. Meanwhile, Neptune's largest moon Triton orbits in a retrograde direction and features active nitrogen ice geysers, indicating it was captured from the Kuiper Belt.",
      ar: "يدور فوبوس على ارتفاع 6,000 كم فقط من سطح المريخ بحيث ستفككه قوى المد الجاذبية إلى حلقة كوكبية خلال نحو 50 مليون سنة، بينما يدور قمر نبتون (ترايتون) في مدار تراجعي ويضم ينابيع نيتروجين متجمد مما يدل على التقاطه من حزام كايبر.",
    },
  },

  // ============================================================================
  // ADVANCED LEVEL — 10 Questions (Relativistic Physics, EHT, JWST & Deep Space)
  // ============================================================================
  {
    id: "a1",
    difficulty: "advanced",
    category: { en: "Relativistic Physics · Schwarzschild Metric", ar: "الفيزياء النسبية · معادلة شفارتزشيلد" },
    question: {
      en: "According to the Schwarzschild radius equation (Rs = 2GM/c², approx. 2.953 km per solar mass), if you triple the mass (M) of a non-rotating black hole, how does its Event Horizon radius (Rs) change?",
      ar: "وفقاً لمعادلة نصف قطر شفارتزشيلد (Rs = 2GM/c²، نحو 2.953 كم لكل كتلة شمسية)، إذا تضاعفت كتلة ثقب أسود غير دوار ثلاث مرات (3M)، فكيف يتغير نصف قطر أفق الحدث (Rs)؟",
    },
    options: [
      { en: "It increases by a factor of 3 (linearly proportional to mass)", ar: "يزداد بمقدار 3 أضعاف (تناسب طردي خطي مع الكتلة)" },
      { en: "It increases by a factor of 9 (proportional to mass squared)", ar: "يزداد بمقدار 9 أضعاف (يتناسب مع مربع الكتلة)" },
      { en: "It increases by the cube root of 3", ar: "يزداد بمقدار الجذر التكعيبي للعدد 3" },
      { en: "It decreases by a factor of 3 due to stronger gravity", ar: "ينكمش إلى الثلث بسبب ازدياد قوة الجاذبية" },
    ],
    correctIndex: 0,
    explanation: {
      en: "In the Schwarzschild equation Rs = 2GM/c², G and c are universal constants, so the Event Horizon radius scales strictly linearly with mass M (~2.953 km per solar mass). Tripling the mass triples the Schwarzschild radius.",
      ar: "في معادلة شفارتزشيلد Rs = 2GM/c²، يتناسب نصف قطر أفق الحدث طردياً وخطياً مع الكتلة M (نحو 2.953 كم لكل كتلة شمسية)، وبالتالي فإن مضاعفة الكتلة 3 مرات تضاعف نصف قطر أفق الحدث 3 مرات.",
    },
  },
  {
    id: "a2",
    difficulty: "advanced",
    category: { en: "Extragalactic Astrophysics · Andromeda", ar: "فيزياء المجرات · أندروميدا" },
    question: {
      en: "Why does the Andromeda Galaxy (M31) exhibit a spectroscopic blueshift rather than cosmological redshift, and what will happen in ~4.5 billion years?",
      ar: "لماذا يظهر طيف مجرة أندروميدا (M31) انزياحاً نحو الأزرق (Blueshift) بدلاً من الانزياح الكوني نحو الأحمر، وماذا سيحدث خلال ~4.5 مليار سنة؟",
    },
    options: [
      {
        en: "Cosmic expansion reverses across the entire universe every 4.5 billion years",
        ar: "لأن توسع الكون ينعكس في الفضاء بأكمله كل 4.5 مليار سنة",
      },
      {
        en: "Mutual gravity between the Milky Way and Andromeda overcomes local cosmic expansion, pulling them together at ~110 km/s to merge into a giant elliptical galaxy ('Milkomeda')",
        ar: "لأن التجاذب الجاذبي المتبادل بين درب التبانة وأندروميدا يتغلب محلياً على التوسع الكوني فيجذبهما بسرعة ~110 كم/ث ليندمجا في مجرة إهليلجية عملاقة",
      },
      {
        en: "Andromeda is receding at 110 km/s, which shifts light toward the blue spectrum",
        ar: "لأن أندروميدا تبتعد عنا بسرعة 110 كم/ث مما يزيح الضوء نحو الأزرق",
      },
      {
        en: "Intergalactic dust absorbs all red photons from Andromeda",
        ar: "لأن الغبار بين المجري يمتص جميع الفوتونات الحمراء القادمة من أندروميدا",
      },
    ],
    correctIndex: 1,
    explanation: {
      en: "Within the gravitationally bound Local Group, mutual attraction between the Milky Way and Andromeda pulls them together at ~110 km/s (blueshifted); in ~4.5 billion years they will merge to form a giant elliptical galaxy ('Milkomeda').",
      ar: "ضمن المجموعة المحلية المرتبطة جاذبياً، تتفوق الجاذبية المتبادلة بين درب التبانة وأندروميدا على التوسع الكوني فتقتربان بسرعة ~110 كم/ث؛ وخلال نحو 4.5 مليار سنة ستندمج المجرتان لتشكلا مجرة إهليلجية عملاقة.",
    },
  },
  {
    id: "a3",
    difficulty: "advanced",
    category: { en: "Relativistic Interferometry · Messier 87", ar: "التداخل الراديوي النسبي · مسييه 87" },
    question: {
      en: "In April 2019, the Event Horizon Telescope (EHT, with 20 μas resolution) captured history's first direct black hole shadow image in galaxy Messier 87. What is M87*'s mass, M87's globular cluster count, and its relativistic jet length?",
      ar: "في أبريل 2019، التقط تلسكوب أفق الحدث (EHT بدقة 20 ميكروثانية قوسية) أول صورة مباشرة لظل ثقب أسود في مجرة مسييه 87 (M87). كم تبلغ كتلة الثقب M87*، وعدد العناقيد الكروية في المجرة، وطول تدفقها البلازمي النسبي؟",
    },
    options: [
      {
        en: "4.15 million solar masses; 200 globular clusters; and a 10-light-year jet",
        ar: "4.15 مليون كتلة شمسية؛ و200 عنقود كروي؛ وتدفق بطول 10 سنوات ضوئية",
      },
      {
        en: "100 million solar masses; 2,000 globular clusters; and no relativistic jet",
        ar: "100 مليون كتلة شمسية؛ و2,000 عنقود كروي؛ وبدون أي تدفق بلازمي",
      },
      {
        en: "6.5 billion solar masses; over 12,000 globular clusters; and a 5,000-light-year relativistic plasma jet",
        ar: "6.5 مليار كتلة شمسية؛ وأكثر من 12,000 عنقود نجمي كروي؛ وتدفق بلازمي نسبي يمتد لـ 5,000 سنة ضوئية",
      },
      {
        en: "10 solar masses; 1,000 globular clusters; and a 100,000-light-year jet",
        ar: "10 كتل شمسية؛ و1,000 عنقود كروي؛ وتدفق بطول 100,000 سنة ضوئية",
      },
    ],
    correctIndex: 2,
    explanation: {
      en: "Messier 87 (Virgo A, 53.5 million light-years away) hosts a 6.5-billion-solar-mass central black hole (M87*) imaged by EHT in April 2019, possesses over 12,000 globular clusters, and launches a 5,000-light-year synchrotron relativistic plasma jet.",
      ar: "تحتضن مجرة مسييه 87 (على بُعد 53.5 مليون سنة ضوئية) الثقب الأسود المركزي (M87*) البالغة كتلته 6.5 مليار شمس والذي صوّره تلسكوب أفق الحدث في أبريل 2019، وتمتلك أكثر من 12,000 عنقود نجمي كروي وتدفقاً بلازمياً نسبياً بطول 5,000 سنة ضوئية.",
    },
  },
  {
    id: "a4",
    difficulty: "advanced",
    category: { en: "Black Hole Anatomy · Photon Sphere", ar: "تشريح الثقب الأسود · كرة الفوتونات" },
    question: {
      en: "At what exact radius (R_p) around a non-rotating black hole does the Photon Sphere occur, where spacetime curvature forces photons into unstable circular orbits?",
      ar: "على أي مسافة دقيقة (R_p) حول ثقب أسود غير دوار تقع (كرة الفوتونات)، حيث يجبر انحناء الزمكان الفوتونات على الدوران في مدارات دائرية غير مستقرة؟",
    },
    options: [
      { en: "R_p = 0.5 R_s (half the Schwarzschild radius)", ar: "R_p = 0.5 R_s (نصف قطر شفارتزشيلد)" },
      { en: "R_p = 10.0 R_s (ten times the Schwarzschild radius)", ar: "R_p = 10.0 R_s (عشرة أضعاف نصف قطر شفارتزشيلد)" },
      { en: "R_p = 100 R_s", ar: "R_p = 100 R_s" },
      { en: "R_p = 1.5 R_s (1.5 times the Schwarzschild radius)", ar: "R_p = 1.5 R_s (1.5 مرة من نصف قطر شفارتزشيلد)" },
    ],
    correctIndex: 3,
    explanation: {
      en: "At 1.5 times the Schwarzschild radius (R_p = 1.5 R_s for a non-spinning black hole), gravity bends spacetime so strongly that photons are forced to travel in unstable circular orbits, producing a bright lensed photon ring.",
      ar: "على مسافة تعادل 1.5 مرة من نصف قطر شفارتزشيلد (R_p = 1.5 R_s للثقب الأسود غير الدوار)، تنحني مسارات الضوء بشدة تجعل الفوتونات تدور في مدارات دائرية غير مستقرة مشكلةً حلقة ضوئية ساطعة.",
    },
  },
  {
    id: "a5",
    difficulty: "advanced",
    category: { en: "Black Hole Anatomy · Accretion Disk", ar: "تشريح الثقب الأسود · قرص التزود النسبي" },
    question: {
      en: "What fraction (η) of infalling matter's rest-mass energy (mc²) can a relativistic black hole accretion disk convert into X-rays and optical radiation through viscous friction?",
      ar: "ما نسبة الطاقة (η) من كتلة المادة الساقطة (mc²) التي يحولها قرص التزود (الالتحام) النسبي حول الثقب الأسود إلى أشعة سينية وإشعاع ضوئي بفعل الاحتكاك اللزج؟",
    },
    options: [
      { en: "η ≈ 0.001% mc²", ar: "η ≈ 0.001% mc²" },
      { en: "η ≈ 6% – 42% mc² (far more efficient than stellar nuclear fusion)", ar: "η ≈ 6% – 42% mc² (أعلى كفاءة بكثير من الاندماج النووي النجمي)" },
      { en: "η = 100% mc² (complete matter-antimatter annihilation)", ar: "η = 100% mc² (فناء كامل للمادة)" },
      { en: "Accretion disks absorb heat and emit zero radiation", ar: "يمتص قرص التزود الحرارة ولا يطلق أي إشعاع" },
    ],
    correctIndex: 1,
    explanation: {
      en: "Infalling gas and plasma spiral inward at relativistic speeds; viscous friction heats the inner accretion disk to millions of Kelvin, converting 6% to 42% of rest-mass energy (mc²) into radiation—far more efficient than stellar fusion.",
      ar: "يدور الغاز والبلازما الساقطة نحو الثقب الأسود بسرعات نسبية عالية، فيؤدي الاحتكاك الهائل إلى تسخين القرص لملايين الدرجات وتحويل 6% إلى 42% من كتلة المادة (mc²) إلى إشعاع ساطع.",
    },
  },
  {
    id: "a6",
    difficulty: "advanced",
    category: { en: "Black Hole Astrophysics · Earth & Hawking", ar: "فيزياء الثقوب السوداء · الأرض وإشعاع هوكينغ" },
    question: {
      en: "If Earth were compressed to become a black hole while keeping its current mass, what would its Event Horizon radius (Rs) be, and what quantum effect did Stephen Hawking demonstrate in 1974?",
      ar: "لو ضُغطت الكرة الأرضية بالكامل لتتحول إلى ثقب أسود مع احتفاظها بكتلتها الحالية، فكم سيبلغ نصف قطر أفق الحدث (Rs) لها، وما الظاهرة الكمومية التي أثبتها ستيفن هوكينغ عام 1974؟",
    },
    options: [
      {
        en: "Rs = 2.95 kilometers; black holes grow infinitely via quantum tunneling",
        ar: "2.95 كيلومتر؛ وتنمو الثقوب السوداء بلا حدود عبر النفق الكمومي",
      },
      {
        en: "Rs = 6,371 kilometers; Hawking showed black holes reflect 100% of visible light",
        ar: "6,371 كيلومتر؛ وأثبت هوكينغ أن الثقوب السوداء تعكس الضوء المرئي بالكامل",
      },
      {
        en: "Rs = 8.87 millimeters (about the size of a marble); quantum field effects near the horizon emit thermal 'Hawking Radiation', slowly losing mass",
        ar: "8.87 مليمتر فقط (بحجم حبة زجاجية صغيرة)؛ وتؤدي التأثيرات الكمومية قرب أفق الحدث إلى انبعاث إشعاع حراري خافت يُعرف بـ (إشعاع هوكينغ)",
      },
      {
        en: "Rs = 100 meters; Hawking proved black holes have zero entropy",
        ar: "100 متر؛ وأثبت هوكينغ أن إنتروبيا الثقوب السوداء تساوي صفراً",
      },
    ],
    correctIndex: 2,
    explanation: {
      en: "Compressing Earth's mass into a black hole yields an Event Horizon radius (Rs) of just 8.87 millimeters. Furthermore, in 1974 Stephen Hawking demonstrated that quantum field effects near the Event Horizon cause black holes to emit thermal Hawking Radiation.",
      ar: "لو ضُغطت الأرض لتصبح ثقباً أسود مع احتفاظها بكتلتها الحالية لبلغ نصف قطر أفق الحدث لها 8.87 مليمتر فقط؛ وفي عام 1974 أثبت ستيفن هوكينغ نظرياً أن التأثيرات الكمومية قرب أفق الحدث تجعل الثقوب السوداء تطلق (إشعاع هوكينغ) الحراري.",
    },
  },
  {
    id: "a7",
    difficulty: "advanced",
    category: { en: "Planetary Geophysics · Mercury & General Relativity", ar: "فيزياء الكواكب · عطارد والنسبية العامة" },
    question: {
      en: "What fraction of Mercury's radius is occupied by its metallic iron-nickel core, how much did the planet shrink radially as it cooled, and how did its orbit confirm Einstein's General Relativity?",
      ar: "كم تبلغ نسبة النواة المعدنية من نصف قطر عطارد، وكم تقلص نصف قطر الكوكب مع تبردها، وكيف أكد مداره نظرية النسبية العامة لأينشتاين؟",
    },
    options: [
      {
        en: "Its core occupies ~85% of its radius; cooling shrank Mercury radially by ~7 km (forming lobate scarps), and its perihelion precession confirmed General Relativity",
        ar: "تشكل نواته نحو 85% من نصف قطره؛ وأدى تبردها إلى انكماش نصف قطر عطارد بنحو 7 كم، كما وفر انحراف حضيض مداره الإهليلجي أحد أوائل التأكيدات الرصدية للنسبية العامة",
      },
      {
        en: "Its core is 10% of its radius; Mercury expanded by 50 km due to solar heating",
        ar: "تشكل نواته 10% من نصف قطره؛ وتمدد الكوكب بمقدار 50 كم بفعل حرارة الشمس",
      },
      {
        en: "Mercury has a liquid hydrogen core and a perfectly circular Newtonian orbit",
        ar: "يمتلك عطارد نواة من الهيدروجين السائل ومداراً دائرياً تماماً",
      },
      {
        en: "Its core is 50% ice; its retrograde rotation disproved Newtonian gravity",
        ar: "تتكون نواته من 50% جليد؛ وأبطل دورانه التراجعي قوانين نيوتن",
      },
    ],
    correctIndex: 0,
    explanation: {
      en: "Mercury possesses an enormous metallic iron-nickel core occupying nearly 85% of the planet's radius. As it slowly cooled and contracted, the planet shrank radially by about 7 km (creating lobate scarps), and its orbital perihelion precession provided one of the first empirical confirmations of Einstein's General Relativity.",
      ar: "يمتلك عطارد نواة معدنية هائلة من الحديد والنيكل تشكل نحو 85% من نصف قطره، ومع تبردها وانكماشها تقلص نصف قطر الكوكب بنحو 7 كم، كما قدم انحراف حضيض مداره الإهليلجي أحد أوائل التأكيدات الرصدية لنظرية النسبية العامة لأينشتاين.",
    },
  },
  {
    id: "a8",
    difficulty: "advanced",
    category: { en: "Atmospheric Fluid Dynamics · Saturn & Uranus", ar: "ديناميكا الأغلفة الجوية · زحل وأورانوس" },
    question: {
      en: "What are the dimensions and wind speeds of the persistent hexagonal jet stream at Saturn's north pole, and what is the coldest tropopause temperature recorded on Uranus?",
      ar: "ما أبعاد وسرعة رياح التيار النفاث سداسي الأضلاع عند القطب الشمالي لكوكب زحل، وما هي أدنى درجة حرارة مسجلة في غلاف أورانوس الجوي؟",
    },
    options: [
      {
        en: "Saturn's Hexagon is 5,000 km wide with 2,100 km/h winds; Uranus's minimum temperature is -110 °C",
        ar: "يبلغ عرض سداسي زحل 5,000 كم برياح 2,100 كم/ساعة؛ وأدنى حرارة في أورانوس -110 °م",
      },
      {
        en: "Saturn's north pole has a triangular vortex; Uranus is hotter than Neptune due to core fusion",
        ar: "يوجد في قطب زحل دوامة مثلثة؛ وأورانوس أشد حرارة من نبتون",
      },
      {
        en: "Saturn's Hexagon is made of solid water ice crystals 100 km thick",
        ar: "يتكون سداسي زحل من جليد مائي صلب بسمك 100 كم",
      },
      {
        en: "Saturn's Hexagon measures 29,000 km across with 320 km/h winds; Uranus's tropopause drops to 49 K (-224 °C) because it radiates almost no excess internal heat",
        ar: "يبلغ عرض سداسي زحل 29,000 كم بسرعة رياح 320 كم/ساعة؛ وتنخفض حرارة طبقة التروبوبوز في أورانوس إلى 49 كلفن (-224 °م) لأنه لا يشع حرارة داخلية تذكر",
      },
    ],
    correctIndex: 3,
    explanation: {
      en: "Saturn's north pole hosts a persistent six-sided jet stream pattern—the Hexagon—measuring 29,000 km across with 320 km/h winds. Meanwhile, Uranus radiates almost no excess internal heat compared to the other giant planets, allowing its tropopause to drop to 49 K (-224 °C).",
      ar: "يوجد عند القطب الشمالي لزحل تيار نفاث سداسي الأضلاع يبلغ عرضه 29,000 كم وتصل سرعة رياحه إلى 320 كم/ساعة، بينما لا يشع أورانوس حرارة داخلية تذكر مما يجعل غلافه الجوي يسجل أدنى حرارة كوكبية في النظام الشمسي عند 49 كلفن (-224 °م).",
    },
  },
  {
    id: "a9",
    difficulty: "advanced",
    category: { en: "Relativistic Tidal Forces · Spaghettification", ar: "قوى المد النسبية · تمدد الزمن والمعكرونة" },
    question: {
      en: "According to the gravitational time dilation formula Δt_∞ = Δt_0 / √(1 - R_s/r) and tidal physics, why are tidal forces right at the Event Horizon of a 10-billion-solar-mass supermassive black hole much weaker than those of a stellar-mass black hole?",
      ar: "وفقاً لمعادلة تمدد الزمن الجاذبي Δt_∞ = Δt_0 / √(1 - R_s/r) وفيزياء قوى المد، لماذا تكون قوى المد عند أفق الحدث لثقب أسود فائق الكتلة (10 مليارات كتلة شمسية) أضعف بكثير منها عند أفق الحدث لثقب أسود نجمي صغير؟",
    },
    options: [
      {
        en: "Because supermassive black holes have weaker total gravity than planets",
        ar: "لأن الثقوب السوداء الفائقة الكتلة تمتلك جاذبية كلية أضعف من الكواكب",
      },
      {
        en: "Because the Event Horizon of a supermassive black hole lies at a vastly greater distance from the center, making the spatial gravity gradient across an astronaut much gentler at the horizon",
        ar: "لأن أفق الحدث للثقب الأسود فائق الكتلة يقع على مسافة شاسعة جداً من المركز، مما يجعل التفاوت الموضعي في الجاذبية عبر جسم رائد الفضاء عند الأفق لطيفاً دون تمزق فوري",
      },
      {
        en: "Because time dilation speeds up clocks inside the Photon Sphere",
        ar: "لأن تمدد الزمن يسرّع حركة الساعات داخل كرة الفوتونات",
      },
      {
        en: "Because stellar-mass black holes do not possess an Event Horizon",
        ar: "لأن الثقوب السوداء النجمية لا تمتلك أفق حدث",
      },
    ],
    correctIndex: 1,
    explanation: {
      en: "Paradoxically, supermassive black holes have much weaker tidal forces right at their Event Horizon than stellar-mass black holes because the Event Horizon radius (Rs ∝ M) lies at an enormous distance from the center, allowing an astronaut to cross the horizon of a 10-billion-solar-mass black hole without immediate spaghettification.",
      ar: "من المفارقات الفيزيائية أن قوى المد عند أفق الحدث للثقوب السوداء الفائقة الكتلة أضعف بكثير منها في الثقوب السوداء النجمية الصغيرة، لأن أفق الحدث فيها يقع على مسافة شاسعة من المركز، مما يسمح بعبور أفق الحدث لثقب كتلته 10 مليارات شمس دون تمزق مدّي فوري.",
    },
  },
  {
    id: "a10",
    difficulty: "advanced",
    category: { en: "Infrared Spectroscopy & Galaxies · JWST & Sombrero", ar: "التحليل الطيفي والمجرات · جيمس ويب ومجرة سومبريرو" },
    question: {
      en: "What spectral wavelength range does the James Webb Space Telescope (JWST) use to resolve exoplanet atmospheres and polycyclic aromatic hydrocarbons (PAHs) in the Sombrero Galaxy (M104), and what is the mass of M104's central black hole?",
      ar: "ما نطاق الطول الموجي للأشعة تحت الحمراء الذي يستخدمه تلسكوب جيمس ويب (JWST) لتحليل أغلفة الكواكب الخارجية وحلقة الغبار في مجرة سومبريرو (M104)، وكم تبلغ كتلة الثقب الأسود المركزي في مجرة سومبريرو؟",
    },
    options: [
      {
        en: "10 – 100 nm ultraviolet range; M104 has no central black hole",
        ar: "نطاق 10 – 100 نانومتر في الأشعة فوق البنفسجية؛ ولا يوجد ثقب أسود في مجرة سومبريرو",
      },
      {
        en: "1 – 10 meter radio wavelengths; M104 hosts a 100-solar-mass black hole",
        ar: "أمواج راديوية بطول 1 – 10 أمتار؛ وثقب أسود كتلته 100 شمس فقط",
      },
      {
        en: "0.6 – 28.5 μm infrared range; the Sombrero Galaxy hosts a 1-billion-solar-mass supermassive black hole and nearly 2,000 globular star clusters",
        ar: "نطاق 0.6 – 28.5 ميكرومتر في الأشعة تحت الحمراء؛ ويقبع في قلب مجرة سومبريرو ثقب أسود كتلته مليار كتلة شمسية مع نحو 2,000 عنقود نجمي كروي",
      },
      {
        en: "Gamma-ray spectrum only; M104 is an irregular dwarf galaxy with 20 clusters",
        ar: "طيف أشعة غاما فقط؛ ومجرة سومبريرو قزمة غير منتظمة تضم 20 عنقوداً",
      },
    ],
    correctIndex: 2,
    explanation: {
      en: "JWST observes across the 0.6 – 28.5 μm infrared spectral range—resolving CO₂, H₂O, CH₄, and SO₂ in exoplanet atmospheres as well as PAH dust rings in the Sombrero Galaxy (M104), which houses a 1-billion-solar-mass black hole and nearly 2,000 globular clusters.",
      ar: "يرصد تلسكوب جيمس ويب الفضائي في نطاق 0.6 – 28.5 ميكرومتر بالأشعة تحت الحمراء، كاشفاً البصمات الكيميائية للكواكب الخارجية وتفاصيل حلقة الغبار في مجرة سومبريرو (M104) التي تحتضن ثقباً أسود فائقاً بكتلة مليار شمس ونحو 2,000 عنقود نجمي كروي.",
    },
  },
];

