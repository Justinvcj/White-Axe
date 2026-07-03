"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BookOpen, Users, BrainCircuit, Activity,
  LayoutDashboard, TrendingUp, AlertTriangle,
  Calendar, FileBarChart, Lightbulb, LogOut, Loader2, LucideIcon, Settings2, Target
} from "lucide-react";
import { UserRole } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ROLE_LINKS: Record<UserRole, { label: string; href: string; icon: LucideIcon }[]> = {
  Teacher: [
    { label: "Teacher Console", href: "/teacher", icon: Users },
    { label: "Class Roster", href: "/teacher/classes", icon: Users },
  ],
  Student: [
    { label: "Learning Path", href: "/student", icon: Activity },
    { label: "Initial Assessment", href: "/student/dashboard", icon: Target },
  ],
  Admin: [
    { label: "Command Center", href: "/admin", icon: LayoutDashboard },
    { label: "Setup Wizard", href: "/admin/setup", icon: Settings2 },
  ],
  Parent: [
    { label: "Parent Portal", href: "/parent", icon: FileBarChart },
  ],
  SuperAdmin: [
    { label: "Master Control", href: "/superadmin", icon: LayoutDashboard },
  ],
};

export default function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const links = ROLE_LINKS[role] || [];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <div className="w-64 glass-panel h-full flex flex-col border-y-0 border-l-0 rounded-none border-r border-white/10">
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)] flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider text-white">White-Axe</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {role} Portal
          </p>
        </div>
        
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-slate-800/50 text-blue-400 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)] border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/30 transition-all"
        >
          {isSigningOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
