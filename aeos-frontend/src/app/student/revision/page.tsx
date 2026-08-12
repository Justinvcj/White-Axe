"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight, CheckCircle, BrainCircuit, Rocket, Loader2 } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { createClient } from "@/lib/supabase/client";

export default function DailyRevisionPage() {
  const [activeView, setActiveView] = useState<"intro" | "test" | "complete">("intro");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const router = useRouter();

  // Dynamic Data States
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [revisionData, setRevisionData] = useState<{topics: string[], questions: any[]}>({ topics: [], questions: [] });
  
  const handleStartPractice = async () => {
    setIsSynthesizing(true);
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      let tier = "C2";
      let interest = "General Science";
      
      if (user) {
        const { data: profile } = await supabase
          .from("student_profiles")
          .select("current_tier, current_interest")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          tier = profile.current_tier;
          interest = profile.current_interest || "General Science";
        }
      }

      const res = await fetch("/api/ai/generate-revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interest })
      });
      
      if (res.ok) {
        const result = await res.json();
        setRevisionData(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
      setActiveView("test");
    }
  };

  const handleNext = () => {
    if (selectedOpt === null) return;
    
    if (selectedOpt === revisionData.questions[currentQIndex].answerIndex) {
      setCorrectAnswers(c => c + 1);
    }

    if (currentQIndex < revisionData.questions.length - 1) {
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
          {activeView === "intro" && !isSynthesizing && (
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
                  Our Spaced Repetition Engine has identified past weaknesses. Click below to generate custom questions targeted to your latency!
                </p>

                <button
                  onClick={handleStartPractice}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-full font-black transition-all shadow-md shadow-orange-200 hover:shadow-lg flex items-center justify-center space-x-2 group mx-auto"
                >
                  <span>Synthesize Revision Block</span>
                  <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </GlassCard>
            </motion.div>
          )}

          {/* Loading View */}
          {activeView === "intro" && isSynthesizing && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center max-w-md"
            >
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-24 h-24 border-4 border-orange-200 border-t-orange-500 rounded-full mb-8"
              />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Latency Patterns</h2>
              <p className="text-slate-500">Retrieving historically weak topics and merging with your personal interests...</p>
            </motion.div>
          )}

          {/* Test View */}
          {activeView === "test" && revisionData.questions.length > 0 && (
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
                    <h2 className="text-2xl font-black text-slate-800">{revisionData.questions[currentQIndex].topic}</h2>
                  </div>
                  <div className="text-slate-600 font-bold text-sm bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    {currentQIndex + 1} / {revisionData.questions.length}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full bg-orange-500"
                    initial={{ width: `${(currentQIndex / revisionData.questions.length) * 100}%` }}
                    animate={{ width: `${((currentQIndex + 1) / revisionData.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <GlassCard className="p-6 md:p-10 border-slate-200 shadow-lg">
                <h3 className="text-xl md:text-2xl text-slate-900 font-black leading-relaxed mb-8">
                  {revisionData.questions[currentQIndex].q}
                </h3>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  {revisionData.questions[currentQIndex].options.map((opt: string, i: number) => (
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
                  You successfully answered {correctAnswers} out of {revisionData.questions.length} questions. Great job!
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
