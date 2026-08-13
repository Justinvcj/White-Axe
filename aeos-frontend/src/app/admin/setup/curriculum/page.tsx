"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, Network, CheckCircle2, ChevronRight, Layers, LayoutTemplate, PlusCircle, Trash2 } from "lucide-react";

export default function CurriculumBuilderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [curriculum, setCurriculum] = useState<any | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleIngest = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/curriculum-ingest", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setCurriculum(json.data);
      } else {
        alert("Error mapping syllabus");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-4 border border-primary/30">
            <LayoutTemplate className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Curriculum Matrix Builder
          </h1>
          <p className="text-muted-foreground text-lg mt-2">
            Upload the state or institutional syllabus PDF to auto-generate the structural hierarchy, or build it manually.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Ingestion Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Network className="text-primary" /> AI Syllabus Ingestion
              </h2>
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-background/50 hover:bg-background/80 transition-colors">
                <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop a PDF here, or click to browse.
                </p>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden" 
                  id="file-upload" 
                />
                <label 
                  htmlFor="file-upload"
                  className="cursor-pointer bg-primary/20 text-primary font-bold py-2 px-6 rounded-full inline-block hover:bg-primary/30 transition-colors"
                >
                  Select PDF
                </label>
                {file && (
                  <p className="mt-4 text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleIngest}
                disabled={!file || isProcessing}
                className="w-full mt-6 bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <Network />
                    </motion.div>
                    Mapping Graph...
                  </>
                ) : (
                  <>Map Matrix</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Curriculum Tree Viewer */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-glass-border rounded-3xl p-8 shadow-2xl min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Layers className="text-accent" /> Structural Hierarchy
                </h2>
                <button className="flex items-center gap-2 text-sm bg-background/50 border border-glass-border px-4 py-2 rounded-lg hover:bg-background/80 transition-colors">
                  <PlusCircle className="w-4 h-4" /> Add Subject
                </button>
              </div>

              {!curriculum && !isProcessing && (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                  <LayoutTemplate className="w-16 h-16 mb-4 opacity-20" />
                  <p>Upload a syllabus or build manually to view the matrix.</p>
                </div>
              )}

              {isProcessing && (
                <div className="h-64 flex flex-col items-center justify-center text-primary">
                  <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4">
                    <Network className="w-16 h-16" />
                  </motion.div>
                  <p className="font-bold animate-pulse">Running Llama3 Ingestion Engine...</p>
                </div>
              )}

              {curriculum && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <strong>Graph mapped successfully!</strong> 1 Subject, 1 Unit, 1 Chapter, 3 Concepts isolated.
                  </div>

                  {curriculum.map((subject: any) => (
                    <div key={subject.id} className="border border-glass-border rounded-2xl bg-background/30 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                          <ChevronRight className="w-5 h-5" /> {subject.name}
                        </h3>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-primary/20 rounded-md text-primary"><PlusCircle size={16} /></button>
                          <button className="p-2 hover:bg-destructive/20 rounded-md text-destructive"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="ml-6 mt-4 space-y-4 border-l-2 border-primary/20 pl-4">
                        {subject.units?.map((unit: any) => (
                          <div key={unit.id} className="border border-glass-border rounded-xl bg-background/50 p-4">
                            <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-muted-foreground" /> {unit.name}
                            </h4>
                            
                            <div className="ml-6 mt-4 space-y-4 border-l-2 border-accent/20 pl-4">
                              {unit.chapters?.map((chapter: any) => (
                                <div key={chapter.id} className="bg-card/50 border border-glass-border rounded-lg p-3">
                                  <h5 className="font-medium text-accent flex items-center gap-2">
                                    <ChevronRight className="w-4 h-4" /> {chapter.name}
                                  </h5>

                                  <div className="ml-6 mt-3 grid grid-cols-2 gap-2">
                                    {chapter.concepts?.map((concept: any) => (
                                      <div key={concept.id} className="bg-background border border-glass-border px-3 py-2 rounded-md text-sm text-muted-foreground flex items-center justify-between hover:border-primary/50 cursor-pointer transition-colors">
                                        {concept.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-8 flex justify-end">
                    <button className="bg-accent text-accent-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                      Save to Core Database
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
