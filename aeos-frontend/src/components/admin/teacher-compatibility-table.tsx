"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { CompatibilityRanking } from "@/app/actions/admin-analytics";
import { cn } from "@/lib/utils";
import { UserCheck } from "lucide-react";

interface TeacherCompatibilityTableProps {
  rankings: CompatibilityRanking[];
}

export function TeacherCompatibilityTable({ rankings }: TeacherCompatibilityTableProps) {
  return (
    <GlassCard className="overflow-hidden flex flex-col h-full border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
        <h3 className="text-lg font-bold text-white flex items-center">
          <UserCheck className="w-5 h-5 mr-3 text-emerald-400" />
          Teacher Compatibility Engine
        </h3>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold bg-slate-800 px-3 py-1 rounded-full border border-white/5">
          BAM-E Validation Running
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="p-5 font-bold">Educator</th>
              <th className="p-5 font-bold text-center">Compatibility Score</th>
              <th className="p-5 font-bold text-center">False Positives</th>
              <th className="p-5 font-bold text-center">False Negatives</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((t, idx) => (
              <motion.tr 
                key={t.teacher_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-white/5 last:border-none hover:bg-slate-800/40 transition-colors"
              >
                <td className="p-5 font-bold text-slate-200">{t.teacher_name}</td>
                <td className="p-5 text-center">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold border shadow-inner",
                    t.accuracy_percentage >= 85 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                    t.accuracy_percentage >= 75 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                    "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  )}>
                    {t.accuracy_percentage}%
                  </span>
                </td>
                <td className="p-5 text-center text-slate-400 font-medium">{t.false_positives}</td>
                <td className="p-5 text-center text-slate-400 font-medium">{t.false_negatives}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
