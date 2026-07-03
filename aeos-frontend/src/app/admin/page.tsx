import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSchoolOverviewStats, getTeacherCompatibilityRankings, getAtRiskClasses } from "@/app/actions/admin-analytics";
import { OverviewCards } from "@/components/admin/overview-cards";
import { TeacherCompatibilityTable } from "@/components/admin/teacher-compatibility-table";
import { RiskHeatmap } from "@/components/admin/risk-heatmap";

// Note: In Phase 9 scaffolding, we map this to a default execution environment ID.
// In production, this resolves dynamically via the authenticated `user.school_id`.
const MOCK_SCHOOL_ID = "school-001";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Row Level Security strictly scopes the database returns to the admin's tenant.
  // Dispatch asynchronous parallel data fetching to minimize blocking execution latency.
  const [stats, rankings, riskClasses] = await Promise.all([
    getSchoolOverviewStats(MOCK_SCHOOL_ID),
    getTeacherCompatibilityRankings(MOCK_SCHOOL_ID),
    getAtRiskClasses(MOCK_SCHOOL_ID)
  ]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-4 md:p-10 relative overflow-hidden">
      {/* High-density macro aesthetic light bleeds */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black tracking-tight mb-3">Command Center</h1>
          <p className="text-slate-400 text-lg font-medium">School-wide Intelligence & AI Engine Telemetry.</p>
        </header>

        <section>
          <OverviewCards stats={stats} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          <div className="lg:col-span-2">
            <TeacherCompatibilityTable rankings={rankings} />
          </div>
          <div className="lg:col-span-1">
            <RiskHeatmap classes={riskClasses} />
          </div>
        </section>
      </div>
    </div>
  );
}
