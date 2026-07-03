import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SchoolOnboardingForm } from "@/components/superadmin/school-onboarding-form";
import { AIConfigPanel } from "@/components/superadmin/ai-config-panel";
import { GlassCard } from "@/components/ui/glass-card";
import { Database } from "lucide-react";

export default async function SuperAdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Rigid Authorization: Ensure absolute root-level execution capability
  const { data: profileData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = profileData as { role?: string } | null;
  if (!profile || profile.role?.toLowerCase() !== "superadmin") {
    // Intruders are forcefully routed back to authentication
    redirect("/auth/login"); 
  }

  // Fetch all active multi-tenant environments dynamically
  const { data: schoolsData } = await supabase
    .from("schools")
    .select("*")
    .order("created_at", { ascending: false });
    
  const schools = schoolsData as { id: string; name: string; domain: string }[] | null;

  return (
    <div className="min-h-screen bg-[#040405] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Intense Deep Space Macro Aesthetics */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="border-b border-white/5 pb-8">
          <div className="flex items-center space-x-3 mb-4">
            <span className="px-4 py-1.5 bg-purple-500/10 text-purple-400 text-[10px] uppercase tracking-widest font-black rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              Root Access Confirmed
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">Master Control Plane</h1>
          <p className="text-slate-400 text-lg font-medium">Multi-Tenant Orchestration & Core AI Parameters.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <SchoolOnboardingForm />
          <AIConfigPanel />
        </section>

        <section className="pt-6">
          <GlassCard className="border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Database className="w-6 h-6 mr-3 text-slate-400" />
                Active Tenant Roster
              </h2>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-4 py-1.5 rounded-full border border-white/5 shadow-inner">
                {schools?.length || 0} Nodes Live
              </span>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="p-6 font-bold">Tenant ID (UUID)</th>
                    <th className="p-6 font-bold">Institution Name</th>
                    <th className="p-6 font-bold">Domain Binding</th>
                    <th className="p-6 font-bold">Deployment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schools?.map((school) => (
                    <tr key={school.id} className="border-b border-white/5 last:border-none hover:bg-slate-800/40 transition-colors">
                      <td className="p-6 font-mono text-xs text-slate-500">{school.id}</td>
                      <td className="p-6 font-bold text-slate-200">{school.name}</td>
                      <td className="p-6 text-blue-400 font-medium">{school.domain}</td>
                      <td className="p-6">
                        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-bold rounded-full flex items-center w-fit shadow-inner">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                          Online
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!schools || schools.length === 0) && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                        No active tenants found. Provision a new school architecture to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
