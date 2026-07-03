"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, Activity, Target, LogOut, Loader2, LayoutDashboard, Settings2, FileBarChart
} from "lucide-react";
import { UserRole } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ROLE_LINKS: Record<string, { label: string; href: string; icon: any }[]> = {
  Teacher: [
    { label: "Console", href: "/teacher", icon: Activity },
    { label: "Roster", href: "/teacher/classes", icon: Users },
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

export default function Navbar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const links = ROLE_LINKS[role as string] || [];

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-md flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-blue-900">White-Axe</span>
          <span className="ml-4 px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-xs font-bold uppercase tracking-wider">
            {role}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/teacher" && link.href !== "/student");
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2.5 rounded-full font-bold transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-sm border border-slate-200 hover:border-rose-200"
        >
          {isSigningOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          <span>Sign Out</span>
        </button>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex items-center justify-around pb-safe pt-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname.startsWith(`${link.href}/`) && link.href !== "/teacher" && link.href !== "/student");
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center p-2 min-w-[72px]",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all mb-1",
                isActive ? "bg-blue-100" : "bg-transparent"
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">
                {link.label.split(' ')[0]} {/* Shorter label for mobile */}
              </span>
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex flex-col items-center p-2 min-w-[72px] text-slate-400 hover:text-rose-600"
        >
          <div className="p-1.5 rounded-xl transition-all mb-1 bg-transparent hover:bg-rose-50">
            {isSigningOut ? <Loader2 className="w-6 h-6 animate-spin" /> : <LogOut className="w-6 h-6" />}
          </div>
          <span className="text-[10px] font-bold text-center leading-tight">Out</span>
        </button>
      </nav>
      
      {/* Mobile Header (Top) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-sm flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-blue-900">White-Axe</span>
        </div>
        <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
          {role}
        </span>
      </div>
    </>
  );
}
