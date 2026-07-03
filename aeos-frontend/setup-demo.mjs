import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDemo() {
  console.log("Setting up Demo Mode: 3/4 Completed, ONLY Emma left...");

  // Get the 4 target users
  const { data: users, error: userErr } = await supabase
    .from('users')
    .select('id, first_name')
    .in('email', [
      "student1@school.edu",
      "student2@school.edu",
      "student3@school.edu",
      "student4@school.edu"
    ]);

  if (userErr) {
    console.error("Failed to fetch users:", userErr);
    return;
  }

  // Separate Emma from the others
  const emma = users.find(u => u.first_name === 'Emma');
  const others = users.filter(u => u.first_name !== 'Emma');

  if (!emma) {
    console.error("Could not find Emma!");
    return;
  }

  const otherIds = others.map(u => u.id);

  // Update Others -> true
  console.log(`Setting ${others.map(o => o.first_name).join(', ')} to Completed (true)...`);
  await supabase
    .from('student_profiles')
    .update({ 
      initial_assessment_completed: true,
      overall_mastery_score: 85
    })
    .in('user_id', otherIds);

  // Update Emma -> false
  console.log(`Setting Emma to Uncompleted (false)...`);
  await supabase
    .from('student_profiles')
    .update({ 
      initial_assessment_completed: false,
      overall_mastery_score: 0
    })
    .eq('user_id', emma.id);

  console.log("\n✅ Demo Mode Successfully Configured!");
  console.log("Current State: 3/4 Students are complete.");
  console.log("Next Step: Log in as Emma (student1@school.edu) and take the test to hit 4/4.");
}

setupDemo();
