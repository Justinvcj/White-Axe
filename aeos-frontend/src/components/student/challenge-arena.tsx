"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

interface ChallengeArenaProps {
  studentId: string;
}

const CHALLENGE_QUESTIONS = [
  {
    q: "A 1000 kg car is traveling at 25 m/s. What braking force is required to stop it in 5 seconds?",
    options: ["2000 N", "5000 N", "12500 N", "25000 N"],
    answerIndex: 1
  },
  {
    q: "A block slides down a frictionless incline angled at 30° to the horizontal. What is its acceleration? (g ≈ 9.8 m/s²)",
    options: ["4.9 m/s²", "9.8 m/s²", "8.5 m/s²", "0 m/s²"],
    answerIndex: 0
  },
  {
    q: "If the distance between two massive objects is tripled, the gravitational force between them becomes:",
    options: ["1/3 as strong", "3 times stronger", "1/9 as strong", "9 times stronger"],
    answerIndex: 2
  },
  {
    q: "A 2 kg pendulum bob is released from a height of 0.5 m. What is its maximum velocity at the lowest point?",
    options: ["3.1 m/s", "9.8 m/s", "1.5 m/s", "4.9 m/s"],
    answerIndex: 0
  },
  {
    q: "An astronaut weighing 800 N on Earth travels to a planet with twice the mass and twice the radius of Earth. What is his weight there?",
    options: ["400 N", "800 N", "1600 N", "3200 N"],
    answerIndex: 0
  }
];

export function ChallengeArena({ studentId: _studentId }: ChallengeArenaProps) {
  const [masteryScore, setMasteryScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("EASY");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  
  const isChallengeMode = currentDifficulty === "CHALLENGE";
  
  // If we run out of questions, just loop them for the demo
  const questionData = CHALLENGE_QUESTIONS[activeQuestion % CHALLENGE_QUESTIONS.length];

  const handleSimulateAnswer = (isCorrect: boolean) => {
    setIsSubmitting(true);
    setTimeout(() => {
      let newScore = masteryScore;
      let diff = currentDifficulty;

      if (isCorrect) {
        newScore = Math.min(100, masteryScore + (diff === "CHALLENGE" ? 15 : 10));
        if (diff === "EASY") diff = "MEDIUM";
        else if (diff === "MEDIUM") diff = "HARD";
        else if (diff === "HARD") diff = "CHALLENGE";
      } else {
        newScore = Math.max(0, masteryScore - 5); 
        if (diff === "CHALLENGE") diff = "HARD";
        else if (diff === "HARD") diff = "MEDIUM";
        else if (diff === "MEDIUM") diff = "EASY";
      }

      setMasteryScore(newScore);
      setCurrentDifficulty(diff);
      setActiveQuestion(q => q + 1);
      setSelectedOpt(null);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <motion.div 
      animate={{ 
        backgroundColor: isChallengeMode ? "rgba(236, 253, 245, 1)" : "rgba(255, 255, 255, 1)",
        borderColor: isChallengeMode ? "rgba(16, 185, 129, 0.3)" : "rgba(226, 232, 240, 1)"
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={cn(
        "max-w-4xl w-full mx-auto rounded-[2rem] p-8 md:p-12 border bg-white",
        isChallengeMode ? "shadow-2xl shadow-emerald-100" : "shadow-xl shadow-slate-200"
      )}
    >
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12 border-b border-slate-100 pb-6">
        <div>
          <h2 className={cn(
            "text-3xl font-black tracking-tight transition-colors duration-500",
            isChallengeMode ? "text-emerald-700" : "text-slate-900"
          )}>
            {isChallengeMode ? "Challenge Arena Active" : "Adaptive Assessment"}
          </h2>
          <p className="text-slate-500 mt-3 flex items-center space-x-2 font-medium">
            <Zap className={cn("w-4 h-4", isChallengeMode ? "text-emerald-500" : "text-amber-500")} />
            <span>Difficulty Level: <strong className={cn("uppercase tracking-wider ml-1", isChallengeMode ? "text-emerald-600" : "text-slate-700")}>{currentDifficulty}</strong></span>
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-2">Mastery Trajectory</p>
          <div className="text-4xl font-black text-slate-800 flex items-center md:justify-end">
            <Brain className={cn("w-6 h-6 mr-3 transition-colors", isChallengeMode ? "text-emerald-500" : "text-blue-500")} />
            {masteryScore}%
          </div>
        </div>
      </header>

      {/* Reactive Completion Bar */}
      <div className="mb-14 relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${masteryScore}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-colors duration-700",
            isChallengeMode ? "bg-emerald-500 shadow-md" : "bg-blue-500 shadow-md"
          )}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 min-h-[160px] flex flex-col justify-center shadow-inner">
            <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Question {activeQuestion + 1}</p>
            <p className="text-xl md:text-2xl text-slate-800 font-bold leading-relaxed">
              {questionData.q}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionData.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOpt(i)}
                className={`p-4 md:p-6 text-left rounded-2xl transition-all border-2 font-semibold text-lg ${
                  selectedOpt === i 
                    ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 mr-4 transition-colors text-sm font-black ${
                  selectedOpt === i ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>
          
          <div className="pt-4 flex justify-end">
            <button
              disabled={selectedOpt === null || isSubmitting}
              onClick={() => handleSimulateAnswer(selectedOpt === questionData.answerIndex)}
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-black transition-all hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 hover:shadow-lg shadow-md hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
