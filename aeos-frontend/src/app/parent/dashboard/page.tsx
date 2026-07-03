"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Target, Gamepad2, Sparkles, CheckCircle2 } from "lucide-react";

const MOCK_STUDENT = {
  name: "Diya Sharma",
  grade: 10,
  recentTopic: "Newton's Laws",
  performanceStatus: "Needs Engagement", // E.g., C3 or bored C1
};

export default function ParentDashboard() {
  const [interest, setInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest.trim()) return;
    
    setIsSubmitting(true);
    // Mocking an API call to Supabase to insert into `parent_feedbacks`
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Soft glowing orbs for the background */}
      <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full relative z-10 space-y-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4 border border-primary/30">
            <Heart className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Parent Portal</h1>
          <p className="text-muted-foreground text-lg">Partnering to unlock {MOCK_STUDENT.name}&apos;s full potential.</p>
        </motion.div>

        {/* Student Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Current Snapshot</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-2xl border border-glass-border">
                <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Activity size={16} /> Active Topic
                </div>
                <div className="font-medium text-lg text-primary">{MOCK_STUDENT.recentTopic}</div>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-glass-border">
                <div className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                  <Target size={16} /> Status
                </div>
                <div className="font-medium text-lg text-accent">{MOCK_STUDENT.performanceStatus}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Intervention / Interest Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-card/60 to-background/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(var(--primary),0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                onSubmit={handleSubmit}
                className="relative z-10"
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Gamepad2 className="text-accent" /> Contextual Personalization
                </h2>
                <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed">
                  We&apos;ve noticed Diya might be distracted or disengaged lately. White-Axe can customize her learning materials to bridge the gap. What is she currently obsessed with? (e.g., Cricket, K-Pop, Football, Video Games)
                </p>

                <div className="space-y-6">
                  <div>
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      placeholder="e.g. MS Dhoni, Minecraft, Formula 1..."
                      className="w-full bg-background/60 border border-glass-border rounded-xl p-4 text-lg text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !interest.trim()}
                    className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary),0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Sparkles />
                      </motion.div>
                    ) : (
                      "Apply Contextual Engine"
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 relative z-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Learning Context Updated!</h2>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Our AI engines are now recalculating Diya&apos;s matrix. Her upcoming assessments for {MOCK_STUDENT.recentTopic} will automatically incorporate <span className="text-accent font-bold">&quot;{interest}&quot;</span> to maximize engagement!
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setInterest(""); }}
                  className="mt-8 text-primary hover:text-accent underline transition-colors"
                >
                  Add another interest
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}
