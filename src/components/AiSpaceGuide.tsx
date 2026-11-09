import React, { useEffect, useRef, useState } from "react";
import {
  Language,
  SUGGESTED_AI_QUESTIONS,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import {
  Sparkles,
  Send,
  RotateCcw,
  AlertTriangle,
  Compass,
  Zap,
  Cpu,
  MessageSquare,
  X,
  Maximize2,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface AiSpaceGuideProps {
  language: Language;
  initialPrompt?: string | null;
  onConsumeInitialPrompt?: () => void;
  contextLabel?: string;
}

/**
 * Helper to render **bold** markdown segments cleanly inside chat bubbles
 */
export const FormattedChatText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={idx} className="font-semibold text-cyan-300">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const AiSpaceGuide: React.FC<AiSpaceGuideProps> = ({
  language,
  initialPrompt,
  onConsumeInitialPrompt,
  contextLabel = "",
}) => {
  const t = UI_TRANSLATIONS[language].aiGuide;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "ar"
          ? "مرحباً بك في القبة السماوية الرقمية **AI UNIVERSE**. أنا مرشدك الفضائي الذكي المدعوم بنموذج **Gemini**. يمكنك سؤالي في محادثة تفاعلية متكاملة عن كواكب النظام الشمسي، تطور النجوم، المجرات، الثقوب السوداء، أو الاكتشافات الفلكية الحديثة باللغتين العربية والإنجليزية."
          : "Welcome to the **AI UNIVERSE** Digital Planetarium. I am your **Gemini-powered** Astrophysics Guide. Ask me anything in a multi-turn conversation about planetary atmospheres, orbital mechanics, stellar evolution, galaxies, or black hole physics in English or Arabic.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      modelUsed: "gemini-3.1-flash-lite",
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [modelMode, setModelMode] = useState<"fast" | "standard">("fast");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const el = chatScrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendQuery = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);
    setErrorMsg(null);
    setLastFailedPrompt(null);

    try {
      const response = await fetch("/api/space-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          language,
          context: contextLabel,
          modelMode,
          history: messages.slice(-8).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            (language === "ar"
              ? "تعذر الاتصال بخدمة الذكاء الاصطناعي الفلكي."
              : "Failed to reach the AI Space Guide server.")
        );
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        modelUsed: data.model || "gemini-3.1-flash-lite",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unexpected network error.";
      setErrorMsg(message);
      setLastFailedPrompt(trimmed);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger initialPrompt if navigated from a planet, galaxy, search bar, or black hole card
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      const promptToRun = initialPrompt;
      if (onConsumeInitialPrompt) {
        onConsumeInitialPrompt();
      }
      sendQuery(promptToRun);
    }
  }, [initialPrompt]);

  const handleReset = () => {
    setErrorMsg(null);
    setLastFailedPrompt(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          language === "ar"
            ? "تمت تهيئة جلسة فلكية جديدة. ما الموضوع الكوني الذي تود استكشافه الآن؟"
            : "Observatory session reset. Which cosmic phenomenon would you like to explore next?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        modelUsed:
          modelMode === "fast" ? "gemini-3.1-flash-lite" : "gemini-3.8-flash",
      },
    ]);
  };

  return (
    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-mono tracking-wider text-violet-400 uppercase mb-1.5">
            {t.kicker}
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">{t.subtitle}</p>
        </div>

        {/* Model Mode Switcher & Reset Chat */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setModelMode("fast")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                modelMode === "fast"
                  ? "bg-cyan-500 text-slate-950 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>
                {language === "ar"
                  ? "سريع (Flash Lite)"
                  : "Fast (3.1 Flash Lite)"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setModelMode("standard")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                modelMode === "standard"
                  ? "bg-violet-600 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {language === "ar"
                  ? "متعمق (3.8 Flash)"
                  : "Deep (3.8 Flash)"}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.clearChat}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout: Suggested Inquiries Deck + Interactive Dialogue Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Suggested Scientific Questions */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">{t.suggestedLabel}</h3>
          </div>

          <div className="space-y-2.5">
            {SUGGESTED_AI_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendQuery(item.question[language])}
                disabled={isLoading}
                className="w-full text-start p-3.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-violet-500/40 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span className="block text-[11px] font-mono text-cyan-400 mb-1">
                  0{idx + 1} · {item.category[language]}
                </span>
                <span className="text-xs text-slate-200 leading-relaxed block">
                  {item.question[language]}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            {t.disclaimer}
          </div>
        </div>

        {/* Right Column (8 cols): Astrophysics Dialogue Console */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0B0E17]/90 border border-slate-800 flex flex-col h-[600px]">
          {/* Messages Scroll Area */}
          <div
            ref={chatScrollContainerRef}
            className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-1.5">
                    <span>
                      {isUser
                        ? language === "ar"
                          ? "المستكشف"
                          : "Explorer"
                        : language === "ar"
                        ? "المرشد الفضائي الذكي · Gemini"
                        : "AI Space Guide · Gemini"}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-2xl rounded-2xl px-4 py-3.5 text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? "bg-violet-600 text-white"
                        : "bg-slate-900/90 border border-slate-800 text-slate-100"
                    }`}
                  >
                    <FormattedChatText text={msg.content} />
                  </div>
                </div>
              );
            })}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-cyan-300">
                <Sparkles className="w-4 h-4 animate-spin text-violet-400" />
                <span>{t.loadingText}</span>
              </div>
            )}

            {/* Error State with Retry Button */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">
                      {language === "ar"
                        ? "تنبيه في الاتصال بالخادم"
                        : "Connection Notice"}
                    </span>
                    <span>{errorMsg}</span>
                  </div>
                </div>
                {lastFailedPrompt && (
                  <button
                    type="button"
                    onClick={() => sendQuery(lastFailedPrompt)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {language === "ar" ? "إعادة المحاولة" : "Retry Query"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuery(input);
            }}
            className="p-4 border-t border-slate-800 bg-slate-950/60 rounded-b-2xl flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.sendBtn}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

/**
 * Persistent Floating Gemini AI Chat Drawer so users can chat with the AI Space Guide
 * from ANY section of the website (Solar System, Planets, Galaxies, Black Holes, Quiz).
 */
export const FloatingAiChatWidget: React.FC<{
  language: Language;
  activeSection: string;
  onOpenFullGuide: () => void;
}> = ({ language, activeSection, onOpenFullGuide }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "widget-welcome",
      role: "assistant",
      content:
        language === "ar"
          ? "مرحباً! أنا مرشدك الفضائي الذكي **Gemini**. اسألني عن أي كوكب أو مجرة أو ظاهرة فلكية أثناء تصفحك للموقع."
          : "Hello! I am your **Gemini AI Space Guide**. Ask me about any planet, galaxy, or black hole concept while exploring.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, isOpen]);

  // Hide floating widget when user is already on the dedicated full-page AI Space Guide section
  if (activeSection === "ai-guide") {
    return null;
  }

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `w-user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/space-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          language,
          context: activeSection,
          modelMode: "fast",
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      const answerText =
        response.ok && data.answer
          ? data.answer
          : data.error ||
            (language === "ar"
              ? "حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى."
              : "Connection error, please try again.");

      setMessages((prev) => [
        ...prev,
        {
          id: `w-ai-${Date.now()}`,
          role: "assistant",
          content: answerText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `w-err-${Date.now()}`,
          role: "assistant",
          content:
            language === "ar"
              ? "تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى."
              : "Unable to connect to the server, please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 end-5 z-40">
      {isOpen ? (
        <div className="w-[350px] sm:w-[390px] max-w-[calc(100vw-2.5rem)] h-[480px] rounded-2xl bg-[#0B0E17]/98 border border-violet-500/40 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {language === "ar"
                    ? "المرشد الفضائي الذكي · Gemini"
                    : "AI Space Guide · Gemini"}
                </h4>
                <span className="block text-[10px] font-mono text-cyan-400">
                  {language === "ar"
                    ? "محادثة فورية متعددة الأدوار"
                    : "Multi-Turn Live Chat"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullGuide();
                }}
                title={
                  language === "ar"
                    ? "فتح صفحة المرشد الكاملة"
                    : "Open full AI Space Guide"
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={language === "ar" ? "إغلاق" : "Close"}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
                      isUser
                        ? "bg-violet-600 text-white"
                        : "bg-slate-900 border border-slate-800 text-slate-100"
                    }`}
                  >
                    <FormattedChatText text={msg.content} />
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] font-mono text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>
                  {language === "ar"
                    ? "جارٍ توليد الإجابة العلمية..."
                    : "Synthesizing response..."}
                </span>
              </div>
            )}

            {/* Quick question chips when conversation only has welcome message */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-1 space-y-1.5">
                {SUGGESTED_AI_QUESTIONS.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.question[language])}
                    className="w-full text-start px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    ✦ {q.question[language]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === "ar"
                  ? "اكتب سؤالك الفلكي هنا..."
                  : "Ask a space question..."
              }
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-950/60 border border-violet-400/40 flex items-center gap-2.5 text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-cyan-300" />
          <span>
            {language === "ar" ? "المرشد الفضائي الذكي" : "AI Space Guide"}
          </span>
        </button>
      )}
    </div>
  );
};
