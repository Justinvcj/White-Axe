"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ArrowRight, Zap, ShieldAlert, Lock, Sparkles, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/glass-card";

const MOCK_TOPIC = "Newton's Laws";
const MOCK_TEACHER = "Mr. Anderson";
const INITIAL_GAP_SCORE = 100;

// 10 Mock Questions for Initial Assessment
const BASE_QUESTIONS = [
  {
    q: "An object of mass 10 kg is accelerating at 2 m/s². What is the net force acting on the object?",
    options: ["5 N", "12 N", "20 N", "50 N"],
    answerIndex: 2
  },
  {
    q: "According to Newton's First Law, an object at rest will stay at rest unless acted upon by:",
    options: ["A balanced force", "An unbalanced force", "Friction only", "Gravity only"],
    answerIndex: 1
  },
  {
    q: "If the net force on an object is zero, its acceleration is:",
    options: ["Positive", "Negative", "Zero", "Constant but non-zero"],
    answerIndex: 2
  },
  {
    q: "Newton's Third Law states that for every action, there is an equal and opposite:",
    options: ["Acceleration", "Reaction", "Force", "Velocity"],
    answerIndex: 1
  },
  {
    q: "A 50 N force is applied to a 5 kg block. What is its acceleration?",
    options: ["10 m/s²", "250 m/s²", "0.1 m/s²", "55 m/s²"],
    answerIndex: 0
  },
  {
    q: "Which of the following is a measure of inertia?",
    options: ["Weight", "Velocity", "Mass", "Acceleration"],
    answerIndex: 2
  },
  {
    q: "If you double the force acting on an object, its acceleration will:",
    options: ["Halve", "Double", "Quadruple", "Stay the same"],
    answerIndex: 1
  },
  {
    q: "A book rests on a table. The normal force acting on the book is equal and opposite to:",
    options: ["The book's mass", "The force of friction", "The book's weight", "The table's mass"],
    answerIndex: 2
  },
  {
    q: "What is the weight of a 10 kg object on Earth? (g ≈ 9.8 m/s²)",
    options: ["9.8 N", "10 N", "98 N", "980 N"],
    answerIndex: 2
  },
  {
    q: "A car moving at a constant velocity of 20 m/s has a net force of:",
    options: ["20 N", "Greater than zero", "Less than zero", "Zero"],
    answerIndex: 3
  }
];

