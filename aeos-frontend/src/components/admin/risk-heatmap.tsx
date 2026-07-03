"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { RiskClass } from "@/app/actions/admin-analytics";
import { AlertTriangle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskHeatmapProps {
  classes: RiskClass[];
}

export function RiskHeatmap({ classes }: RiskHeatmapProps) {
  return (
    <GlassCard className="h-full flex flex-col border-white/10 relative overflow-hidden shadow-2xl">
      {/* Predictive Risk Alert Engine Pulse */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 animate-pulse" />
      
      <div className="p-6 border-b border-rose-500/20 bg-rose-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <AlertTriangle className="w-5 h-5 mr-3 text-rose-400" />
          Structural Risk Heatmap
        </h3>
        <span className="flex items-center text-[10px] text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full font-bold border border-rose-500/20 w-fit">
          <Activity className="w-3.5 h-3.5 mr-2 animate-pulse" />
          Predictive Vectors Active
        </span>
      </div>

      <div className="p-6 space-y-8">
        {classes.map((c, idx) => (
          <motion.div 
            key={c.class_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="flex flex-col group"
          >
            <div className="flex justify-between items-end mb-3">
              <span className="text-slate-200 font-bold group-hover:text-white transition-colors">{c.class_name}</span>
              <div className="text-right">
                <span className={cn(
                  "text-2xl font-black",
                  c.c3_density_percentage > 30 ? "text-rose-400" : "text-amber-400"
                )}>
                  {c.c3_density_percentage}%
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest ml-2 font-bold">C3 Density</span>
              </div>
            </div>
            
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden shadow-inner border border-white/5">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  c.c3_density_percentage > 30 ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.7)]" : "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.7)]"
                )}
                style={{ width: `${c.c3_density_percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 font-semibold uppercase tracking-wider">
              <span className="text-white font-bold">{c.total_c3_students}</span> students critically below structural thresholds
            </p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
