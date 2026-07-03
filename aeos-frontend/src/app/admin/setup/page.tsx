"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, Settings2, ShieldCheck, Lock } from "lucide-react";

export default function AdminSetupDashboard() {
  const stats = { teachers: 12, students: 340 };
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-accent/20 rounded-full mb-4 border border-accent/30">
            <Settings2 className="text-accent w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
            System Deployment & Onboarding
          </h1>
          <p className="text-muted-foreground text-lg mt-2">Initialize the academic year and sync management data.</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Year Plan Configuration */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Calendar className="text-primary" /> Year Plan
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Start Date</label>
                  <input type="date" className="w-full bg-background/50 border border-glass-border rounded-xl p-3 text-foreground" required />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">End Date</label>
                  <input type="date" className="w-full bg-background/50 border border-glass-border rounded-xl p-3 text-foreground" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Holidays (Comma separated dates)</label>
                <textarea 
                  placeholder="e.g. 2026-10-24, 2026-12-25"
                  className="w-full bg-background/50 border border-glass-border rounded-xl p-3 text-foreground min-h-[100px]"
                />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                {isSaved ? "Synced to Matrix ✓" : "Initialize Year Plan"}
              </button>
            </form>
          </motion.div>

          {/* Demo Lock & System Specs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="text-accent" /> Institutional Strength
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 p-6 rounded-2xl border border-glass-border text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">{stats.teachers}</div>
                  <div className="text-sm text-muted-foreground">Active Teachers</div>
                </div>
                <div className="bg-background/50 p-6 rounded-2xl border border-glass-border text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">{stats.students}</div>
                  <div className="text-sm text-muted-foreground">Enrolled Students</div>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 backdrop-blur-xl border border-destructive/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <Lock className="absolute top-[-20px] right-[-20px] w-40 h-40 text-destructive/5 rotate-12" />
              <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2 text-destructive">
                <ShieldCheck /> Demo Protocol Locked
              </h2>
              <p className="text-destructive-foreground/80 leading-relaxed relative z-10">
                Per management directive, the current deployment is strictly limited to <strong>8th Standard</strong> students covering only <strong>Mathematics</strong> and <strong>Physics</strong>. 
                <br/><br/>
                The Initial Test uniformity protocol is engaged: All baseline questions are locked to a mixed complexity spread (Easy/Medium/Hard) to ensure an unbiased AI compatibility score.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
