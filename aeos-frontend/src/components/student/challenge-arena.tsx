"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

interface ChallengeArenaProps {
  studentId: string;
}

export function ChallengeArena({ studentId: _studentId }: ChallengeArenaProps) {
  const [masteryScore, setMasteryScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("EASY");
  
  // Simulation states for frontend interaction demonstration
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const isChallengeMode = currentDifficulty === "CHALLENGE";

  const handleSimulateAnswer = (isCorrect: boolean) => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Mock logic mimicking the AAE Engine's step-function
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
            <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Question {activeQuestion}</p>
            <p className="text-xl md:text-2xl text-slate-800 font-bold leading-relaxed">
              [Dynamic Math Injection - Node {activeQuestion}]
              <br/><br/>
              Calculate the localized trajectory given the active contextual parameters...
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => handleSimulateAnswer(true)}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black border-none transition-colors shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>Simulate Correct Response</span>
            </button>
            <button 
              onClick={() => handleSimulateAnswer(false)}
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 py-5 rounded-2xl font-bold border-2 border-slate-200 hover:border-rose-300 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>Simulate Incorrect Response</span>
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
