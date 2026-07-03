"use client";

import { motion } from "framer-motion";
import { ShieldAlert, GraduationCap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function ParentDashboard() {
  return (
    <div className="flex flex-col min-h-screen p-8 space-y-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6 border-b border-slate-800"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Parent Portal</h1>
        <p className="text-blue-400">Real-time structural knowledge tracking for your child.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <GraduationCap className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Overall Mastery</h2>
              <p className="text-indigo-400 font-mono">BAM-E Calculated</p>
            </div>
          </div>
          <div className="text-6xl font-black text-white tracking-tighter mb-4">
            84.2<span className="text-3xl text-slate-500">%</span>
          </div>
          <p className="text-slate-400">
            Structural integrity is holding steady. No immediate intervention required.
          </p>
        </GlassCard>

        <GlassCard className="p-8 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">C3 Risk Alerts</h2>
              <p className="text-amber-400 font-mono">Predictive Warning System</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-300">Calculus: Integration Limits</span>
                <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded">Moderate Risk</span>
              </div>
              <p className="text-sm text-slate-400">Retention dropping below baseline. Revision scheduled for today.</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
