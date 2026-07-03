import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, BookOpen, ArrowRight } from "lucide-react";

export default function ClassesIndexPage() {
  const mockClasses = [
    {
      id: "physics-101",
      name: "AP Physics C: Mechanics",
      period: "Period 1",
      studentCount: 32,
      activeTopic: "Introduction to Kinematics"
    },
    {
      id: "calc-201",
      name: "AP Calculus BC",
      period: "Period 3",
      studentCount: 28,
      activeTopic: "Limits and Continuity"
    },
    {
      id: "physics-102",
      name: "Honors Physics",
      period: "Period 5",
      studentCount: 25,
      activeTopic: "Newton's Laws of Motion"
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Classes</h1>
        <p className="text-slate-400">Select a class to view the student roster and log hypotheses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((c, i) => (
          <Link key={c.id} href={`/teacher/classes/${c.id}`} className="block group">
            <GlassCard 
              className="h-full p-6 border-white/5 hover:border-emerald-500/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{c.name}</h3>
                  <p className="text-sm text-slate-400">{c.period}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-500 transition-all transform -translate-x-2 group-hover:translate-x-0" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>{c.studentCount} Active Students</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span className="truncate">Current: {c.activeTopic}</span>
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
