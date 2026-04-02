import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, MessageCircle, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getQuickResponse(msg: string, state?: string | null): string {
  const lower = msg.toLowerCase();
  if (lower.includes("course") || lower.includes("training")) {
    return "🎓 Check out the **Training & Courses** section in the sidebar for:\n- PMKVY (free + ₹8,000 reward)\n- Beautician, Tailoring, Digital Marketing\n- All with certification!\n\n[Go to Courses →](/dashboard/courses)";
  }
  if (lower.includes("scheme") || lower.includes("government") || lower.includes("loan")) {
    return `🏦 Browse **Government Schemes** for:\n- PMMY (up to ₹10L)\n- Stand-Up India (₹10L-1Cr)\n${state ? `- State schemes for ${state}\n` : ""}\n[Go to Schemes →](/dashboard/schemes)`;
  }
  if (lower.includes("mentor")) {
    return "🧑‍🏫 Connect with verified mentors:\n- Business Strategy\n- Career Guidance\n- Technical Skills\n\n[Go to Mentorship →](/dashboard/mentorship)";
  }
  if (lower.includes("certificate") || lower.includes("verify")) {
    return "✅ Verify certificates:\n- Enter Certificate ID\n- Get instant verification\n- History saved to profile\n\n[Go to Certification →](/dashboard/certification)";
  }
  return `I can help with:\n- 📚 **Courses** — skill training\n- 🏦 **Schemes** — loans & subsidies\n- 🧑‍🏫 **Mentors** — guidance\n- 🤖 **Full AI Chat** — detailed answers\n\n[Open Full AI Assistant →](/dashboard/ai-assistant)`;
}

export default function AIChatWidget() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm your Aadhya assistant. Ask me about courses, schemes, or mentors!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input.trim() }]);
    const query = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getQuickResponse(query, profile?.state);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full hero-gradient shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-success text-[10px] text-white font-bold flex items-center justify-center">AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 h-[420px] rounded-2xl bg-card border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="hero-gradient px-4 py-3 flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="text-primary-foreground font-semibold text-sm flex-1">Aadhya Assistant</span>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "assistant" ? "hero-gradient" : "bg-muted"}`}>
                    {m.role === "assistant" ? <Bot className="h-3 w-3 text-primary-foreground" /> : <User className="h-3 w-3" />}
                  </div>
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-xs max-w-none dark:prose-invert [&_p]:my-1 [&_a]:text-primary [&_a]:underline">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full hero-gradient flex items-center justify-center"><Bot className="h-3 w-3 text-primary-foreground" /></div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-xs animate-pulse">Thinking...</div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t p-2 flex gap-1.5">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask me anything..."
                className="text-xs h-8"
              />
              <Button onClick={send} disabled={!input.trim() || isTyping} size="icon" className="h-8 w-8">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
