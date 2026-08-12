"use client";

import { useEffect, useState } from "react";
import { ActionPlanView } from "@/components/teacher/action-plan-view";

// In a real app, we would fetch the saved plan from the DB based on an ID.
// For the demo, we quickly fetch a fallback plan from the AI to ensure the print view works.
export default function PrintPlanPage({ params }: { params: Promise<{ classId: string }> }) {
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    // Generate a quick fallback if navigating here directly
    const loadPlan = async () => {
      try {
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

        const data = await res.json();
        setPlan(data.data);
        
        // Auto-print when loaded
        setTimeout(() => window.print(), 1000);
      } catch (error) {
        console.error("Failed to load plan for printing", error);
      }
    };
    
    loadPlan();
  }, []);

  if (!plan) return <div className="p-8 text-center text-slate-500">Preparing document for print...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white print:p-0">
      <div className="print:hidden mb-8 text-center bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200">
        <p className="font-bold">This page is optimized for printing.</p>
        <p className="text-sm mt-1">Press Ctrl+P (or Cmd+P) to print if the dialog didn't open automatically.</p>
      </div>
      
      {/* Hide the "Print Plan" button in the ActionPlanView by wrapping it and using CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          button { display: none !important; }
        }
      `}} />
      
      <ActionPlanView plan={plan} classId={"print"} />
    </div>
  );
}
