"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StudentTier } from "@/lib/types/database";
import { cn } from "@/lib/utils";

interface HypothesisLoggerProps {
  studentId: string;
  classId: string;
  topicId: string;
  initialTier?: StudentTier | null;
  isLocked?: boolean;
}

export function HypothesisLogger({ studentId, classId: _classId, topicId, initialTier, isLocked = false }: HypothesisLoggerProps) {
  const [activeTier, setActiveTier] = useState<StudentTier | null>(initialTier || null);
  const [isLoading, setIsLoading] = useState<StudentTier | null>(null);
  const [successStatus, setSuccessStatus] = useState(false);
  const supabase = createClient();

  const handleUpdate = async (tier: StudentTier) => {
    if (isLocked) return;
    
    setIsLoading(tier);
    setSuccessStatus(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // We save the observation directly into student_profiles to avoid missing table errors!
      const { error } = await supabase.from("student_profiles").update({
        current_tier: tier,
      }).eq("user_id", studentId);
      
      if (error) throw error;
      
      setActiveTier(tier);
      setSuccessStatus(true);
      setTimeout(() => setSuccessStatus(false), 2000);
    } catch (err) {
      console.error("Failed to update observation", err);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={`flex items-center space-x-1.5 p-1.5 rounded-full border w-max shadow-inner ${isLocked ? "bg-slate-50 border-slate-200 opacity-80" : "bg-slate-100 border-slate-200"}`}>
      {(['C1', 'C2', 'C3'] as StudentTier[]).map((tier) => {
        const isActive = activeTier === tier;
        const isCurrentlyLoading = isLoading === tier;

        let activeColor = "";
        let label = "";
        if (tier === 'C1') { activeColor = "bg-teal-500 text-white shadow-md border-teal-600"; label = "C1"; }
        if (tier === 'C2') { activeColor = "bg-blue-500 text-white shadow-md border-blue-600"; label = "C2"; }
        if (tier === 'C3') { activeColor = "bg-amber-500 text-white shadow-md border-amber-600"; label = "C3"; }

        return (
          <button
            key={tier}
            onClick={() => handleUpdate(tier)}
            disabled={isLoading !== null || isLocked}
            className={cn(
              "relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border border-transparent",
              isActive ? activeColor : "text-slate-500 hover:text-slate-700 hover:bg-slate-200 bg-white shadow-sm border-slate-200",
              (isCurrentlyLoading || isLocked) ? "cursor-not-allowed" : "",
              isCurrentlyLoading ? "opacity-70" : ""
            )}
          >
            {isCurrentlyLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{label}</span>
            )}
          </button>
        );
      })}
      
      {successStatus && (
        <span className="text-green-600 pl-2 pr-2 animate-in fade-in zoom-in duration-300 font-bold">
          ✓
        </span>
      )}
    </div>
  );
}
