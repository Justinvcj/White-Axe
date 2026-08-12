"use client";

import { useState } from "react";
import Link from "next/link";
import { ActionPlanView } from "@/components/teacher/action-plan-view";
import { Loader2, Zap } from "lucide-react";
import { use } from "react";

export default function PlannerPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, these counts would come from the database/state.
      // For the demo, we simulate a class distribution.
      const payload = {
        topic: "Structural Foundations & Kinematics",
        c1_count: 5,
        c2_count: 12,
        c3_count: 8
      };

      const res = await fetch("/api/ai/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await res.json();
      setPlan(data.data);
    } catch (error) {
      console.error(error);
      alert("Error generating action plan. Ensure JarvisLabs AI Core is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8">
      <div className="mb-2">
        <Link href={`/teacher/classes/${classId}`} className="text-blue-500 hover:text-blue-600 text-sm font-bold transition-colors">
          &larr; Back to Roster
        </Link>
      </div>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Lesson Planner</h1>
          <p className="text-slate-500 max-w-2xl font-medium">Generate a differentiated 40-minute action plan based on your classroom's current cognitive mastery.</p>
        </div>
        
        <button 
          onClick={generatePlan}
          disabled={isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Synthesizing Plan...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Generate 40-Min Plan
            </>
          )}
        </button>
      </header>

      {plan ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ActionPlanView plan={plan} classId={classId} />
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Plan Generated</h3>
          <p className="text-slate-500 max-w-md">Click the button above to synthesize a highly actionable lesson plan tailored to your students.</p>
        </div>
      )}
    </div>
  );
}
