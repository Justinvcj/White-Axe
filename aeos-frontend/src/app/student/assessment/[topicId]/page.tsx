import { createClient } from "@/lib/supabase/server";
import { AssessmentLoader } from "@/components/student/assessment-loader";
import { redirect } from "next/navigation";

export default async function AssessmentPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params;
  const { topicId } = resolvedParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch student cognitive tier and interest
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("current_tier, current_interest")
    .eq("user_id", user.id)
    .single();

  const tier = profile?.current_tier || "C2";
  const interest = profile?.current_interest || "General Science";

  // Mocking assessment ID for scaffolding Phase 4
  const assessmentId = "00000000-0000-0000-0000-000000000000";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative z-20">
      <AssessmentLoader 
        topicId={topicId} 
        studentId={user.id} 
        assessmentId={assessmentId}
        tier={tier}
        interest={interest}
      />
    </div>
  );
}
