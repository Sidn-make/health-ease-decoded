import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, DollarSign, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockResult = {
  type: "Medical Bill",
  provider: "City General Hospital",
  date: "March 5, 2026",
  summary: "This is an outpatient visit bill for a routine check-up with lab work. Your insurance covered most of it.",
  breakdown: [
    { label: "Total Charged", value: "$485.00", icon: DollarSign },
    { label: "Insurance Paid", value: "$412.25", icon: CheckCircle },
    { label: "You Owe", value: "$72.75", icon: AlertTriangle },
  ],
  nextSteps: [
    "This amount is after your insurance adjustment — you do NOT owe $485.",
    "Check if this $72.75 has been applied to your deductible.",
    "You can call the billing dept at (555) 123-4567 to set up a payment plan.",
    "If the amount seems wrong, request an itemized bill to verify charges.",
  ],
};

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/app")}
          className="w-9 h-9 rounded-xl bg-card shadow-card flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Results</h1>
          <p className="text-xs text-muted-foreground">{mockResult.type} • {mockResult.date}</p>
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
          <p className="text-sm text-muted-foreground leading-relaxed">{mockResult.summary}</p>
          <p className="text-xs text-muted-foreground mt-2">Provider: {mockResult.provider}</p>
        </motion.div>

        {/* Cost breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2.5"
        >
          {mockResult.breakdown.map((item, i) => (
            <div
              key={item.label}
              className={`rounded-2xl p-4 shadow-card text-center ${
                i === 2 ? "gradient-warm" : "bg-card"
              }`}
            >
              <item.icon
                size={20}
                className={i === 2 ? "text-primary-foreground mx-auto mb-1.5" : "text-primary mx-auto mb-1.5"}
              />
              <p className={`text-lg font-bold ${i === 2 ? "text-primary-foreground" : "text-foreground"}`}>
                {item.value}
              </p>
              <p className={`text-[10px] mt-0.5 ${i === 2 ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">What You Should Do</h3>
          <div className="flex flex-col gap-3">
            {mockResult.nextSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-secondary-foreground">{i + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ask AI CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate("/chat")}
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
