import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Shield, Sparkles } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "What does my deductible mean?",
  "Is this bill correct?",
  "How do I find in-network doctors?",
  "What's a copay vs coinsurance?",
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        default:
          "Great question! I'd be happy to help you understand your healthcare documents. Once the AI backend is connected, I'll give you personalized answers based on your specific documents and insurance plan. For now, feel free to explore the app!",
      };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responses.default },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-5 pt-6 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">ClearCare AI</h1>
            <p className="text-[11px] text-muted-foreground">Ask anything about healthcare</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <Shield size={28} className="text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-base font-semibold text-foreground">Hi! I'm your healthcare guide</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                Ask me anything about medical bills, insurance terms, or finding care.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="bg-card shadow-card text-sm text-foreground px-3.5 py-2 rounded-xl active:scale-[0.97] transition-transform"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] ${msg.role === "user" ? "self-end" : "self-start"}`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-card shadow-card text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="self-start bg-card shadow-card px-4 py-3 rounded-2xl rounded-bl-md"
              >
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse-soft [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-6 pt-3 border-t border-border bg-background">
        <div className="flex items-center gap-2 bg-card rounded-2xl shadow-card px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about your healthcare..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none py-1.5"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center disabled:opacity-30 active:scale-[0.9] transition-transform"
          >
            <ArrowUp size={16} className="text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
