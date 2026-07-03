"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { OverviewStats } from "@/app/actions/admin-analytics";

interface OverviewCardsProps {
  stats: OverviewStats;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
};

export function OverviewCards({ stats }: OverviewCardsProps) {
  const cards = [
    { label: "Total Active Students", value: stats.totalStudents, icon: Users, color: "text-blue-400", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.1)]" },
    { label: "Active Class Modules", value: stats.totalClasses, icon: BookOpen, color: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]" },
    { label: "Average School Mastery", value: `${stats.averageMastery}%`, icon: TrendingUp, color: "text-amber-400", border: "border-amber-500/20", glow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]" },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div key={idx} variants={itemVariants} className="h-full">
            <GlassCard className={`h-full flex items-center p-6 ${card.border} ${card.glow} hover:bg-slate-800/60 transition-all duration-300 transform hover:-translate-y-1`}>
              <div className="w-14 h-14 rounded-xl bg-slate-950/80 flex items-center justify-center mr-6 border border-white/5 shadow-inner">
                <Icon className={`w-7 h-7 ${card.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{card.label}</p>
                <p className="text-3xl font-black text-white tracking-tight">{card.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
