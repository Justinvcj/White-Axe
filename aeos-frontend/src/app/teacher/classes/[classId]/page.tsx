import { BrainCircuit } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StudentCard } from "@/components/teacher/student-card";

export default async function ClassRosterPage({ params }: { params: Promise<{ classId: string }> }) {
  const resolvedParams = await params;
  const { classId } = resolvedParams;
  const supabase = await createClient();
  
  // Format class name from ID for UI purposes
  const formattedClassName = classId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Mock Active Topic for the Roster View
  const activeTopic = {
    id: "00000000-0000-0000-0000-000000000000",
    name: "Structural Foundations & Kinematics"
  };

  // Fetch real students from the database - STRICTLY LIMIT 10
  const { data: dbStudents } = await supabase
    .from("users")
    .select(`
      id, first_name, last_name,
      student_profiles (
        current_tier,
        overall_mastery_score,
        current_interest
      )
    `)
    .eq("role", "student")
    .order("first_name", { ascending: true })
    .limit(10);

  const students = dbStudents?.map((s: any) => ({
    id: s.id,
    first_name: s.first_name,
    last_name: s.last_name,
    mastery: s.student_profiles?.[0]?.overall_mastery_score || 0,
    initialTier: s.student_profiles?.[0]?.current_tier || null,
    interest: s.student_profiles?.[0]?.current_interest || "",
    subject: "AP Physics C",
    assignedTeacher: "Dr. Feynman",
    currentGrade: "11th Grade"
  })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-2">
        <Link href="/teacher/classes" className="text-blue-500 hover:text-blue-600 text-sm font-bold transition-colors">
          &larr; Back to Classes
        </Link>
      </div>

      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{formattedClassName} Roster</h1>
          <p className="text-slate-500 max-w-2xl font-medium">Log your intuitive pedagogical observations for each student. The AI engine continuously updates student rankings based on their daily practice.</p>
        </div>
        <div className="bg-white border border-blue-200 px-5 py-3 rounded-2xl flex items-center space-x-4 shadow-sm">
          <div className="bg-blue-50 p-2 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Active Learning Module</span>
            <span className="text-sm font-bold text-slate-800">{activeTopic.name}</span>
          </div>
        </div>
      </header>
      
      {/* Phase 1 Assessment Lock & Release Status Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <div>
            <h4 className="text-emerald-800 font-bold text-sm">Phase 1 Initial Assessment: Active</h4>
            <p className="text-emerald-600 text-xs font-medium">Waiting for all 10 students to complete before unlocking Comparison Results.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-700">7<span className="text-emerald-400 text-lg">/10</span></span>
          <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Completed</p>
        </div>
      </div>

      {/* The Roster Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {students.map((student: any) => (
          <StudentCard 
            key={student.id} 
            student={student} 
            classId={classId} 
            activeTopicId={activeTopic.id} 
          />
        ))}
        {students.length === 0 && (
          <div className="col-span-2 text-center p-12 text-slate-500 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            No students found in the database.
          </div>
        )}
      </div>
    </div>
  );
}
