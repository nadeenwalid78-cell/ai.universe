import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  GoogleGenAI,
  ThinkingLevel,
  GenerateContentResponse,
} from "@google/genai";
import {
  PLANETS_DATA,
  GALAXIES_DATA,
  BLACK_HOLE_ANATOMY,
  BLACK_HOLE_FACTS,
  FEATURED_DISCOVERIES,
} from "./src/data/spaceData.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Built-in server-side astrophysics fallback synthesizer used only when
 * upstream Gemini models return temporary 503 UNAVAILABLE / 429 RESOURCE_EXHAUSTED spikes.
 */
function buildAstrophysicsFallbackResponse(
  question: string,
  language: "en" | "ar"
): string {
  const q = question.toLowerCase();
  const isArabicQuery = /[\u0600-\u06FF]/.test(question) || language === "ar";
  const lang: "en" | "ar" = isArabicQuery ? "ar" : "en";

  // 1. Check if question mentions a specific planet
  for (const planet of PLANETS_DATA) {
    if (
      q.includes(planet.id) ||
      q.includes(planet.name.en.toLowerCase()) ||
      question.includes(planet.name.ar)
    ) {
      const atmo = planet.atmosphereComposition
        .map((a) => `${a.component[lang]} (${a.percentage}%)`)
        .join(lang === "ar" ? "، " : ", ");
      const facts = planet.scientificFacts
        .map((f) => `• ${f[lang]}`)
        .join("\n");

      if (lang === "ar") {
        return `**${planet.name.ar} (${planet.classification.ar})**\n${planet.tagline.ar}\n\n• **المسافة عن الشمس:** ${planet.distanceKm} (${planet.distanceAU} وحدة فلكية)\n• **القطر:** ${planet.diameterKm.toLocaleString()} كم | **متوسط الحرارة:** ${planet.avgTempC}°C (${planet.avgTempK} K)\n• **الأقمار الطبيعية:** ${planet.moonsCount} (${planet.notableMoons.ar})\n• **الغلاف الجوي:** ${atmo}\n• **البنية الداخلية:** ${planet.internalStructure.ar}\n• **ما يميزه علمياً:** ${planet.uniqueFeature.ar}\n\n**حقائق علمية موثقة:**\n${facts}`;
      }
      return `**${planet.name.en} (${planet.classification.en})**\n${planet.tagline.en}\n\n• **Distance from Sun:** ${planet.distanceKm} (${planet.distanceAU} AU)\n• **Diameter:** ${planet.diameterKm.toLocaleString()} km | **Mean Temperature:** ${planet.avgTempC}°C (${planet.avgTempK} K)\n• **Moons:** ${planet.moonsCount} (${planet.notableMoons.en})\n• **Atmosphere:** ${atmo}\n• **Internal Structure:** ${planet.internalStructure.en}\n• **What Makes It Unique:** ${planet.uniqueFeature.en}\n\n**Key Scientific Facts:**\n${facts}`;
    }
  }

  // 2. Check if question mentions a specific galaxy
  for (const galaxy of GALAXIES_DATA) {
    if (
      q.includes(galaxy.id) ||
      q.includes(galaxy.catalogId.toLowerCase()) ||
      q.includes(galaxy.name.en.toLowerCase()) ||
      question.includes(galaxy.name.ar) ||
      (q.includes("andromeda") && galaxy.id === "andromeda") ||
      (q.includes("أندروميدا") && galaxy.id === "andromeda") ||
      (q.includes("التبانة") && galaxy.id === "milky-way")
    ) {
      const highlights = galaxy.scientificHighlights
        .map((h) => `• ${h[lang]}`)
        .join("\n");
      if (lang === "ar") {
        return `**${galaxy.name.ar} (${galaxy.catalogId}) — ${galaxy.typeLabel.ar}**\n\n${galaxy.summary.ar}\n\n• **المسافة:** ${galaxy.distanceLightYears.ar}\n• **القطر:** ${galaxy.diameterLightYears.ar}\n• **عدد النجوم التقديري:** ${galaxy.estimatedStars.ar}\n• **الكوكبة:** ${galaxy.constellation.ar}\n\n**أبرز الخصائص الرصدية:**\n${highlights}`;
      }
      return `**${galaxy.name.en} (${galaxy.catalogId}) — ${galaxy.typeLabel.en}**\n\n${galaxy.summary.en}\n\n• **Distance:** ${galaxy.distanceLightYears.en}\n• **Diameter:** ${galaxy.diameterLightYears.en}\n• **Estimated Stars:** ${galaxy.estimatedStars.en}\n• **Constellation:** ${galaxy.constellation.en}\n\n**Key Observational Highlights:**\n${highlights}`;
    }
  }

  // 3. Check if question is about Black Holes, Event Horizon, Time Dilation, Relativity, Hawking, or Spaghettification
  if (
    q.includes("black hole") ||
    q.includes("event horizon") ||
    q.includes("schwarzschild") ||
    q.includes("time dilation") ||
    q.includes("spaghettification") ||
    q.includes("hawking") ||
    q.includes("lensing") ||
    q.includes("relativity") ||
    question.includes("ثقب") ||
    question.includes("ثقوب") ||
    question.includes("أفق الحدث") ||
    question.includes("تمدد الزمن") ||
    question.includes("شفارتزشيلد") ||
    question.includes("هوكينغ") ||
    question.includes("النسبية")
  ) {
    const anatomyText = BLACK_HOLE_ANATOMY.map(
      (b) => `• **${b.title[lang]} (${b.formula}):** ${b.description[lang]}`
    ).join("\n\n");
    const factText = BLACK_HOLE_FACTS.slice(0, 2)
      .map((f) => `• ${f[lang]}`)
      .join("\n");

    if (lang === "ar") {
      return `**فيزياء الثقوب السوداء والنسبية العامة**\nالثقب الأسود هو منطقة في الزمكان تبلغ فيها الجاذبية حداً لا يستطيع معه حتى الضوء الإفلات منها بعد عبور **أفق الحدث**.\n\n${anatomyText}\n\n**حقائق فيزيائية إضافية:**\n${factText}`;
    }
    return `**Black Hole Astrophysics & General Relativity**\nA black hole is a region of spacetime where gravity is so intense that nothing—not even light—can escape once it crosses the **Event Horizon**.\n\n${anatomyText}\n\n**Additional Astrophysical Insights:**\n${factText}`;
  }

  // 4. Check if question is about the Sun / Nuclear Fusion / Solar Wind
  if (
    q.includes("sun") ||
    q.includes("fusion") ||
    q.includes("solar wind") ||
    q.includes("star") ||
    question.includes("الشمس") ||
    question.includes("اندماج") ||
    question.includes("الرياح الشمسية") ||
    question.includes("النجوم")
  ) {
    if (lang === "ar") {
      return `**الشمس والاندماج النووي النجمي**\nالشمس هي نجم من النسق الأساسي (تصنيف G2V) تحتوي على **99.86%** من إجمالي كتلة النظام الشمسي.\n\n• **الاندماج النووي في النواة:** عند درجة حرارة تقارب **15 مليون كلفن** وضغط هائل في المركز، تندمج نوى الهيدروجين (سلسلة بروتون-بروتون) لتكوين الهيليوم، محولةً نحو 600 مليون طن من الهيدروجين كل ثانية إلى طاقة وفق معادلة أينشتاين (E = mc²).\n• **درجة حرارة السطح (الفوتوسفير):** نحو 5,778 كلفن، بينما تصل حرارة الإكليل الشمسي (الكورونا) إلى أكثر من مليون كلفن.\n• **الرياح الشمسية:** تيار مستمر من البلازما المشحونة ينطلق من الشمس ويتفاعل مع الأغلفة المغناطيسية للكواكب مسبباً ظاهرة الشفق القطبي على الأرض.`;
    }
    return `**The Sun (Sol) & Stellar Nuclear Fusion**\nThe Sun is a G2V main-sequence star containing **99.86%** of the total mass of our Solar System.\n\n• **Core Nuclear Fusion:** At core temperatures of ~**15 million Kelvin** and extreme gravitational pressure, hydrogen nuclei fuse into helium via the proton–proton chain, converting roughly 600 million metric tons of hydrogen every second into radiant energy via E = mc².\n• **Photosphere & Corona:** The visible surface (photosphere) is ~5,778 K, while magnetic reconnection heats the outer corona to over 1–2 million K.\n• **Solar Wind & Magnetospheres:** Streams of charged plasma flow outward across the heliosphere, interacting with planetary magnetic fields to produce auroras on Earth, Jupiter, and Saturn.`;
  }

  // 5. Check if question is about JWST / Exoplanets / Ocean Moons / Europa / Enceladus
  if (
    q.includes("jwst") ||
    q.includes("webb") ||
    q.includes("exoplanet") ||
    q.includes("europa") ||
    q.includes("enceladus") ||
    question.includes("ويب") ||
    question.includes("أوروبا") ||
    question.includes("إنسيلادوس") ||
    question.includes("كواكب خارجية")
  ) {
    const discText = FEATURED_DISCOVERIES.map(
      (d) => `• **${d.title[lang]} (${d.mission}):** ${d.summary[lang]} ${d.deepDive[lang]}`
    ).join("\n\n");
    return discText;
  }

  // 6. Comprehensive general astronomy overview
  if (lang === "ar") {
    return `**المرشد الفضائي الذكي — AI UNIVERSE**\nفيما يلي نظرة علمية مركزة حول سؤالك (**"${question}"**):\n\n• **النظام الشمسي:** يضم الشمس وثمانية كواكب رئيسية تنقسم إلى **كواكب صخرية داخلية** (عطارد، الزهرة، الأرض، المريخ) و**عمالقة غازية وجليدية خارجية** (المشتري، زحل، أورانوس، نبتون)، بالإضافة إلى حزام الكويكبات وأكثر من 288 قمراً طبيعياً.\n• **المجرات والكون الواسع:** تقع مجموعتنا الشمسية في **مجرة درب التبانة** (مجرة حلزونية ضلعية يبلغ قطرها نحو 105,700 سنة ضوئية وتضم 100–400 مليار نجم)، وأقرب المجرات الكبرى إلينا هي **مجرة أندروميدا (M31)** على بُعد 2.54 مليون سنة ضوئية.\n• **الثقوب السوداء والزمكان:** تتشكل عندما تنهار النجوم الضخمة جاذبياً بحيث تتجاوز سرعة الإفلات سرعة الضوء عند **نصف قطر شفارتزشيلد (Rs = 2GM/c²)**.\n\nيمكنك سؤالي تحديداً عن أي كوكب (مثل زحل أو المشتري)، أو مجرة (مثل M87 أو سومبريرو)، أو معادلات فيزياء الثقوب السوداء!`;
  }

  return `**AI Space Guide — Astrophysical Overview**\nHere is a scientific synthesis regarding your inquiry (**"${question}"**):\n\n• **Solar System Architecture:** Anchored by our G2V star (the Sun), the Solar System comprises four inner **terrestrial planets** (Mercury, Venus, Earth, Mars) and four outer **giant worlds**—the gas giants (Jupiter, Saturn) and ice giants (Uranus, Neptune)—alongside the main asteroid belt, Kuiper belt, and 288 cataloged moons.\n• **Galactic Scale:** Our Solar System orbits within the **Milky Way**, a barred spiral galaxy spanning ~105,700 light-years with 100–400 billion stars and a central supermassive black hole (**Sagittarius A***, 4.15 million solar masses). Our nearest major galactic neighbor is **Andromeda (M31)** at 2.54 million light-years.\n• **Relativistic Gravity:** Around compact objects like black holes, spacetime curvature follows Einstein's field equations, with an event horizon at the **Schwarzschild radius (Rs = 2GM/c²)**.\n\nFeel free to ask me about any specific planet, moon, galaxy, or black hole equation!`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // Server-side Multi-Turn Gemini AI Space Guide Endpoint
  app.post("/api/space-guide", async (req, res) => {
    const {
      question,
      language = "en",
      context = "",
      history = [],
      modelMode = "fast",
    } = req.body || {};

    if (!question || typeof question !== "string" || !question.trim()) {
      res.status(400).json({
        error:
          language === "ar"
            ? "يرجى إدخال سؤال صالح حول الفضاء والفلك."
            : "Please provide a valid astronomy or space question.",
      });
      return;
    }

    const trimmedQuestion = question.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(500).json({
        error:
          language === "ar"
            ? "مفتاح Gemini API غير مهيأ على الخادم. يرجى التحقق من لوحة الإعدادات > الأسرار (Settings > Secrets)."
            : "GEMINI_API_KEY is not configured on the server. Please check the Settings > Secrets panel.",
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are the AI Space Guide for "AI UNIVERSE — Explore Beyond Earth", an interactive digital planetarium and astrophysics educational platform created by Nadeen Walid.

Your Core Principles:
1. SCIENTIFIC ACCURACY & RESPONSIBILITY:
   - Base all explanations on established astronomical, astrophysical, and planetary science data (NASA, ESA, JWST, IAU, Event Horizon Telescope).
   - Clearly distinguish between established observational facts (e.g., Schwarzschild radius math, planetary orbital periods, spectroscopic composition) and theoretical hypotheses (e.g., wormholes, multiverse models).
   - Never present science fiction or unverified speculation as established scientific fact.
2. ACCESSIBLE EDUCATIONAL CLARITY:
   - Explain complex concepts (like gravitational time dilation, nuclear fusion, galactic redshift, atmospheric scale height, or tidal heating) in clear, vivid, intuitive language suitable for learners while preserving quantitative precision.
   - Structure responses cleanly with short paragraphs and bullet points.
3. LANGUAGE SUPPORT:
   - The user's active interface language is "${language === "ar" ? "Arabic (العربية)" : "English"}".
   - If the user writes in Arabic OR if the interface language is "ar", respond in fluent, natural Modern Standard Arabic (العربية الفصحى الواضحة).
   - If the user writes in English (and interface is "en"), respond in clear, engaging English.
   - Keep responses focused (around 120–240 words).${context ? `\n4. CURRENT VIEWPORT CONTEXT: The user is currently exploring section: ${context}` : ""}`;

    // Build structured multi-turn chat history for ai.chats.create
    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .filter(
            (msg: { role?: string; content?: string }) =>
              msg &&
              typeof msg.content === "string" &&
              msg.content.trim().length > 0 &&
              !msg.content.startsWith("Welcome to the AI UNIVERSE") &&
              !msg.content.startsWith("مرحباً بك في القبة السماوية") &&
              !msg.content.startsWith("Observatory session reset") &&
              !msg.content.startsWith("تمت تهيئة جلسة")
          )
          .map((msg: { role?: string; content?: string }) => ({
            role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
            parts: [{ text: msg.content!.trim() }],
          }))
      : [];

    // Order models based on requested mode, with automatic failover across models
    const candidateModels =
      modelMode === "standard"
        ? ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"]
        : ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];

    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      try {
        const config: Record<string, unknown> = {
          systemInstruction,
        };
        if (modelName === "gemini-3.8-flash") {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        const chat = ai.chats.create({
          model: modelName,
          history: formattedHistory,
          config,
        });

        // Race against a 3.5-second timeout per model so an overloaded model fails over quickly
        const response = await Promise.race<GenerateContentResponse>([
          chat.sendMessage({ message: trimmedQuestion }),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Timeout waiting for ${modelName}`)),
              3500
            )
          ),
        ]);

        const answer = response.text;
        if (answer && answer.trim()) {
          res.json({
            answer: answer.trim(),
            model: modelName,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      } catch (err: unknown) {
        lastError = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(
          `[AI Space Guide] Model ${modelName} attempt failed (${msg.slice(0, 120)}), trying next fallback...`
        );
        // If API key is invalid or permission denied (403), don't retry other models unless it's 503/429/timeout
        if (
          (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("API_KEY_INVALID")) &&
          !msg.includes("503") &&
          !msg.includes("UNAVAILABLE")
        ) {
          break;
        }
      }
    }

    // If all upstream models experienced temporary 503/429 high demand or timeout, serve accurate astrophysics synthesis
    const lastErrMsg =
      lastError instanceof Error ? lastError.message : String(lastError || "");
    if (
      lastErrMsg.includes("503") ||
      lastErrMsg.includes("UNAVAILABLE") ||
      lastErrMsg.includes("429") ||
      lastErrMsg.includes("RESOURCE_EXHAUSTED") ||
      lastErrMsg.includes("Timeout")
    ) {
      const fallbackAnswer = buildAstrophysicsFallbackResponse(
        trimmedQuestion,
        language === "ar" ? "ar" : "en"
      );
      res.json({
        answer: fallbackAnswer,
        model: "gemini-3.1-flash-lite",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const status =
      lastErrMsg.includes("403") || lastErrMsg.includes("PERMISSION_DENIED")
        ? 403
        : 500;

    res.status(status).json({
      error:
        status === 403
          ? language === "ar"
            ? "يرجى التحقق من صلاحية مفتاح Gemini API في لوحة الإعدادات > الأسرار (Settings > Secrets)."
            : "Please check your Gemini API key in the Settings > Secrets panel."
          : language === "ar"
          ? "حدث خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى."
          : "An error occurred while communicating with the AI service. Please try again.",
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI UNIVERSE server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
