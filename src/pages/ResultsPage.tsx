import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, DollarSign, CheckCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { DocumentAnalysis } from "@/lib/ai";

const iconMap: Record<string, typeof DollarSign> = {
  "Total Charged": DollarSign,
  "Insurance Paid": CheckCircle,
  "You Owe": AlertTriangle,
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [result, setResult] = useState<DocumentAnalysis | null>(
    (location.state as any)?.analysis || null
  );
  const [loading, setLoading] = useState(!result && !!id);

  useEffect(() => {
    if (id && !result) {
      const fetchEntry = async () => {
        const { data, error } = await supabase
          .from("scan_entries")
          .select("*")
          .eq("id", id)
          .single();

        if (data && !error) {
          setResult({
            title: data.title,
            document_type: data.document_type || "Document",
            summary: data.summary || "",
            breakdown: (data.breakdown as any[]) || [],
            next_steps: (data.next_steps as string[]) || [],
          });
        }
        setLoading(false);
      };
      fetchEntry();
    }
  }, [id, result]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <p className="text-muted-foreground">No analysis results found.</p>
        <button onClick={() => navigate("/app")} className="text-primary font-medium text-sm">
          Scan a new document
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-6">
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app")}
          className="w-9 h-9 rounded-xl bg-card shadow-card flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Results</h1>
          <p className="text-xs text-muted-foreground">{result.document_type}{result.date ? ` • ${result.date}` : ""}</p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Info size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Plain English Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          {result.provider && (
            <p className="text-xs text-muted-foreground mt-2">Provider: {result.provider}</p>
          )}
        </motion.div>

        {/* Cost breakdown */}
        {result.breakdown.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-2.5"
          >
            {result.breakdown.slice(0, 3).map((item, i) => {
              const Icon = iconMap[item.label] || DollarSign;
              const isLast = i === result.breakdown.slice(0, 3).length - 1;
              return (
                <div
                  key={item.label}
                  className={`rounded-2xl p-4 shadow-card text-center ${isLast ? "gradient-warm" : "bg-card"}`}
                >
                  <Icon
                    size={20}
                    className={isLast ? "text-primary-foreground mx-auto mb-1.5" : "text-primary mx-auto mb-1.5"}
                  />
                  <p className={`text-lg font-bold ${isLast ? "text-primary-foreground" : "text-foreground"}`}>
                    {item.value}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isLast ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Extra breakdown items */}
        {result.breakdown.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">Additional Details</h3>
            {result.breakdown.slice(3).map((item, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Next steps */}
        {result.next_steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-5 shadow-card"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">What You Should Do</h3>
            <div className="flex flex-col gap-3">
              {result.next_steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-secondary-foreground">{i + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ask AI CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/app/chat")}
          className="w-full gradient-primary text-primary-foreground font-semibold py-4 rounded-2xl shadow-elevated flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <MessageCircle size={18} />
          Ask AI: "What does this mean for me?"
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsPage;
