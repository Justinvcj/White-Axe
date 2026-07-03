import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gjiqhbwvdmsrtsmvysbe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const tables = ['users', 'student_profiles', 'hypothesis_logs', 'student_analytics'];
  
  for (const table of tables) {
    const { data, error } = await supabaseAdmin.from(table).select('*').limit(1);
    console.log(`\n--- TABLE: ${table} ---`);
    if (error) {
      console.error("Error:", error.message);
    } else {
      console.log("Data/Columns:", data && data.length > 0 ? Object.keys(data[0]) : "Table is empty, can't infer schema.");
      console.log("Sample Row:", data);
    }
  }
}

inspect();
