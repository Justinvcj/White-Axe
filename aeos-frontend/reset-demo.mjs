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

async function resetDemo() {
  console.log("Resetting all students to uncompleted for the demo...");
  const { data, error } = await supabase
    .from('student_profiles')
    .update({ 
      initial_assessment_completed: false,
      overall_mastery_score: 0
    })
    .neq('user_id', '00000000-0000-0000-0000-000000000000') // just a dummy filter to match all
    .select();

  if (error) {
    console.error("Error resetting profiles:", error);
  } else {
    console.log("Success! Reset profiles count:", data.length);
  }
}

resetDemo();
