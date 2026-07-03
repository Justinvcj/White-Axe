import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gjiqhbwvdmsrtsmvysbe.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaXFoYnd2ZG1zcnRzbXZ5c2JlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAxMjQ2NiwiZXhwIjoyMDk4NTg4NDY2fQ.UBFWAk-srpcrF2KQX0FJf87D9qn_1pcgnce-PXJ3C7w';
const SCHOOL_ID = "11111111-1111-1111-1111-111111111111"; // The static school ID we use for tests

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const FIRST_NAMES = ["Aarav", "Priya", "Rahul", "Ananya", "Ishaan", "Neha", "Vikram", "Diya", "Rohan", "Sneha", "Aditya", "Kavya", "Arjun", "Meera", "Kabir", "Zara", "Dev", "Anika", "Aryan", "Isha", "Karthik", "Riya", "Yash", "Tanvi", "Siddharth", "Aisha", "Varun", "Shruti", "Rishi", "Tara", "Kunal", "Maya"];
const LAST_NAMES = ["Sharma", "Patel", "Singh", "Reddy", "Iyer", "Nair", "Gupta", "Desai", "Joshi", "Kumar", "Rao", "Das", "Menon", "Verma", "Chauhan", "Bose"];
const INTERESTS = ["Cricket", "Gaming", "Space & Astronomy", "Robotics", "Anime", "Football", "Art & Design", "Music Production"];
const TIERS = ["C1", "C2", "C3"];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Starting massive 32-student data seed...");

  for (let i = 1; i <= 32; i++) {
    const email = `student${i}@school.edu`;
    const firstName = FIRST_NAMES[i - 1]; // Use exact 32 names
    const lastName = getRandomItem(LAST_NAMES);
    const tier = getRandomItem(TIERS);
    
    // Generate realistic AI Mastery score based on tier
    let score = 0;
    if (tier === "C1") score = Math.floor(Math.random() * 15) + 85; // 85-99
    if (tier === "C2") score = Math.floor(Math.random() * 20) + 65; // 65-84
    if (tier === "C3") score = Math.floor(Math.random() * 30) + 35; // 35-64
    
    const interest = getRandomItem(INTERESTS);

    console.log(`\n[${i}/32] Provisioning ${firstName} ${lastName} (${email}) - Tier: ${tier}, Score: ${score}%`);

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: '12345678',
      email_confirm: true
    });

    let userId;
    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`  -> Auth user already exists.`);
        // Fetch existing user to get ID
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existing = existingUsers.users.find(u => u.email === email);
        if (existing) userId = existing.id;
      } else {
        console.error(`  -> Failed to create auth user:`, authError.message);
        continue;
      }
    } else {
      userId = authData.user.id;
      console.log(`  -> Created in Auth.`);
    }

    if (!userId) continue;

    // 2. Insert into public.users
    const { error: usersError } = await supabaseAdmin.from('users').upsert({
      id: userId,
      school_id: SCHOOL_ID,
      role: 'student',
      first_name: firstName,
      last_name: lastName,
      email: email
    });
    
    if (usersError) console.error(`  -> Failed to upsert public.users:`, usersError.message);
    else console.log(`  -> Upserted public.users.`);

    // 3. Insert into public.student_profiles
    const { error: profileError } = await supabaseAdmin.from('student_profiles').upsert({
      user_id: userId,
      current_tier: tier,
      overall_mastery_score: score,
      current_interest: interest
    });

    if (profileError) console.error(`  -> Failed to upsert student_profiles:`, profileError.message);
    else console.log(`  -> Upserted student_profiles.`);
  }

  console.log("\nMassive data seed complete! 32 real profiles have been permanently injected into the database.");
}

main();
