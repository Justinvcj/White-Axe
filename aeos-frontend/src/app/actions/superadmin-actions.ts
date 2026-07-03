"use server";

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

// We specifically initialize a separate client using the Service Role Key to strictly bypass RLS.
// This is mandated for cross-tenant operations like spinning up entirely new schools.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function createNewSchool(schoolName: string, domain: string, adminEmail: string, adminName: string) {
  try {
    // 1. Verify that the caller initiating this action is explicitly a superadmin
    const supabaseSession = await createServerClient();
    const { data: { user } } = await supabaseSession.auth.getUser();
    
    if (!user) {
      throw new Error("Unauthorized Access Attempt");
    }

    const { data: profileData } = await supabaseSession
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const profile = profileData as { role?: string } | null;
    if (!profile || profile.role !== "superadmin") {
      throw new Error("Critical: Superadmin privileges required to execute tenant provisioning.");
    }

    // 2. Insert into `schools` table bypassing RLS
    const { data: schoolData, error: schoolErr } = await supabaseAdmin
      .from("schools")
      .insert({ name: schoolName, domain: domain })
      .select("id")
      .single();

    const school = schoolData as { id?: string } | null;
    if (schoolErr || !school) {
      throw new Error(`Failed to provision school infrastructure: ${schoolErr?.message}`);
    }

    const schoolId = school.id;

    // 3. Generate the first Local Admin user via Supabase Admin Auth API
    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      email_confirm: true, // Auto-confirm for immediate dashboard access
      user_metadata: { name: adminName, role: "admin", school_id: schoolId },
      password: "TempAdminPassword123!" // Scaffold baseline. Prod: Dispatch secure magic link.
    });

    if (authErr || !authUser.user) {
      // Execute strict rollback of the school tenant to prevent orphaned records
      await supabaseAdmin.from("schools").delete().eq("id", schoolId);
      throw new Error(`Failed to generate Admin authentication credentials: ${authErr?.message}`);
    }

    // 4. Insert into public `users` table, formally assigning the rigid 'admin' role
    const { error: userErr } = await supabaseAdmin
      .from("users")
      .insert({
        id: authUser.user.id,
        email: adminEmail,
        name: adminName,
        role: "admin",
        school_id: schoolId
      });

    if (userErr) {
      // Execute strict rollback of both auth credentials and school tenant
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      await supabaseAdmin.from("schools").delete().eq("id", schoolId);
      throw new Error(`Failed to write Admin profile mesh: ${userErr.message}`);
    }

    return { success: true, schoolId, message: "Tenant successfully provisioned." };

  } catch (error: Error | unknown) {
    console.error("[White-Axe KERNEL] SuperAdmin Action Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return { success: false, error: msg };
  }
}
