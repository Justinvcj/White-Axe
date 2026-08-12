"use client";

import { Clock, Users, Lightbulb, AlertTriangle, Printer } from "lucide-react";
import Link from "next/link";

interface ActionPlanProps {
  plan: any;
  classId: string;
}

export function ActionPlanView({ plan, classId }: ActionPlanProps) {
  if (!plan) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">40-Minute Action Plan</h2>
          <p className="text-slate-400 text-sm">Target: {plan.topic}</p>
        </div>
        <Link href={`/teacher/classes/${classId}/planner/print`} target="_blank">
          <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors">
            <Printer className="w-4 h-4" />
            Print Plan
          </button>
        </Link>
      </div>

      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Timeline Breakdown
          </h3>
          
          <div className="space-y-4">
            {plan.sections?.map((section: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800">{section.title}</h4>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{section.time_minutes} min</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">{section.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded border border-emerald-100">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Advanced (C1)</span>
                    <p className="text-xs text-slate-700">{section.c1_activity}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-amber-100">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Proficient (C2)</span>
                    <p className="text-xs text-slate-700">{section.c2_activity}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-rose-100">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block mb-1">Struggling (C3)</span>
                    <p className="text-xs text-slate-700">{section.c3_activity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Micro-Interventions
          </h3>
          <ul className="space-y-2">
            {plan.micro_interventions?.map((intervention: string, idx: number) => (
              <li key={idx} className="flex gap-3 items-start bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 font-medium">{intervention}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
