import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('enrollments').select('*').limit(1);
  console.log('Enrollments Table Check:', error ? error.message : 'Table Exists!');
  
  const { data: users, error: uError } = await supabase.from('users').select('*').limit(1);
  console.log('Users Table Check:', uError ? uError.message : 'Table Exists!');
}
check();
