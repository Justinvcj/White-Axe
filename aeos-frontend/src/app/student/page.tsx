"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Target, BookOpen, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { createClient } from "@/lib/supabase/client";

export default function StudentDashboard() {
  const [firstName, setFirstName] = useState<string>("Student");

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("first_name")
          .eq("id", user.id)
          .single();
        if (data?.first_name) {
          setFirstName(data.first_name);
        }
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 space-y-8 max-w-6xl mx-auto bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2rem] border border-blue-200 shadow-sm bg-blue-50 p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity className="w-64 h-64 text-blue-600" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-blue-900 mb-4">
            Welcome back, {firstName}!
          </h1>
          <p className="text-lg md:text-xl text-blue-700 mb-8 max-w-2xl font-medium">
            Your knowledge base is tracking at <span className="font-black text-blue-600">84.2%</span> mastery. 
            The AI engine is ready for your next adventure.
          </p>
          
          <Link href="/student/challenge">
            <button className="flex items-center justify-center space-x-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg w-full md:w-auto">
              <Zap className="w-6 h-6 text-yellow-300" />
              <span>Enter Challenge Arena</span>
            </button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link href="/student/revision" className="block group">
          <GlassCard className="h-full p-8 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 flex items-center justify-between">
              Daily Practice
              <ChevronRight className="w-6 h-6 text-orange-500 transform group-hover:translate-x-2 transition-transform" />
            </h3>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              You have 3 quick topics to review to keep your streak alive!
            </p>
          </GlassCard>
        </Link>

        <Link href="/student/assessment" className="block group">
          <GlassCard className="h-full p-8 border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3 flex items-center justify-between">
              Adaptive Assessments
              <ChevronRight className="w-6 h-6 text-emerald-500 transform group-hover:translate-x-2 transition-transform" />
            </h3>
            <p className="text-slate-600 text-lg font-medium leading-relaxed">
              Launch a smart assessment to test your current knowledge boundaries.
            </p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
