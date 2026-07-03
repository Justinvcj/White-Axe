"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

// Mock Data for Phase 1 MVP
const MOCK_CLASSES = [
  { id: "1", name: "Physics 101 - Section A", grade: 10, students: 32 },
  { id: "2", name: "Physics 101 - Section B", grade: 10, students: 30 },
];

const MOCK_TOPICS = [
  { id: "t1", name: "Kinematics", timeAllocated: "120 mins", completed: true },
  { id: "t2", name: "Newton's Laws", timeAllocated: "160 mins", completed: false, current: true },
  { id: "t3", name: "Work & Energy", timeAllocated: "120 mins", completed: false },
];

const MOCK_STUDENTS = [
  { id: "s1", name: "Aarav Patel", currentTier: null },
  { id: "s2", name: "Diya Sharma", currentTier: "C1" },
  { id: "s3", name: "Rohan Kumar", currentTier: "C3" },
  { id: "s4", name: "Ananya Singh", currentTier: null },
];

export default function TeacherDashboard() {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0]);
  const [studentTiers, setStudentTiers] = useState<Record<string, string>>({});

  const handleTierChange = (studentId: string, tier: string) => {
    setStudentTiers(prev => ({ ...prev, [studentId]: tier }));
  };

  const submitAssumptions = async () => {
    // In production, this would call the AEOS AI Core BAM-E endpoint
    alert("Assumptions submitted to BAM-E. Generating Initial Test...");
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Welcome back. Let&apos;s calibrate your classes.</p>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Classes & Topics */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Classes Widget */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/50 backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="text-primary" size={20} /> My Classes
              </h2>
              <div className="space-y-3">
                {MOCK_CLASSES.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                      selectedClass.id === cls.id 
                      ? "bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                      : "bg-background/50 hover:bg-background"
                    } border border-glass-border`}
                  >
                    <div className="font-medium text-foreground">{cls.name}</div>
                    <div className="text-sm text-muted-foreground">{cls.students} Students</div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Topic Timeline Widget */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/50 backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="text-accent" size={20} /> Syllabus Timeline
              </h2>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {MOCK_TOPICS.map((topic) => (
                  <div key={topic.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl ${topic.completed ? 'bg-primary' : topic.current ? 'bg-accent' : 'bg-muted'}`}>
                      {topic.completed ? <CheckCircle2 size={16} className="text-primary-foreground"/> : <div className="w-2 h-2 rounded-full bg-background" />}
                    </div>
                    <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-glass-border backdrop-blur-sm ${topic.current ? 'bg-accent/10 border-accent' : 'bg-background/50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${topic.current ? 'text-accent' : 'text-foreground'}`}>{topic.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} /> {topic.timeAllocated}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Assumption Matrix */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-card/50 backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertCircle className="text-primary" /> Assumption Matrix
                </h2>
                <p className="text-muted-foreground mt-1">
                  Active Topic: <span className="text-accent font-medium">Newton&apos;s Laws</span>
                </p>
              </div>
              <button 
                onClick={submitAssumptions}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(100,50,255,0.4)]"
              >
                Submit Calibration
              </button>
            </div>

            <div className="bg-background/40 rounded-2xl border border-glass-border overflow-hidden flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="p-4 font-semibold text-muted-foreground">Student Name</th>
                    <th className="p-4 font-semibold text-muted-foreground text-center">Observed Tier</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {MOCK_STUDENTS.map((student) => (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-glass-border/50 hover:bg-glass"
                      >
                        <td className="p-4 font-medium text-foreground">{student.name}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            {["C1", "C2", "C3"].map(tier => (
                              <button
                                key={tier}
                                onClick={() => handleTierChange(student.id, tier)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                  studentTiers[student.id] === tier 
                                  ? tier === 'C1' ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary),0.5)]' 
                                  : tier === 'C3' ? 'bg-destructive text-destructive-foreground shadow-[0_0_10px_rgba(var(--destructive),0.5)]'
                                  : 'bg-accent text-accent-foreground shadow-[0_0_10px_rgba(var(--accent),0.5)]'
                                  : 'bg-background border border-glass-border hover:bg-muted text-muted-foreground'
                                }`}
                              >
                                {tier}
                                <span className="block text-[10px] font-normal opacity-70">
                                  {tier === 'C1' ? 'Bored' : tier === 'C2' ? 'Unsure' : 'Struggling'}
                               </span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
