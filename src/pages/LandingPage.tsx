import { motion } from "framer-motion";
import { Shield, ArrowRight, Scan, MessageCircle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";

const features = [
  {
    icon: Scan,
    title: "Scan Any Document",
    desc: "Photo-scan bills, EOBs, or insurance cards for instant plain-English breakdowns.",
  },
  {
    icon: MessageCircle,
    title: "AI-Powered Answers",
    desc: "Ask questions about your documents and get personalized, jargon-free explanations.",
  },
  {
    icon: BookOpen,
    title: "Learn As You Go",
    desc: "Build healthcare literacy with contextual tips on deductibles, copays, and more.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-elevated">
            <Shield size={18} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">ClearCare</span>
        </div>
        <button
          onClick={() => navigate("/auth")}
          className="text-sm font-medium text-primary hover:underline"
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <Shield size={36} className="text-primary-foreground" />
          </div>

          <h1 className="text-3xl font-bold text-foreground leading-tight mb-3">
            Healthcare,<br />
            <span className="text-primary">decoded.</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-sm mx-auto">
            Scan any medical bill or insurance document. Get a plain-English breakdown and AI-powered answers — instantly.
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="gradient-primary text-primary-foreground font-semibold text-base px-8 py-4 rounded-2xl shadow-elevated flex items-center gap-2 mx-auto"
          >
            Get Started
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Features */}
        <div className="mt-16 w-full max-w-md">
          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-card flex items-start gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <f.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center relative z-10">
        <p className="text-[11px] text-muted-foreground">© 2026 ClearCare. Your health data stays private.</p>
      </footer>
    </div>
  );
};

export default LandingPage;