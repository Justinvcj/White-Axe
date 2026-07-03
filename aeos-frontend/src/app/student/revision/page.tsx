"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight, CheckCircle, BrainCircuit, Rocket } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

const REVISION_TOPICS = [
  "Newton's First Law - Inertia",
  "Vector Addition",
  "Kinematic Equations - Free Fall"
];

// Mock Revision Questions
const QUESTIONS = [
  {
    topic: "Newton's First Law - Inertia",
    q: "If a spacecraft is moving at a constant velocity in deep space where there is no friction or gravity, what force is needed to keep it moving?",
    options: ["A constant forward force", "No force is needed", "A force equal to its mass", "A force equal to its velocity"],
    answerIndex: 1
  },
  {
    topic: "Vector Addition",
    q: "A boat travels 3 m/s East and the river flows 4 m/s North. What is the magnitude of the boat's resultant velocity?",
    options: ["1 m/s", "5 m/s", "7 m/s", "12 m/s"],
    answerIndex: 1
  },
  {
    topic: "Kinematic Equations - Free Fall",
    q: "An object is dropped from rest. How far does it fall in 2 seconds? (use g = 10 m/s²)",
    options: ["10 m", "20 m", "30 m", "40 m"],
    answerIndex: 1
  }
];

export default function DailyRevisionPage() {
  const [activeView, setActiveView] = useState<"intro" | "test" | "complete">("intro");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (selectedOpt === null) return;
    
    if (selectedOpt === QUESTIONS[currentQIndex].answerIndex) {
      setCorrectAnswers(c => c + 1);
    }

    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOpt(null);
    } else {
      setActiveView("complete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans flex flex-col relative overflow-hidden">
      <div className="mb-8 z-20">
        <Link href="/student" className="text-orange-500 hover:text-orange-600 text-sm font-bold transition-colors">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Intro View */}
          {activeView === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full"
            >
              <GlassCard className="p-8 md:p-12 text-center border-orange-200">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-orange-600 w-10 h-10" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Daily Practice</h1>
                <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">
                  The AI has prepared 3 quick questions based on your recent activity to keep your memory sharp!
                </p>
                
                <div className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                  {REVISION_TOPICS.map((topic, i) => (
                    <div key={i} className="flex items-center space-x-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-slate-700 font-bold">{topic}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveView("test")}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-black transition-all shadow-md shadow-orange-200 hover:shadow-lg flex items-center justify-center space-x-2 group mx-auto"
                >
                  <span>Start Practice!</span>
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </GlassCard>
            </motion.div>
          )}

          {/* Test View */}
          {activeView === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl w-full"
            >
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-sm text-orange-500 font-black uppercase tracking-wider mb-1">Targeting Topic:</p>
                    <h2 className="text-2xl font-black text-slate-800">{QUESTIONS[currentQIndex].topic}</h2>
                  </div>
                  <div className="text-slate-600 font-bold text-sm bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    {currentQIndex + 1} / {QUESTIONS.length}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full bg-orange-500"
                    initial={{ width: `${(currentQIndex / QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${((currentQIndex + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <GlassCard className="p-6 md:p-10 border-slate-200 shadow-lg">
                <h3 className="text-xl md:text-2xl text-slate-900 font-black leading-relaxed mb-8">
                  {QUESTIONS[currentQIndex].q}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {QUESTIONS[currentQIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOpt(i)}
                      className={`p-5 text-left rounded-2xl transition-all border-2 ${
                        selectedOpt === i 
                          ? "bg-blue-50 border-blue-500 text-blue-900 shadow-sm" 
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`inline-block w-8 h-8 rounded-full text-center leading-8 text-sm font-black mr-4 ${
                        selectedOpt === i ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-semibold text-lg">{opt}</span>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    disabled={selectedOpt === null}
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-10 py-4 rounded-full font-black transition-all disabled:opacity-50 disabled:bg-slate-300 hover:bg-blue-700 hover:shadow-lg shadow-md hover:-translate-y-1"
                  >
                    Submit Answer
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Complete View */}
          {activeView === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl w-full"
            >
              <GlassCard className="p-8 md:p-12 text-center border-emerald-200 shadow-lg">
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CheckCircle className="text-emerald-500 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">Practice Complete!</h2>
                <p className="text-slate-600 mb-8 font-medium text-lg">
                  You successfully answered {correctAnswers} out of {QUESTIONS.length} questions. Great job!
                </p>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 inline-block text-left shadow-sm">
                  <div className="flex items-center space-x-3 mb-2">
                    <BrainCircuit className="w-6 h-6 text-emerald-600" />
                    <span className="text-emerald-700 font-black">AI Profile Updated</span>
                  </div>
                  <p className="text-emerald-700 font-medium text-sm">
                    Your mastery score has been adjusted based on these results. Keep it up!
                  </p>
                </div>

                <div>
                  <button 
                    onClick={() => router.push("/student")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-full font-black transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
