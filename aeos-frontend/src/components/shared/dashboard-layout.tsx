"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./navbar";
import { UserRole } from "@/lib/types/database";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const hideNav = pathname.includes('/assessment');
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {!hideNav && <Navbar role={role} />}
      
      <main className="flex-1 w-full relative z-10 pb-20 md:pb-0"> {/* padding bottom for mobile nav */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
