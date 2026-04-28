import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, User, Briefcase, Landmark, GraduationCap, MapPin, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { generateAssistantReply, type AssistantMessage } from "@/data/assistantEngine";

const quickButtons = [
  { label: "Best for Me", icon: Sparkles, query: "What courses and schemes are best for me based on my profile?" },
  { label: "Start Business", icon: Briefcase, query: "I want to start a business with low investment. What are my options?" },
  { label: "My State Schemes", icon: Landmark, query: "What government schemes are available in my state?" },
  { label: "Explore Courses", icon: GraduationCap, query: "Which skill courses are best for women to get employment?" },
];

export default function AIAssistantPage() {
  const { profile, questionnaire } = useAuth();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const storageKey = useMemo(() => `aadhya-ai-chat-${profile?.full_name ?? "guest"}`, [profile?.full_name]);

  useEffect(() => {
    const greeting = `Namaste${profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 🙏 I am your AI guide with memory and personalized context.\n\nI use your skills, interests, location, and previous chat activity to give structured suggestions, clear next steps, and follow-up guidance.`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AssistantMessage[];
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
          return;
        }
      } catch {
        // ignore invalid cache
      }
    }
    setMessages([{ role: "assistant", content: greeting }]);
  }, [profile?.full_name, questionnaire, storageKey]);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
    }
  }, [messages, storageKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    "What's best for me?",
    questionnaire ? "Schemes in my state and city" : "Government schemes for women",
    "Give me a 30-day business launch plan",
    "How to apply for Mudra Loan with documents?",
    "Best courses based on my skill level",
    questionnaire?.interests?.[0] ? `Create a roadmap for ${questionnaire.interests[0]}` : "Jobs for women",
  ];

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AssistantMessage = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      try {
        const reply = generateAssistantReply(
          text,
          [...messages, userMsg],
          {
            fullName: profile?.full_name,
            state: profile?.state,
            city: profile?.city,
            interest: profile?.interest,
          },
          questionnaire || undefined
        );
        setMessages(prev => [...prev, { role: "assistant", content: reply.content }]);
        setFollowUpSuggestions(reply.followUps);
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content:
              "I am not fully sure about this yet. Please share your goal, budget, and timeline, and I will give a precise step-by-step answer.",
          },
        ]);
        setFollowUpSuggestions([
          "What is your exact goal?",
          "What budget range do you have?",
          "Which location should I focus on?",
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 400 + Math.random() * 500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl mb-1">AI Personal Assistant</h1>
        <p className="text-muted-foreground">
          Ask about business ideas, loans, schemes, jobs, and financial guidance.
          {profile?.state && <span className="text-primary ml-1 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />Personalized for {profile.state}</span>}
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "assistant" ? "hero-gradient" : "bg-muted"}`}>
                {m.role === "assistant" ? <Bot className="h-4 w-4 text-primary-foreground" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert [&_table]:text-xs [&_th]:p-2 [&_td]:p-2">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full hero-gradient flex items-center justify-center"><Bot className="h-4 w-4 text-primary-foreground" /></div>
              <div className="bg-muted rounded-xl px-4 py-3 text-sm text-muted-foreground animate-pulse">Thinking...</div>
            </div>
          )}
        </div>

        <div className="border-t p-3 space-y-2">
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-1.5">
            {quickButtons.map(b => (
              <button key={b.label} onClick={() => send(b.query)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                <b.icon className="h-3 w-3" />
                {b.label}
              </button>
            ))}
          </div>
          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full border hover:bg-muted transition-colors text-muted-foreground">
                {s.length > 42 ? s.slice(0, 42) + "..." : s}
              </button>
            ))}
          </div>
          {followUpSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {followUpSuggestions.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-foreground hover:opacity-90 transition-opacity"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              id="ai-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask about business, loans, schemes, jobs..."
              className="flex-1"
            />
            <Button id="ai-chat-send" onClick={() => send(input)} disabled={!input.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
