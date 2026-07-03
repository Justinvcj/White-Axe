"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SubmitPhaseOneProps {
  classId: string;
  students: any[];
  isSubmitted: boolean;
  isReady: boolean;
}

export function SubmitPhaseOne({ classId, students, isSubmitted, isReady }: SubmitPhaseOneProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // For each student, calculate the AI final tier based on mastery
      for (const student of students) {
        // AI Logic Engine: 
        // 80+ = C1 (Advanced)
        // 60-79 = C2 (Intermediate)
        // <60 = C3 (Needs Help)
        let aiTier = "C3";
        if (student.mastery >= 80) aiTier = "C1";
        else if (student.mastery >= 60) aiTier = "C2";

        const currentStats = student.granularStats || [];
        const resultRecord = {
          type: "phase1_result",
          teacher_hypothesis: student.initialTier || "None",
          ai_evaluation: aiTier,
          final_tier: aiTier // AI overrides for Phase 1
        };

        const newStats = [...currentStats, resultRecord];

        await supabase
          .from("student_profiles")
          .update({ granular_performance: newStats })
          .eq("user_id", student.id);
      }

      router.refresh(); // Reload the page to reflect the locked state
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 px-6 py-4 rounded-xl flex items-center space-x-4 shadow-sm mt-4">
        <div className="bg-emerald-100 p-2 rounded-full">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-emerald-800">Phase 1 AI Analysis Complete</h3>
          <p className="text-sm text-emerald-600 font-medium">Teacher hypotheses have been compared against the AI engine. Results are locked for this module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm mt-4">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-2 rounded-full">
          <BrainCircuit className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900">Run AI Comparison Engine</h3>
          <p className="text-sm text-blue-700 font-medium">
            {isReady 
              ? "All students have completed the assessment. Ready to analyze!" 
              : "Waiting for all students to complete the initial assessment."}
          </p>
        </div>
      </div>
      <button
        disabled={!isReady || isSubmitting}
        onClick={handleSubmit}
        className={`px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center space-x-2 ${
          isReady && !isSubmitting
            ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
        <span>{isSubmitting ? "Analyzing..." : "Submit & Compare"}</span>
      </button>
    </div>
  );
}
