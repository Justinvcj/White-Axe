import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanStats() {
  console.log("Cleaning phase1_result from all granular_performance...");

  const { data: profiles, error } = await supabase
    .from('student_profiles')
    .select('user_id, granular_performance');

  if (error) {
    console.error("Failed to fetch profiles:", error);
    return;
  }

  let updatedCount = 0;
  for (const profile of profiles) {
    const stats = profile.granular_performance || [];
    const filteredStats = stats.filter(s => s.type !== 'phase1_result');
    
    // Only update if it actually had a phase1_result
    if (stats.length !== filteredStats.length) {
      await supabase
        .from('student_profiles')
        .update({ granular_performance: filteredStats })
        .eq('user_id', profile.user_id);
      updatedCount++;
    }
  }

  console.log(`Successfully cleaned ${updatedCount} profiles. AI comparison is now hidden!`);
}

cleanStats();
