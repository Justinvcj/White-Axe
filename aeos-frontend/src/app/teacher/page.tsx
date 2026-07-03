"use client";

import { motion } from "framer-motion";
import { Users, Activity, BrainCircuit, Sparkles, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Teacher Console</h1>
          <p className="text-blue-600 font-bold bg-blue-100 inline-block px-3 py-1 rounded-full text-sm">
            AI Insights & Student Progress Active
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/teacher/classes" className="block group">
          <GlassCard className="h-full p-8 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 flex items-center justify-between">
              My Class Roster
              <ArrowRight className="w-6 h-6 text-emerald-500 transform group-hover:translate-x-2 transition-transform" />
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              View your students, input their Areas of Interest, and securely lock in your Initial C1/C2/C3 Assessment Hypotheses.
            </p>
          </GlassCard>
        </Link>

        <Link href="/teacher/analytics" className="block group">
          <GlassCard className="h-full p-8 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 flex items-center justify-between">
              Student Needs Analysis
              <ArrowRight className="w-6 h-6 text-blue-500 transform group-hover:translate-x-2 transition-transform" />
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Review continuous AI insights, compare your Hypotheses against actual AI results, and identify critical knowledge gaps.
            </p>
          </GlassCard>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <GlassCard className="p-8 border-slate-200 bg-white">
          <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-slate-100">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Sparkles className="text-amber-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">System Intelligence Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors">
              <span className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-xs">Active Students</span>
              <span className="text-4xl text-slate-800 font-black">10</span>
            </div>
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 flex flex-col justify-center items-center text-center hover:bg-rose-100 transition-colors">
              <span className="text-rose-600 font-bold mb-2 uppercase tracking-wider text-xs">Interventions Needed</span>
              <span className="text-4xl text-rose-500 font-black">2</span>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col justify-center items-center text-center hover:bg-blue-100 transition-colors">
              <span className="text-blue-600 font-bold mb-2 uppercase tracking-wider text-xs">Global Mastery</span>
              <span className="text-4xl text-blue-500 font-black">78%</span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
