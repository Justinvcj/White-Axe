import { createClient } from "@/lib/supabase/server";
import { ChallengeArena } from "@/components/student/challenge-arena";
import { redirect } from "next/navigation";

export default async function ChallengePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // For the prototype, we bypass the strict RBAC check so all test accounts can experience the Challenge Arena
  // In production, non-C1 students would be redirected: redirect("/student");
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("current_tier")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col justify-center py-12 px-4 relative z-20">
      <ChallengeArena studentId={user.id} />
    </div>
  );
}
