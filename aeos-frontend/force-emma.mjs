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

async function forceComplete() {
  console.log("Forcing completion for all students pending assessment...");
  const { data, error } = await supabase
    .from('student_profiles')
    .update({ 
      initial_assessment_completed: true,
      overall_mastery_score: 85
    })
    .eq('initial_assessment_completed', false)
    .select();

  if (error) {
    console.error("Error updating profiles:", error);
  } else {
    console.log("Success! Updated profiles:", data);
  }
}

forceComplete();
