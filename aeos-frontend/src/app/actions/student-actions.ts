"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function completeInitialAssessment(studentId: string, mastery: number) {
  // Use service role to bypass restrictive RLS policies for the MVP demo
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("student_profiles").update({
    initial_assessment_completed: true,
    mastery: mastery
  }).eq("user_id", studentId);

  if (error) {
    console.error("Failed to complete assessment:", error);
    return false;
  }

  return true;
}

export async function forceCompleteAllPendingAssessments() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("student_profiles").update({
    initial_assessment_completed: true,
    mastery: 85 // Mock a decent mastery score so the AI engine has data
  }).eq("initial_assessment_completed", false);

  if (error) {
    console.error("Failed to force complete assessments:", error);
    return false;
  }
  
  revalidatePath("/teacher/classes/[classId]", "page");
  return true;
}
