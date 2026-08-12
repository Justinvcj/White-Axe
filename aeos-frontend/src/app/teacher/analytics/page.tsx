"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Activity, AlertTriangle, ShieldAlert, TrendingDown, BookOpen, Loader2, Network } from "lucide-react";
import Link from "next/link";

export default function PredictiveRiskDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [riskData, setRiskData] = useState<any>(null);

  useEffect(() => {
    const fetchRiskProfile = async () => {
      try {
        const res = await fetch("/api/ai/predictive", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ class_id: "class-123" }) // Mock class ID
        });
        if (res.ok) {
          const result = await res.json();
          setRiskData(result.data);
        }
      } catch (e) {
        console.error("Failed to calculate risk", e);
      } finally {
        setIsAnalyzing(false);
      }
    };
    fetchRiskProfile();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-2">
        <Link href="/teacher" className="text-blue-500 hover:text-blue-600 text-sm font-bold transition-colors">
          &larr; Back to Console
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3 flex items-center">
          <div className="bg-blue-100 p-3 rounded-2xl mr-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          Student Needs Analysis
        </h1>
        <p className="text-slate-500 max-w-2xl font-medium text-lg leading-relaxed">
          Real-time AI calculations identifying structural knowledge gaps before they propagate into future modules.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[40vh]"
          >
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="w-20 h-20 mb-6 bg-slate-100 rounded-full flex items-center justify-center shadow-inner border border-slate-200"
            >
              <Network className="w-10 h-10 text-blue-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Traversing Directed Acyclic Graph...</h2>
            <p className="text-slate-500 font-medium max-w-sm text-center">
              Calculating cascading failure probabilities across the curriculum structure based on observed C3 gaps.
            </p>
          </motion.div>
        ) : riskData ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <GlassCard className="p-8 border-blue-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Global Class Risk</p>
                    <h2 className="text-4xl font-black text-slate-800">{riskData.globalRisk}</h2>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <TrendingDown className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-500 bg-emerald-50 inline-block px-3 py-1 rounded-full">{riskData.riskTrend} from last week</p>
              </GlassCard>

              <GlassCard className="p-8 border-rose-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Critical Trajectories</p>
                    <h2 className="text-4xl font-black text-rose-500">{riskData.criticalTrajectories} Students</h2>
                  </div>
                  <div className="bg-rose-100 p-3 rounded-2xl">
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <p className="text-sm font-bold text-rose-600 bg-rose-50 inline-block px-3 py-1 rounded-full">Immediate intervention recommended</p>
              </GlassCard>

              <GlassCard className="p-8 border-amber-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-1">Hypothesis Accuracy</p>
                    <h2 className="text-4xl font-black text-amber-500">{riskData.hypothesisAccuracy}</h2>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-2xl">
                    <BookOpen className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-sm font-bold text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full">Your observations match AI</p>
              </GlassCard>
            </div>

            {/* Critical Action List */}
            <GlassCard className="p-0 border-rose-200 overflow-hidden shadow-lg shadow-rose-100">
              <div className="p-6 border-b border-rose-100 bg-rose-50 flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
                <h2 className="text-xl font-black text-slate-800">Intervention Queue</h2>
              </div>
              
              <div className="divide-y divide-slate-100 bg-white">
                {riskData.highRiskStudents.map((student: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 mb-6 md:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-600 font-bold">{student.name.charAt(0)}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-600">
                          {student.class}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm bg-rose-50 border border-rose-100 px-4 py-2 rounded-lg inline-flex">
                        <span className="text-slate-600 font-semibold">Predicted Gap (Cascade):</span>
                        <span className="text-rose-600 font-black">{student.primaryGap}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0 w-full sm:w-auto">
                      <div className="text-center sm:text-right w-full sm:w-auto">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Failure Probability</p>
                        <p className="text-3xl font-black text-rose-500">{student.riskScore}%</p>
                      </div>
                      <button className="w-full sm:w-auto px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-black transition-all shadow-md shadow-rose-200 hover:shadow-lg hover:-translate-y-1">
                        Deploy Remediation
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
