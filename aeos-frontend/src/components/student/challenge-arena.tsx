"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/glass-card";

import { createClient } from "@/lib/supabase/client";

interface ChallengeArenaProps {
  studentId: string;
  studentInterest: string;
  isInitialAssessment?: boolean;
}

const getQuestionsForInterest = (interest: string, forceGeneric: boolean) => {
  if (forceGeneric || !interest) {
    return [
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
  }

  const normalized = interest.toLowerCase();
  
  if (normalized.includes("cricket")) {
    return [
      {
        q: "A 150g cricket ball is bowled at 40 m/s. What braking force is required by the batsman's bat to stop it in 0.05 seconds?",
        options: ["120 N", "200 N", "250 N", "300 N"],
        answerIndex: 0
      },
      {
        q: "A batsman hits a ball at an angle of 45° with a velocity of 30 m/s. What is the maximum height reached? (g ≈ 9.8 m/s²)",
        options: ["22.9 m", "30.5 m", "45.9 m", "15.3 m"],
        answerIndex: 0
      },
      {
        q: "If the distance between the bowler and the batsman is 20m, how long does a 40 m/s delivery take to reach the crease?",
        options: ["0.25 s", "0.5 s", "1 s", "2 s"],
        answerIndex: 1
      },
      {
        q: "A fielder catches a ball and pulls his hands back. This reduces the force of impact by:",
        options: ["Decreasing change in momentum", "Increasing time of impact", "Decreasing mass", "Increasing velocity"],
        answerIndex: 1
      },
      {
        q: "During a spin bowl, the Magnus effect causes the ball to drift. This is primarily an application of:",
        options: ["Newton's Third Law", "Bernoulli's Principle", "Archimedes' Principle", "Coulomb's Law"],
        answerIndex: 1
      }
    ];
  }

  if (normalized.includes("astronomy") || normalized.includes("space")) {
    return [
      {
        q: "A 1000 kg satellite is orbiting Earth at 7 km/s. What thruster force is required to stop it in 100 seconds?",
        options: ["50,000 N", "70,000 N", "10,000 N", "100,000 N"],
        answerIndex: 1
      },
      {
        q: "A rover slides down a frictionless Martian crater angled at 30°. What is its acceleration? (Mars g ≈ 3.7 m/s²)",
        options: ["1.85 m/s²", "3.7 m/s²", "4.9 m/s²", "9.8 m/s²"],
        answerIndex: 0
      },
      {
        q: "If the distance between two orbiting asteroids is tripled, the gravitational force between them becomes:",
        options: ["1/3 as strong", "3 times stronger", "1/9 as strong", "9 times stronger"],
        answerIndex: 2
      },
      {
        q: "A 2 kg pendulum bob is released from 0.5 m on the Moon (g ≈ 1.6 m/s²). What is its max velocity?",
        options: ["1.26 m/s", "3.1 m/s", "1.6 m/s", "4.9 m/s"],
        answerIndex: 0
      },
      {
        q: "An astronaut weighing 800 N on Earth travels to a exoplanet with twice the mass and twice the radius of Earth. What is his weight there?",
        options: ["400 N", "800 N", "1600 N", "3200 N"],
        answerIndex: 0
      }
    ];
  }

  if (normalized.includes("robotics")) {
    return [
      {
        q: "A 10 kg robotic arm moves at 2.5 m/s. What braking force is required to stop it in 0.5 seconds?",
        options: ["25 N", "50 N", "125 N", "250 N"],
        answerIndex: 1
      },
      {
        q: "A robot chassis slides down a 30° ramp. What is its acceleration? (g ≈ 9.8 m/s²)",
        options: ["4.9 m/s²", "9.8 m/s²", "8.5 m/s²", "0 m/s²"],
        answerIndex: 0
      },
      {
        q: "If the distance between two magnetic actuators is tripled, the magnetic force between them (assuming point poles) becomes:",
        options: ["1/3 as strong", "3 times stronger", "1/9 as strong", "9 times stronger"],
        answerIndex: 2
      },
      {
        q: "A 2 kg robotic pendulum swings from a height of 0.5 m. What is its maximum velocity?",
        options: ["3.1 m/s", "9.8 m/s", "1.5 m/s", "4.9 m/s"],
        answerIndex: 0
      },
      {
        q: "A heavy drone requires 800 N of lift on Earth. On a planet with twice the mass and twice the radius, how much lift is required?",
        options: ["400 N", "800 N", "1600 N", "3200 N"],
        answerIndex: 0
      }
    ];
  }

  if (normalized.includes("basketball")) {
    return [
      {
        q: "A 600g basketball is passed at 10 m/s. What force is required by the receiver to stop it in 0.2 seconds?",
        options: ["15 N", "30 N", "60 N", "120 N"],
        answerIndex: 1
      },
      {
        q: "A player jumps at a 45° angle with a velocity of 5 m/s. What is the maximum height reached? (g ≈ 9.8 m/s²)",
        options: ["0.64 m", "1.28 m", "2.5 m", "5 m"],
        answerIndex: 0
      },
      {
        q: "If a court is 28m long, how long does a 14 m/s full-court pass take to reach the other side?",
        options: ["1 s", "2 s", "3 s", "4 s"],
        answerIndex: 1
      },
      {
        q: "A player catches a hard pass and pulls their hands back to cushion it. This reduces force by:",
        options: ["Decreasing change in momentum", "Increasing time of impact", "Decreasing mass", "Increasing velocity"],
        answerIndex: 1
      },
      {
        q: "Backspin on a basketball shot increases its chances of bouncing softly into the hoop due to:",
        options: ["Newton's Third Law", "Conservation of Angular Momentum", "Archimedes' Principle", "Coulomb's Law"],
        answerIndex: 1
      }
    ];
  }

  return [
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
};

export function ChallengeArena({ studentId, studentInterest, isInitialAssessment = false }: ChallengeArenaProps) {
  const [masteryScore, setMasteryScore] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("EASY");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const isChallengeMode = currentDifficulty === "CHALLENGE";
  
  const questions = getQuestionsForInterest(studentInterest, isInitialAssessment);
  const questionData = questions[Math.min(activeQuestion, questions.length - 1)];

  const handleSimulateAnswer = (isCorrect: boolean) => {
    setIsSubmitting(true);
    setTimeout(async () => {
      let newScore = masteryScore;
      let diff = currentDifficulty;

      if (isCorrect) {
        newScore = Math.min(100, masteryScore + (diff === "CHALLENGE" ? 15 : 20));
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
      
      const nextQ = activeQuestion + 1;
      
      if (nextQ >= questions.length) {
        setIsFinished(true);
        const supabase = createClient();
        await supabase.from("student_profiles").update({
          initial_assessment_completed: true,
          mastery: newScore
        }).eq("user_id", studentId);
      } else {
        setActiveQuestion(nextQ);
      }
      
      setSelectedOpt(null);
      setIsSubmitting(false);
    }, 600);
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto rounded-[2rem] p-12 text-center bg-emerald-50 border border-emerald-100 shadow-2xl shadow-emerald-100/50"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
          <Zap className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-emerald-900 tracking-tight mb-4">Assessment Complete!</h2>
        <p className="text-xl text-emerald-700 font-medium mb-8">
          You achieved a mastery score of <strong className="text-3xl font-black text-emerald-600 ml-2">{masteryScore}%</strong>
        </p>
        <a href="/student" className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-emerald-200 transition-all transform hover:scale-105">
          Return to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </motion.div>
    );
  }

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
            {isInitialAssessment ? "Baseline Assessment" : (isChallengeMode ? "Challenge Arena Active" : "Adaptive Assessment")}
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

      <div className="mb-14 relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((activeQuestion) / questions.length) * 100}%` }}
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
            <p className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Question {activeQuestion + 1} of {questions.length}</p>
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
          
          <div className="pt-6 flex justify-end">
            <button
              disabled={selectedOpt === null || isSubmitting}
              onClick={() => handleSimulateAnswer(selectedOpt === questionData.answerIndex)}
              className="group relative flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200 overflow-hidden"
            >
              <span className="relative z-10">{isSubmitting ? "Processing..." : "Submit Answer"}</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              {isSubmitting && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="absolute inset-0 bg-white/20 w-1/2 skew-x-12"
                />
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
