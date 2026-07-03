"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelemetry } from "@/hooks/use-telemetry";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lightbulb, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  content: string;
  options?: { id: string; text: string }[];
  correct_answer?: string;
}

interface AssessmentEngineProps {
  questions: Question[];
  topicId: string;
  studentId: string;
  assessmentId: string;
}

export function AssessmentEngine({ questions, topicId: _topicId, studentId, assessmentId }: AssessmentEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { startTracking, logHintClick, logAnswerChange, getPayload } = useTelemetry();
  const supabase = createClient();

  useEffect(() => {
    startTracking();
  }, [currentIndex, startTracking]);

  if (questions.length === 0) {
    return <div className="text-white text-center p-10">No questions available for this module.</div>;
  }

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center w-full">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <div className="w-24 h-24 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,197,94,0.15)] border border-green-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete</h2>
          <p className="text-slate-400 max-w-md text-lg">Your responses and underlying behavioral telemetry have been securely transmitted to the Matrix Validation Engine.</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = currentQuestion.options || [];

  const handleSelect = (optId: string) => {
    if (selectedOption && selectedOption !== optId) {
      logAnswerChange();
    }
    setSelectedOption(optId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setIsSubmitting(true);
    
    const telemetry = getPayload();
    const isCorrect = selectedOption === (currentQuestion.correct_answer || "A");

    try {
      // If it's a mock question (e.g. "q1"), skip DB insert to avoid foreign key errors
      if (!currentQuestion.id.startsWith("q")) {
        const { error } = await supabase.from("student_responses").insert({
          student_id: studentId,
          question_id: currentQuestion.id,
          assessment_id: assessmentId,
          is_correct: isCorrect,
          response_latency_ms: telemetry.time_taken_ms,
          response_data: {
            time_taken_seconds: telemetry.time_taken_seconds,
            hints_used: telemetry.hints_used,
            click_stream_changes: telemetry.click_stream_changes,
            selected_option: selectedOption
          }
        });

        if (error) throw error;
      } else {
        // Simulate a small network delay for mock questions
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (currentIndex + 1 < questions.length) {
        setSelectedOption(null);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Failed to submit response", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 w-full">
      <div className="mb-10 flex justify-between items-center text-sm font-medium text-slate-400 border-b border-white/5 pb-4">
        <span className="tracking-widest uppercase">Question {currentIndex + 1} of {questions.length}</span>
        <button 
          onClick={logHintClick}
          className="flex items-center space-x-2 text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-full border border-amber-500/20"
        >
          <Lightbulb className="w-4 h-4" />
          <span>Need a Hint?</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full"
        >
          <div className="glass-panel p-10 shadow-2xl mb-10 w-full">
            <h2 className="text-2xl md:text-3xl text-white font-medium leading-relaxed mb-10">
              {currentQuestion.content}
            </h2>

            <div className="space-y-4">
              {options.map((opt: { id: string; text: string }) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div 
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center space-x-5 ${
                      isSelected 
                        ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                        : "bg-slate-950/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                      isSelected ? "border-blue-400 bg-blue-500/20" : "border-slate-600"
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />}
                    </div>
                    <span className={`text-lg ${isSelected ? "text-white" : "text-slate-300"}`}>{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
          className="flex items-center space-x-2 bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Transmitting...</span>
            </>
          ) : (
            <span>Submit Answer</span>
          )}
        </button>
      </div>
    </div>
  );
}
