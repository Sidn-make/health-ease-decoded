import { motion } from "framer-motion";
import { Scan, MessageCircle, Shield, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    icon: Scan,
    title: "Scan Document",
    desc: "Photo-scan any bill or EOB",
    path: "/scan",
    gradient: "gradient-primary",
  },
  {
    icon: MessageCircle,
    title: "Ask ClearCare AI",
    desc: "Get answers in plain English",
    path: "/chat",
    gradient: "gradient-warm",
  },
];

const tips = [
  {
    title: "What's an EOB?",
    desc: "An Explanation of Benefits shows what your insurance paid — and what you owe.",
  },
  {
    title: "In-Network vs Out",
    desc: "In-network doctors cost less because they have deals with your insurer.",
  },
  {
    title: "Deductible 101",
    desc: "The amount you pay before insurance kicks in each year.",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-card">
            <Shield size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">ClearCare</h1>
            <p className="text-xs text-muted-foreground">Healthcare, decoded</p>
          </div>
        </motion.div>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-5 p-5 rounded-2xl gradient-primary shadow-elevated"
      >
        <h2 className="text-lg font-semibold text-primary-foreground mb-1">
          Confused by a medical bill?
        </h2>
        <p className="text-sm text-primary-foreground/80 mb-4 leading-relaxed">
          Snap a photo of any bill, EOB, or insurance document. We'll break it down in plain English.
        </p>
        <button
          onClick={() => navigate("/scan")}
          className="flex items-center gap-2 bg-card text-primary font-semibold text-sm px-4 py-2.5 rounded-xl shadow-card active:scale-[0.98] transition-transform"
        >
          <Scan size={16} />
          Scan Now
          <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => navigate(action.path)}
              className="bg-card rounded-2xl p-4 shadow-card text-left active:scale-[0.97] transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl ${action.gradient} flex items-center justify-center mb-3`}>
                <action.icon size={18} className="text-primary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Learn section */}
      <div className="px-5 mt-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Learn the Basics</h3>
        <div className="flex flex-col gap-2.5">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="bg-card rounded-xl p-4 shadow-card"
            >
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
