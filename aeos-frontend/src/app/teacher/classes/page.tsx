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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">My Classes</h1>
        <p className="text-slate-500 font-medium">Select a class to view the student roster and log hypotheses.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((c, i) => (
          <Link key={c.id} href={`/teacher/classes/${c.id}`} className="block group">
            <GlassCard 
              className="h-full p-6 border-blue-200 shadow-md hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{c.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{c.period}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                  <ArrowRight className="w-5 h-5 text-blue-500 group-hover:text-blue-700 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl font-medium">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{c.studentCount} Active Students</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl font-medium">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
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
