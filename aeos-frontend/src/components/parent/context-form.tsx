"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface ContextFormProps {
  studentId: string;
}

export function ContextForm({ studentId }: ContextFormProps) {
  const [interests, setInterests] = useState("");
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i.length > 0);

      // Using 'any' cast for the payload to safely slip stress_level into a dynamic or ignored column
      // if it wasn't strictly defined in the initial strict relational scaffold.
      const payload: Record<string, unknown> = {
        parent_id: user.id,
        student_id: studentId,
        reported_interests: interestsArray,
        stress_level: stressLevel 
      };

      const { error } = await supabase.from("parent_feedbacks").insert(payload);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setInterests("");
    } catch (err) {
      console.error("Failed to submit feedback", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="relative overflow-hidden border-purple-500/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-500" />
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
          AI Context Sync
        </h3>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
          Tell the AI about your child&apos;s current interests. The Contextual Personalization Engine (CPE) will automatically rewrite upcoming assessments to match these themes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Current Interests & Hobbies
          </label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g. Cricket, Anime, Space exploration..."
            className="w-full bg-slate-950/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-inner"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
            <span>Observed Stress Level</span>
            <span className="text-purple-400 font-bold">{stressLevel} / 10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>Relaxed (1)</span>
            <span>Overwhelmed (10)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 bg-white text-black px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Context Synced to Matrix</span>
            </>
          ) : (
            <span>Update AI Parameters</span>
          )}
        </button>
      </form>
    </GlassCard>
  );
}