export default function StudentDashboard() {
  const [activeView, setActiveView] = useState<"week1" | "test" | "progress">("week1");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  
  const [interest, setInterest] = useState<string>("Standard");
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Check lockout status
      if (localStorage.getItem("initial_assessment_locked") === "true") {
        setIsLocked(true);
      }

      // 2. Fetch Area of Interest
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("student_profiles")
          .select("current_interest")
          .eq("user_id", user.id)
          .single();
        if (data && data.current_interest) {
          setInterest(data.current_interest);
        }
      }
    };
    fetchProfile();
  }, []);

  const formatQuestion = (baseQ: string) => {
    let qText = baseQ;
    const lower = interest.toLowerCase();
    
    // Dynamically format the physics questions based on the parent-provided area of interest!
    if (lower.includes("cricket") || lower.includes("sports") || lower.includes("football") || lower.includes("basketball") || lower.includes("tennis")) {
      qText = qText.replace("An object", "A cricket ball").replace("an object", "a cricket ball")
                   .replace("object", "ball")
                   .replace("A car", "A striker").replace("car", "striker")
                   .replace("A 50 N force is applied to a 5 kg block", "A 50 N kick is applied to a 5 kg football");
    } else if (lower.includes("space") || lower.includes("gaming") || lower.includes("robotics")) {
      qText = qText.replace("An object", "A spacecraft").replace("an object", "a spacecraft")
                   .replace("object", "spacecraft")
                   .replace("A car", "A lunar rover").replace("car", "lunar rover")
                   .replace("A book", "A plasma rifle").replace("book", "plasma rifle").replace("table", "spaceship hull");
    } else if (lower.includes("anime") || lower.includes("art") || lower.includes("music")) {
      qText = qText.replace("An object", "A mecha suit").replace("an object", "a mecha suit")
                   .replace("object", "mecha")
                   .replace("A car", "A high-speed mech").replace("car", "mech")
                   .replace("A 50 N force is applied to a 5 kg block", "A 50 N thruster is applied to a 5 kg drone");
    }
    
    return qText;
  };

  const startInitialTest = () => {
    setIsTestLoading(true);
    setTimeout(() => {
      setIsTestLoading(false);
      setActiveView("test");
    }, 1500);
  };

  const handleNext = () => {
    if (selectedOpt === null) return;

    if (currentQIndex < BASE_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOpt(null);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    // Lock it permanently for future visits
    localStorage.setItem("initial_assessment_locked", "true");
    setActiveView("progress");
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center relative overflow-hidden text-center z-20">
         <GlassCard className="max-w-xl p-10 md:p-12 border-rose-200">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center border-4 border-rose-100 mx-auto mb-8">
                <Lock className="w-12 h-12 text-rose-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Assessment Locked</h1>
            <p className="text-slate-600 max-w-md mx-auto text-lg mb-8 font-medium leading-relaxed">
                You have already completed your Initial Assessment for this module. The results are locked while the AI calibrates with your instructor.
            </p>
            <button 
              onClick={() => router.push("/student")} 
              className="bg-slate-800 text-white px-10 py-4 rounded-full font-black hover:bg-slate-900 transition-colors shadow-md w-full sm:w-auto"
            >
              Return to Dashboard
            </button>
         </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans flex items-center justify-center relative overflow-hidden">
      <div className="max-w-4xl w-full relative z-10">
        <AnimatePresence mode="wait">
          
          {/* Week 1: Introduction View */}
          {activeView === "week1" && (
            <motion.div
              key="week1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            >
              <GlassCard className="p-8 md:p-12 text-center border-blue-200 shadow-xl">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Target className="text-blue-600 w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-800">Welcome to Physics 101</h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 font-medium">
                  Your instructor is <span className="text-emerald-600 font-bold">{MOCK_TEACHER}</span>.
                  <br /> We are currently calibrating your personalized learning matrix for <span className="text-blue-600 font-bold">{MOCK_TOPIC}</span>.
                </p>
                
                {interest && interest !== "Standard" && interest !== "Unknown" && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-700 font-bold mb-8 bg-purple-100 inline-block px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>AI Context Adaptation Active: {interest}</span>
                  </div>
                )}

                <button
                  onClick={startInitialTest}
                  disabled={isTestLoading}
                  className="bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-black hover:-translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg disabled:opacity-50 w-full md:w-auto"
                >
                  {isTestLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      <Zap className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>Begin Initial Assessment <ArrowRight className="w-6 h-6" /></>
                  )}
                </button>
              </GlassCard>
            </motion.div>
          )}

          {/* Test Interface View */}
          {activeView === "test" && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <GlassCard className="p-6 md:p-10 border-blue-200 shadow-xl">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-xl md:text-2xl font-black text-slate-800">Initial Assessment: {MOCK_TOPIC}</h2>
                  <div className="bg-slate-100 px-4 py-1.5 rounded-full text-sm font-bold text-slate-500 border border-slate-200 shadow-sm">
                    Question {currentQIndex + 1} of {BASE_QUESTIONS.length}
                  </div>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-relaxed">
                    {formatQuestion(BASE_QUESTIONS[currentQIndex].q)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BASE_QUESTIONS[currentQIndex].options.map((opt, i) => (
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

                  <div className="pt-8 flex justify-end">
                    <button
                      disabled={selectedOpt === null}
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-10 py-4 rounded-full font-black transition-all hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 hover:shadow-lg shadow-md hover:-translate-y-1 flex items-center space-x-2"
                    >
                      <span>{currentQIndex === BASE_QUESTIONS.length - 1 ? "Submit Assessment" : "Next Question"}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-3 rounded-full mt-4 overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: `${(currentQIndex / BASE_QUESTIONS.length) * 100}%` }}
                      animate={{ width: `${((currentQIndex + 1) / BASE_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* Progress / Completion View (No Score Shown) */}
          {activeView === "progress" && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <GlassCard className="p-8 md:p-12 text-center border-emerald-200 shadow-xl">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Calibration Complete</h2>
                <p className="text-center text-slate-600 font-medium text-lg mb-8 max-w-lg mx-auto">
                  Thank you! Your Initial Assessment has been submitted securely.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-8 inline-block text-left shadow-sm max-w-md mx-auto w-full">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <ShieldAlert className="w-8 h-8 text-blue-500" />
                    <span className="text-xl font-black text-slate-800">Results Locked</span>
                  </div>
                  <p className="text-slate-600 font-medium text-center">
                    Your AI profile is currently being calibrated against your Teacher's observations. 
                    Your personalized matrix will unlock soon.
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <button 
                    onClick={() => router.push("/student")}
                    className="bg-slate-800 text-white px-10 py-4 rounded-full font-black hover:bg-slate-900 transition-colors shadow-md w-full sm:w-auto hover:-translate-y-1"
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
