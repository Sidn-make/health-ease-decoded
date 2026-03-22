import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, X, ArrowRight, Image, Sparkles, FileText, DollarSign, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { analyzeDocument, type DocumentAnalysis } from "@/lib/ai";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ScanPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [latestEntry, setLatestEntry] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("scan_entries")
      .select("id, title, document_type, summary, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setLatestEntry(data[0]);
      });
  }, [user]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    try {
      const analysis: DocumentAnalysis = await analyzeDocument(preview);
      if (user) {
        const { data, error } = await supabase.from("scan_entries").insert({
          user_id: user.id,
          title: analysis.title || "Untitled Scan",
          document_type: analysis.document_type,
          summary: analysis.summary,
          breakdown: analysis.breakdown,
          next_steps: analysis.next_steps,
          image_url: preview.substring(0, 500),
        }).select("id").single();
        if (error) {
          toast({ title: "Warning", description: "Analysis complete but couldn't save." });
        }
        if (data) {
          navigate(`/app/entry/${data.id}`);
          return;
        }
      }
      navigate("/app/results", { state: { analysis } });
    } catch (error: any) {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5"
          >
            {/* Hero */}
            <div className="pt-8 pb-6">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
              >
                <Sparkles size={14} className="text-primary" />
                AI healthcare decoder
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-[28px] leading-[1.15] font-bold text-foreground tracking-tight"
              >
                Understand the bill before you pay the bill.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[15px] text-muted-foreground mt-3 leading-relaxed"
              >
                Scan an EOB, invoice, or coverage letter. ClearCare turns it into plain English, shows the likely next step, and gives you questions to ask.
              </motion.p>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col gap-3"
            >
              <label className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-elevated flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] transition-transform text-[15px]">
                <Camera size={18} />
                Scan document
                <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
              </label>

              <label className="w-full bg-card text-foreground font-semibold py-4 rounded-2xl shadow-card border border-border flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98] transition-transform text-[15px]">
                <Upload size={18} className="text-muted-foreground" />
                Upload photo
                <input type="file" accept="image/*,.pdf" onChange={handleFile} className="hidden" />
              </label>
            </motion.div>

            {/* Latest Document */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-card rounded-2xl shadow-card p-5"
            >
              <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-2">
                Latest Document
              </p>
              {latestEntry ? (
                <button
                  onClick={() => navigate(`/app/entry/${latestEntry.id}`)}
                  className="w-full text-left"
                >
                  <p className="text-base font-semibold text-foreground">{latestEntry.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{latestEntry.summary}</p>
                </button>
              ) : (
                <div>
                  <p className="text-base font-semibold text-foreground">No document yet</p>
                  <div className="mt-3 bg-muted rounded-xl p-6 flex flex-col items-center gap-2">
                    <FileText size={28} className="text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground text-center">
                      Your scanned bill preview will appear here.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Plain-English Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-4 rounded-2xl p-5 overflow-hidden"
              style={{ background: "hsl(200 25% 12%)" }}
            >
              <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-2">
                Plain-English Breakdown
              </p>
              <h2 className="text-xl font-bold text-white mb-2">Understanding your bill</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-5">
                Scan a bill, EOB, or insurance letter and ClearCare will turn it into plain English, explain what you likely owe, and suggest what to do next.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { color: "bg-muted-foreground", label: "Deductible", desc: "What you pay before insurance kicks in" },
                  { color: "bg-primary", label: "In-network", desc: "Usually lower rates because the provider has a contract" },
                  { color: "bg-accent", label: "EOB", desc: "A summary of how your claim was processed, not always a bill" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1.5 shrink-0`} />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-col gap-3 pb-4"
            >
              <div className="bg-card rounded-2xl shadow-card p-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <DollarSign size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">What you may owe</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  A summary of how your claim was processed, not always a bill
                </p>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-5">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                  <ShieldCheck size={20} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Coverage clues</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Scan a bill, EOB, or insurance letter and ClearCare will explain your coverage
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 pt-6 flex flex-col gap-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-elevated">
              <img src={preview} alt="Scanned document" className="w-full max-h-80 object-cover" />
              <button
                onClick={() => { setPreview(null); setAnalyzing(false); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center"
              >
                <X size={16} className="text-primary-foreground" />
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-elevated flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Image size={18} />
                  Analyze Document
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanPage;
