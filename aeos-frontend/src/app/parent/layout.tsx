import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardLayout from "@/components/shared/dashboard-layout";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/auth/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (userData?.role?.toLowerCase() !== "parent") {
    redirect("/auth/login");
  }

  return <DashboardLayout role="Parent">{children}</DashboardLayout>;
}
