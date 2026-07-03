"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, Send, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";

// Mock Data for the Teacher vs AI Point System
const MOCK_TEACHERS = [
  { id: "t1", name: "Mrs. Sharma", subject: "Physics", grade: 8, teacherPoints: 45, aiPoints: 5 },
  { id: "t2", name: "Mr. Anderson", subject: "Mathematics", grade: 8, teacherPoints: 12, aiPoints: 38 },
  { id: "t3", name: "Ms. Gupta", subject: "Physics", grade: 8, teacherPoints: 22, aiPoints: 20 },
];

export default function AdminTeachersDashboard() {
  const [mailing, setMailing] = useState<string | null>(null);

  const handleMailAlert = (teacherId: string) => {
    setMailing(teacherId);
    setTimeout(() => {
      setMailing(null);
      alert("Performance email successfully dispatched to Management and Teacher.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4 border border-primary/30">
              <Users className="text-primary w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Educator Matrix
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Live telemetry of Teacher vs AI Compatibility Scoring.</p>
          </div>
        </motion.header>

        <div className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border text-muted-foreground">
                <th className="p-4 font-semibold">Educator</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold text-center">Teacher Points</th>
                <th className="p-4 font-semibold text-center">AI Points</th>
                <th className="p-4 font-semibold text-center">Compatibility Trend</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {MOCK_TEACHERS.map((teacher, idx) => {
                  const isLowCompatibility = teacher.aiPoints > teacher.teacherPoints;
                  return (
                    <motion.tr 
                      key={teacher.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border-b border-glass-border/50 hover:bg-glass transition-colors"
                    >
                      <td className="p-4 font-medium text-foreground text-lg">{teacher.name}</td>
                      <td className="p-4 text-muted-foreground">Class {teacher.grade} {teacher.subject}</td>
                      
                      <td className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-lg font-bold border border-primary/30">
                          {teacher.teacherPoints}
                        </span>
                      </td>
                      
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg font-bold border ${isLowCompatibility ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-accent/20 text-accent border-accent/30'}`}>
                          {teacher.aiPoints}
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex justify-center">
                          {isLowCompatibility ? (
                            <div className="flex items-center gap-2 text-destructive font-semibold bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                              <TrendingDown size={16} /> Needs Work
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-primary font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                              <TrendingUp size={16} /> Aligned
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-4 text-right">
                        {isLowCompatibility ? (
                          <button 
                            onClick={() => handleMailAlert(teacher.id)}
                            disabled={mailing === teacher.id}
                            className="bg-background border border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-end gap-2 ml-auto"
                          >
                            {mailing === teacher.id ? (
                              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Send size={16} />
                              </motion.div>
                            ) : (
                              <><AlertTriangle size={16} /> Alert Management</>
                            )}
                          </button>
                        ) : (
                          <div className="text-muted-foreground flex items-center justify-end gap-1">
                            <CheckCircle2 size={16} className="text-primary" /> Stable
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
