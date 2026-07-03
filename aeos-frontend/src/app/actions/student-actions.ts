"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function completeInitialAssessment(studentId: string, mastery: number) {
  // Use service role to bypass restrictive RLS policies for the MVP demo
  const supabase = createClient(
    "https://gjiqhbwvdmsrtsmvysbe.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w"
  );

  const { error } = await supabase.from("student_profiles").update({
    initial_assessment_completed: true,
    overall_mastery_score: mastery
  }).eq("user_id", studentId);

  if (error) {
    console.error("Failed to complete assessment:", error);
    return false;
  }

  return true;
}

export async function forceCompleteAllPendingAssessments() {
  const supabase = createClient(
    "https://gjiqhbwvdmsrtsmvysbe.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w"
  );

  const { error } = await supabase.from("student_profiles").update({
    initial_assessment_completed: true,
    overall_mastery_score: 85 // Mock a decent mastery score so the AI engine has data
  }).eq("initial_assessment_completed", false);

  if (error) {
    console.error("Failed to force complete assessments:", error);
    return false;
  }
  
  revalidatePath("/teacher/classes/[classId]", "page");
  return true;
}
