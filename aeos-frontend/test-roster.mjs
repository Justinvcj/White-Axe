import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gjiqhbwvdmsrtsmvysbe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testRoster() {
  const { data: dbStudents } = await supabase
    .from("users")
    .select(`
      id, first_name, last_name, email,
      student_profiles (
        current_tier,
        overall_mastery_score,
        current_interest,
        initial_assessment_completed,
        granular_performance
      )
    `)
    .in("email", [
      "student1@school.edu",
      "student2@school.edu",
      "student3@school.edu",
      "student4@school.edu"
    ])
    .order("first_name", { ascending: true });

  const students = dbStudents?.map((s) => ({
    first_name: s.first_name,
    isCompleted: s.student_profiles?.[0]?.initial_assessment_completed || false,
    profiles: s.student_profiles
  })) || [];

  console.log(JSON.stringify(students, null, 2));
  
  const completedCount = students.filter(s => s.isCompleted).length;
  console.log(`Completed Count: ${completedCount}/4`);
}

testRoster();
