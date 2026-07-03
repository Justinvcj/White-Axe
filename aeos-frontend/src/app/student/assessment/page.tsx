import Link from "next/link";
import { GlassCard } from "@/components/ui/glass-card";
import { BookOpen, ArrowRight, Brain, Activity } from "lucide-react";

export default function AssessmentIndexPage() {
  const mockAssessments = [
    {
      id: "physics-101",
      name: "Physics: Kinematics & Dynamics",
      difficulty: "Advanced",
      questions: 15,
      type: "Adaptive Assessment"
    },
    {
      id: "math-201",
      name: "Calculus: Limits & Derivatives",
      difficulty: "Intermediate",
      questions: 12,
      type: "Adaptive Assessment"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="mb-4">
          <Link href="/student" className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
            &larr; Back to Grid
          </Link>
        </div>

        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Adaptive Assessments</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Select a module below to launch a dynamically generated assessment. The AI matrix will scale difficulty in real-time based on your responses.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAssessments.map((assessment, i) => (
            <Link key={assessment.id} href={`/student/assessment/${assessment.id}`} className="block group">
              <GlassCard 
                className="h-full p-8 border-white/5 hover:border-blue-500/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 fill-mode-both"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{assessment.name}</h3>
                    <p className="text-sm font-bold text-blue-500 uppercase tracking-wider">{assessment.type}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                </div>
                
                <div className="flex items-center space-x-6 mt-8">
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Activity className="w-4 h-4 text-slate-500" />
                    <span>{assessment.difficulty} Node</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-300">
                    <Brain className="w-4 h-4 text-slate-500" />
                    <span>{assessment.questions} Queries</span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
