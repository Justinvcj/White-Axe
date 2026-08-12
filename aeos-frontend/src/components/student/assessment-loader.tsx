"use client";

import { useEffect, useState } from "react";
import { AssessmentEngine } from "@/components/student/assessment-engine";
import { BrainCircuit, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AssessmentLoaderProps {
  topicId: string;
  studentId: string;
  assessmentId: string;
  tier: string;
  interest: string;
}

export function AssessmentLoader({ topicId, studentId, assessmentId, tier, interest }: AssessmentLoaderProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const payload = {
          topic: "Structural Foundations & Kinematics", // Mocking topic name based on topicId
          tier,
          interest,
          count: 3
        };

        const res = await fetch("/api/ai/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to synthesize assessment");
        
        const data = await res.json();
        setQuestions(data.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error generating quiz");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [tier, interest]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 max-w-md">
          <h3 className="text-xl font-bold mb-2">Synthesis Failed</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-blue-500/20"
        >
          <BrainCircuit className="w-12 h-12 animate-pulse" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          Synthesizing Assessment Matrix...
        </h2>
        <p className="text-slate-400 max-w-md text-sm mt-4">
          Integrating your cognitive tier (<span className="text-emerald-400 font-bold">{tier}</span>) and interests (<span className="text-amber-400 font-bold">{interest}</span>) into the localized problem space.
        </p>
      </div>
    );
  }

  return (
    <AssessmentEngine 
      questions={questions} 
      topicId={topicId} 
      studentId={studentId} 
      assessmentId={assessmentId}
    />
  );
}
