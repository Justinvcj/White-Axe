import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gjiqhbwvdmsrtsmvysbe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const usersToCreate = [
    { email: 'teacher@school.edu', role: 'teacher' },
    { email: 'admin@school.edu', role: 'admin' },
    { email: 'superadmin@school.edu', role: 'superadmin' },
    { email: 'parent@school.edu', role: 'parent' },
    { email: 'student@school.edu', role: 'student' }
  ];

  for (const u of usersToCreate) {
    console.log(`Creating ${u.email}...`);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: '12345678',
      email_confirm: true // bypass email confirmation!
    });

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log(`- Already exists: ${u.email}`);
      } else {
        console.error(`- Error creating ${u.email}:`, error.message);
      }
    } else {
      console.log(`- Created ${u.email} successfully.`);
      
      // Also provision them in the public.users table just to be safe
      const { error: dbError } = await supabaseAdmin.from('users').insert([{
        id: data.user.id,
        email: u.email,
        role: u.role,
        first_name: "Test",
        last_name: u.role.charAt(0).toUpperCase() + u.role.slice(1),
        school_id: "11111111-1111-1111-1111-111111111111"
      }]);
      
      if (dbError) {
        if (dbError.message.includes('duplicate key')) {
           console.log(`- DB record already exists for ${u.email}`);
        } else {
           console.error(`- Error provisioning ${u.email} in DB:`, dbError.message);
        }
      } else {
        console.log(`- DB record created for ${u.email}`);
      }
    }
  }
}

main();
