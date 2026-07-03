"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ShieldCheck, Mail, User, Loader2, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { createNewSchool } from "@/app/actions/superadmin-actions";

export function SchoolOnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("schoolName") as string;
    const domain = formData.get("domain") as string;
    const adminName = formData.get("adminName") as string;
    const adminEmail = formData.get("adminEmail") as string;

    const result = await createNewSchool(name, domain, adminEmail, adminName);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 6000); // Reset UI back to ready state after 6s
      e.currentTarget.reset();
    } else {
      setErrorMsg(result.error || "An unknown network error disrupted provisioning.");
    }
  }

  return (
    <GlassCard className="relative overflow-hidden border-emerald-500/20 shadow-2xl h-full flex flex-col">
      <div className="p-6 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Building2 className="w-5 h-5 mr-3 text-emerald-400" />
          Tenant Provisioning Protocol
        </h2>
      </div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-slate-950/40 backdrop-blur-sm"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Tenant Provisioned</h3>
              <p className="text-emerald-400/80 font-semibold max-w-sm">The new isolated environment is locked in. Admin credentials have been dispatched securely.</p>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="p-8 space-y-8 absolute inset-0 overflow-y-auto"
            >
              {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-semibold">
                  {errorMsg}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required name="schoolName" type="text" className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 shadow-inner" placeholder="e.g. Neo Tokyo Academy" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Domain</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required name="domain" type="text" className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 shadow-inner" placeholder="e.g. nta.edu" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required name="adminName" type="text" className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 shadow-inner" placeholder="e.g. Dr. Akira" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required name="adminEmail" type="email" className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-600 shadow-inner" placeholder="akira@nta.edu" />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-auto">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center disabled:opacity-50 transform hover:scale-[1.01]"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy Environment Architecture"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
