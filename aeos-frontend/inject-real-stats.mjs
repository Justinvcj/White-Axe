import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
// Note: We use the local service role key for the dev script, which is perfectly safe locally.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function injectStats() {
  console.log("Fetching students...");
  const { data: students, error } = await supabase
    .from("users")
    .select("id")
    .eq("role", "student")
    .order("first_name", { ascending: true })
    .limit(4);

  if (error || !students) {
    console.error("Error fetching students:", error);
    return;
  }

  console.log(`Injecting stats for ${students.length} students...`);

  const mockGranularData = [
    { day: "Day 1 (Kinematics)", score: 88, weak_area: "Vector Addition" },
    { day: "Day 2 (Newton's Laws)", score: 92, weak_area: "Normal Force" },
    { day: "Day 3 (Friction)", score: 75, weak_area: "Static vs Kinetic Coefficients" }
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    // 3 out of 4 completed
    const completed = i < 3; 
    
    // Vary the stats slightly per student for realism
    const personalizedStats = mockGranularData.map(d => ({
        ...d,
        score: d.score + (Math.floor(Math.random() * 10) - 5)
    }));

    const { error: updateError } = await supabase
      .from("student_profiles")
      .update({
        initial_assessment_completed: completed,
        granular_performance: personalizedStats
      })
      .eq("user_id", student.id);

    if (updateError) {
      console.error(`Error updating student ${student.id}:`, updateError);
    } else {
      console.log(`Updated student ${student.id}`);
    }
  }
  console.log("Done.");
}

injectStats();
