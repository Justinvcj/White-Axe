"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, BrainCircuit, Activity, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface RevisionItem {
  topic_id: string;
  topic_name: string;
  retention_score: number;
  days_since_test: number;
}

interface RevisionQueueProps {
  queue: RevisionItem[];
}

export function RevisionQueue({ queue }: RevisionQueueProps) {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);

  if (queue.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center justify-center p-12 text-center border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
          <Sparkles className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Knowledge Base Locked</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Your structural retention is fully optimized. There are no spaced-repetition gaps detected for today.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <BrainCircuit className="w-5 h-5 mr-3 text-blue-400" />
          Active Spaced Repetition Queue
        </h3>
        <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/20 shadow-inner">
          {queue.length} Modules Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {queue.map((item, idx) => (
            <motion.div
              key={item.topic_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="h-full"
            >
              {activeQuiz === item.topic_id ? (
                <GlassCard className="h-full border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-center items-center p-8">
                  <Activity className="w-10 h-10 text-blue-400 animate-pulse mb-4" />
                  <p className="text-white font-bold text-center tracking-wide">Neural Sync Initiated...</p>
                  <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Loading micro-assessment</p>
                </GlassCard>
              ) : (
                <GlassCard className="h-full flex flex-col justify-between group hover:border-blue-500/30 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-white font-bold text-lg leading-tight pr-4">{item.topic_name}</h4>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className={cn(
                          "text-2xl font-black",
                          item.retention_score < 60 ? "text-rose-400" : "text-amber-400"
                        )}>
                          {item.retention_score}%
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-1">Retention</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-900 rounded-full h-2 mb-6 overflow-hidden shadow-inner">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000 ease-out",
                          item.retention_score < 60 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        )}
                        style={{ width: `${item.retention_score}%` }}
                      />
                    </div>
                    
                    <p className="text-xs text-slate-400 flex items-center mb-8 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      Last reviewed {item.days_since_test} days ago
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveQuiz(item.topic_id)}
                    className="w-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-3.5 rounded-xl text-sm font-bold border border-blue-500/20 transition-all flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transform group-hover:translate-y-[-2px]"
                  >
                    Launch 2-Min Quick Quiz
                  </button>
                </GlassCard>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
