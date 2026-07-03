"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GraduationCap, MapPin, Sparkles, Edit2, Check, Lock, ChevronDown, Activity, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { HypothesisLogger } from "./hypothesis-logger";
import { StudentTier } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

export function StudentCard({ student, classId, activeTopicId }: { student: any, classId: string, activeTopicId: string }) {
  const [interest, setInterest] = useState(student.interest || "");
  const [isEditingInterest, setIsEditingInterest] = useState(!student.interest || student.interest === "Unknown");
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  
  // Phase 1 Lock logic
  const isPhase1Locked = true; // In the demo, we assume the teacher's hypothesis gets locked after initial entry.

  const handleSaveInterest = async () => {
    setIsSaving(true);
    const supabase = createClient();
    await supabase.from("student_profiles").update({ current_interest: interest }).eq("user_id", student.id);
    setIsEditingInterest(false);
    setIsSaving(false);
  };

  return (
    <GlassCard className="flex flex-col p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 flex flex-col sm:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-lg">{student.first_name?.[0] || ""}{student.last_name?.[0] || ""}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {student.first_name} {student.last_name}
                </h3>
                {student.isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" title="Completed Initial Assessment" />
                )}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  AI Score: {student.mastery}%
                </span>
                <span className="text-xs text-slate-400 font-medium">(Updates continuously)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6 sm:mb-0">
            {/* Area of Interest Editor */}
            <div className="flex items-center space-x-2 text-sm bg-orange-50 p-2 rounded-lg border border-orange-100">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-slate-600 font-medium">Interest:</span>
              {isEditingInterest ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input 
                    type="text" 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-orange-400"
                    placeholder="e.g. Space, Cricket..."
                  />
                  <button onClick={handleSaveInterest} disabled={isSaving} className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition shadow-sm">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 group">
                  <span className="text-slate-800 font-bold">{interest}</span>
                  <button onClick={() => setIsEditingInterest(true)} className="text-slate-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{student.currentGrade} • {student.subject}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 min-w-[220px]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-blue-600 uppercase tracking-widest font-bold">
                Teacher Hypothesis
              </p>
              {isPhase1Locked && <Lock className="w-3 h-3 text-slate-400" title="Locked until end of week" />}
            </div>
            <HypothesisLogger 
              studentId={student.id}
              classId={classId}
              topicId={activeTopicId}
              initialTier={student.initialTier as StudentTier}
            />
            {isPhase1Locked && <p className="text-[10px] text-slate-400 mt-2">Locked for Phase 1. Unlocks at End of Week.</p>}
          </div>
          
          <button 
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className="mt-4 flex items-center justify-center space-x-1.5 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>View Granular Analytics</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAnalyticsOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Analytics Expandable Drawer */}
      {isAnalyticsOpen && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 animate-in slide-in-from-top-4">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center">
            <BookOpen className="w-4 h-4 text-blue-500 mr-2" /> 
            Module Performance Breakdown
          </h4>
          
          {student.granularStats && student.granularStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {student.granularStats.map((stat: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-600 font-medium">{stat.day}</span>
                    <span className={`font-bold ${stat.score >= 80 ? 'text-emerald-600' : stat.score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {stat.score}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
                <h5 className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  Identified Weak Area
                </h5>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  Struggling with <span className="font-bold text-rose-600">
                    {student.granularStats[student.granularStats.length - 1]?.weak_area || "General Concepts"}
                  </span>.
                </p>
                <p className="text-xs text-slate-500 mt-3 p-2 bg-slate-50 rounded border border-slate-100">
                  AI recommends intervention using {interest ? `"${interest}"` : "personalized"} examples.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 bg-white border border-slate-200 rounded-xl border-dashed">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No granular performance data generated yet.</p>
              <p className="text-xs mt-1">Student must complete further assessments.</p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}
