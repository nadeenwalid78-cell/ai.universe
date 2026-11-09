import React, { useState } from "react";
import {
  Language,
  QUIZ_QUESTIONS,
  UI_TRANSLATIONS,
} from "../data/spaceData";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Award,
  Sparkles,
} from "lucide-react";

interface SpaceQuizProps {
  language: Language;
  onAskAiAbout: (prompt: string) => void;
}

export const SpaceQuiz: React.FC<SpaceQuizProps> = ({
  language,
  onAskAiAbout,
}) => {
  const t = UI_TRANSLATIONS[language].quiz;

  const [difficultyFilter, setDifficultyFilter] = useState<
    "beginner" | "intermediate" | "advanced"
  >("beginner");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [history, setHistory] = useState<
    { questionId: string; chosen: number; correct: boolean }[]
  >([]);

  const filteredQuestions = QUIZ_QUESTIONS.filter(
    (q) => q.difficulty === difficultyFilter
  );

  const activeQuestion =
    filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleChangeDifficulty = (
    diff: "beginner" | "intermediate" | "advanced"
  ) => {
    setDifficultyFilter(diff);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setHistory([]);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (selectedOption !== null) return; // Already answered current question
    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === activeQuestion.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
    setHistory((prev) => [
      ...prev,
      {
        questionId: activeQuestion.id,
        chosen: optionIdx,
        correct: isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setHistory([]);
  };

  const levelTabs = [
    {
      id: "beginner" as const,
      label: t.diffBeginner,
      count: QUIZ_QUESTIONS.filter((q) => q.difficulty === "beginner").length,
    },
    {
      id: "intermediate" as const,
      label: t.diffIntermediate,
      count: QUIZ_QUESTIONS.filter((q) => q.difficulty === "intermediate")
        .length,
    },
    {
      id: "advanced" as const,
      label: t.diffAdvanced,
      count: QUIZ_QUESTIONS.filter((q) => q.difficulty === "advanced").length,
    },
  ];

  const currentLevelLabel =
    levelTabs.find((tab) => tab.id === difficultyFilter)?.label || "";

  return (
    <section className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Header & Difficulty Filter */}
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

        {/* Difficulty Segmented Control */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl self-start">
          {levelTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleChangeDifficulty(tab.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                difficultyFilter === tab.id
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-950/60"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                  difficultyFilter === tab.id
                    ? "bg-violet-800/80 text-violet-100"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {tab.count} {language === "ar" ? "أسئلة" : "Q"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {!isCompleted ? (
        <div className="max-w-4xl mx-auto">
          {/* Score & Progress Telemetry Bar */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-4 sm:p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-500/30 text-violet-300 font-semibold">
                {currentLevelLabel}
              </span>
              <span className="text-slate-300">
                {t.questionProgress}:{" "}
                <strong className="text-white tabular-nums">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(filteredQuestions.length).padStart(2, "0")}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-cyan-400">
                {activeQuestion.category[language]}
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 me-1.5">{t.scoreLabel}:</span>
                <span className="text-white font-bold tabular-nums">
                  {score} / {filteredQuestions.length}
                </span>
              </div>
              <div>
                <span className="text-slate-400 me-1.5">{t.streakLabel}:</span>
                <span className="text-amber-400 font-bold tabular-nums">
                  {streak}
                </span>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-snug mb-6">
              {activeQuestion.question[language]}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {activeQuestion.options.map((opt, idx) => {
                const isAnswered = selectedOption !== null;
                const isChosen = selectedOption === idx;
                const isCorrect = idx === activeQuestion.correctIndex;

                let cardStyle =
                  "bg-slate-900/70 border-slate-800 hover:border-slate-600 text-slate-200";
                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle =
                      "bg-emerald-950/50 border-emerald-500/70 text-emerald-100";
                  } else if (isChosen && !isCorrect) {
                    cardStyle =
                      "bg-rose-950/50 border-rose-500/70 text-rose-100";
                  } else {
                    cardStyle =
                      "bg-slate-900/40 border-slate-800/50 text-slate-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-start p-4 rounded-xl border transition-all flex items-center justify-between gap-4 cursor-pointer disabled:cursor-default ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="font-mono text-xs text-slate-400 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span className="text-sm sm:text-base font-medium">
                        {opt[language]}
                      </span>
                    </div>

                    {isAnswered && isCorrect && (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{language === "ar" ? "صحيح" : "Correct"}</span>
                      </span>
                    )}
                    {isAnswered && isChosen && !isCorrect && (
                      <span className="flex items-center gap-1.5 text-xs font-mono text-rose-400 shrink-0">
                        <XCircle className="w-4 h-4" />
                        <span>
                          {language === "ar" ? "غير صحيح" : "Incorrect"}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback & Scientific Explanation */}
            {selectedOption !== null && (
              <div className="pt-6 border-t border-slate-800 animate-fadeIn">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      selectedOption === activeQuestion.correctIndex
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {selectedOption === activeQuestion.correctIndex
                      ? t.correctBadge
                      : t.incorrectBadge}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    {t.explanationHeading}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed mb-5">
                  {activeQuestion.explanation[language]}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() =>
                      onAskAiAbout(
                        language === "ar"
                          ? `اشرح بمزيد من التفصيل العلمي: ${activeQuestion.question.ar}`
                          : `Explain the deeper astrophysics behind this question: ${activeQuestion.question.en}`
                      )
                    }
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-violet-300 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {language === "ar"
                        ? "استفسر أكثر من المرشد الذكي"
                        : "Explore Deeper with AI Space Guide"}
                    </span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <span>
                      {currentIndex + 1 < filteredQuestions.length
                        ? t.nextQuestion
                        : t.finishQuiz}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Final Assessment Summary */
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#0B0E17]/90 border border-slate-800 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center mx-auto mb-4">
            <Award className="w-7 h-7 text-violet-400" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            {t.finalTitle}
          </h3>
          <p className="text-sm text-slate-400 mb-6">{t.finalSubtitle}</p>

          <div className="inline-flex items-baseline gap-2 px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 mb-8">
            <span className="text-4xl font-mono font-bold text-cyan-400 tabular-nums">
              {score} / {filteredQuestions.length}
            </span>
            <span className="text-sm font-mono text-slate-400 tabular-nums">
              ({Math.round((score / filteredQuestions.length) * 100)}%)
            </span>
          </div>

          {/* Question-by-Question Breakdown */}
          <div className="text-start space-y-3 mb-8">
            {filteredQuestions.map((q, i) => {
              const rec = history[i];
              const isOk = rec?.correct;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-mono text-slate-400 block mb-1">
                      {String(i + 1).padStart(2, "0")} · {q.category[language]}
                    </span>
                    <p className="text-sm font-medium text-white mb-1">
                      {q.question[language]}
                    </p>
                    <p className="text-xs text-slate-400">
                      {language === "ar" ? "الإجابة الصحيحة: " : "Correct Answer: "}
                      <span className="text-emerald-300 font-medium">
                        {q.options[q.correctIndex][language]}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono shrink-0 ${
                      isOk ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {isOk
                      ? language === "ar"
                        ? "● صحيح"
                        : "● Correct"
                      : language === "ar"
                      ? "▲ مراجعة"
                      : "▲ Review"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.restartQuiz}</span>
            </button>

            {difficultyFilter !== "advanced" && (
              <button
                onClick={() =>
                  handleChangeDifficulty(
                    difficultyFilter === "beginner" ? "intermediate" : "advanced"
                  )
                }
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {language === "ar"
                    ? difficultyFilter === "beginner"
                      ? "انتقل إلى المستوى المتوسط (10 أسئلة)"
                      : "انتقل إلى المستوى المتقدم (10 أسئلة)"
                    : difficultyFilter === "beginner"
                    ? "Next Level: Intermediate (10 Q)"
                    : "Next Level: Advanced (10 Q)"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
