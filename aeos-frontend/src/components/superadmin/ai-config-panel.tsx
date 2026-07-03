"use client";

import { useState } from "react";
import { Settings2, Cpu, Sparkles, Binary } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function AIConfigPanel() {
  const [telemetrySensitivity, setTelemetrySensitivity] = useState(80);
  const [irtStepSize, setIrtStepSize] = useState(1.5);
  const [inferenceModel, setInferenceModel] = useState("Llama-3-8B-Instruct");

  return (
    <GlassCard className="h-full border-blue-500/20 shadow-2xl flex flex-col min-h-[480px]">
      <div className="p-6 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Cpu className="w-5 h-5 mr-3 text-blue-400" />
          Global AI Engine Configuration
        </h2>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-white/5">
          JarvisLabs Link
        </span>
      </div>

      <div className="p-8 space-y-10 flex-1 bg-slate-950/20">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
              BAM-E Telemetry Sensitivity
            </label>
            <span className="text-sm text-blue-400 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{telemetrySensitivity}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={telemetrySensitivity}
            onChange={(e) => setTelemetrySensitivity(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500 shadow-inner"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
              <Binary className="w-4 h-4 mr-2 text-amber-400" />
              Adaptive Engine IRT Step-Size
            </label>
            <span className="text-sm text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{irtStepSize}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="3.0" 
            step="0.1"
            value={irtStepSize}
            onChange={(e) => setIrtStepSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500 shadow-inner"
          />
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
            <Settings2 className="w-4 h-4 mr-2 text-emerald-400" />
            Contextual Engine Inference Model
          </label>
          <select 
            value={inferenceModel}
            onChange={(e) => setInferenceModel(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-3.5 px-4 text-white font-medium focus:outline-none focus:border-emerald-500/50 appearance-none shadow-inner cursor-pointer"
          >
            <option value="Llama-3-8B-Instruct">Llama-3-8B-Instruct (Local/Fastest)</option>
            <option value="Mistral-7B-v0.2">Mistral-7B-v0.2 (Balanced Logic)</option>
            <option value="Gemma-7B">Gemma-7B (Experimental)</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-black/60 border-t border-white/5 font-mono text-[11px] text-slate-500 shadow-inner">
        <div className="flex justify-between items-center mb-3">
          <span className="uppercase font-bold tracking-widest text-slate-600">Live JSON Payload</span>
          <span className="text-emerald-400 flex items-center font-bold tracking-widest uppercase text-[9px]"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />Syncing</span>
        </div>
        <pre className="text-blue-300/80 overflow-x-auto p-4 bg-slate-950/80 rounded-lg border border-white/5">
          {JSON.stringify({
            target: "jarvislabs_fastapi_cluster",
            version: "v1.0.0",
            config: {
              bam_e: { sensitivity_threshold: telemetrySensitivity / 100 },
              aae: { irt_step_multiplier: irtStepSize },
              cpe: { target_model: inferenceModel }
            }
          }, null, 2)}
        </pre>
      </div>
    </GlassCard>
  );
}
