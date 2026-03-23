import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "I have ₹10,000, what business can I start?",
  "Which government loan is best for a tailoring business?",
  "How do I apply for PMMY loan?",
  "What schemes are available for women in food business?",
  "Explain Sukanya Samriddhi Yojana benefits",
];

// Simple offline AI responses based on keywords
function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("10,000") || lower.includes("10000") || lower.includes("small business")) {
    return `## Business Ideas with ₹10,000 Investment\n\nHere are some excellent options:\n\n### 1. **Tiffin Service** (₹5,000-8,000)\n- Start from home kitchen\n- Target: offices, PGs, students\n- Expected income: ₹15,000-25,000/month\n\n### 2. **Tailoring from Home** (₹8,000-10,000)\n- Buy a basic sewing machine\n- Start with alterations, then move to stitching\n- Expected income: ₹10,000-20,000/month\n\n### 3. **Beauty Services at Home** (₹5,000-10,000)\n- Start with basic beauty services\n- Build clientele through word of mouth\n- Expected income: ₹12,000-18,000/month\n\n### 4. **Pickle & Papad Making** (₹3,000-5,000)\n- Low investment, high demand\n- Sell locally or through Mahila E-Haat\n- Expected income: ₹8,000-15,000/month\n\n### 💡 Recommended Scheme\nApply for **PMMY Shishu Loan** — get up to ₹50,000 without collateral to expand your business.\n\n*Would you like to know more about any of these options?*`;
  }
  if (lower.includes("loan") || lower.includes("mudra") || lower.includes("pmmy")) {
    return `## Government Loans for Women Entrepreneurs\n\n### 🏦 Pradhan Mantri Mudra Yojana (PMMY)\n- **Shishu**: Up to ₹50,000 (no collateral)\n- **Kishore**: ₹50,000 – ₹5,00,000\n- **Tarun**: ₹5,00,000 – ₹10,00,000\n- **Interest**: 10-12% (varies by bank)\n- **Apply**: Visit nearest bank with Aadhaar + business plan\n\n### 🏦 Stand-Up India\n- ₹10 lakh to ₹1 crore for women/SC/ST entrepreneurs\n- For greenfield (new) enterprises only\n- Apply at standupmitra.in\n\n### 🏦 Stree Shakti Package (SBI)\n- 0.5% concession on interest for women with 50%+ ownership\n- No collateral up to ₹5 lakh\n\n### 📋 Documents Needed\n1. Aadhaar Card\n2. PAN Card\n3. Business Plan\n4. Address Proof\n5. Photos\n\n*Would you like step-by-step application guidance?*`;
  }
  if (lower.includes("scheme") || lower.includes("government")) {
    return `## Key Government Schemes for Women\n\n| Scheme | Type | Benefit |\n|--------|------|--------|\n| PMMY | Loan | Up to ₹10L collateral-free |\n| Stand-Up India | Loan | ₹10L-1Cr for new businesses |\n| PMKVY | Training | Free skill training + ₹8,000 reward |\n| Mahila E-Haat | Market | Online selling platform |\n| Annapurna | Loan | ₹50,000 for food business |\n| Stree Shakti | Loan | 0.5% interest concession |\n\n### How to Find the Right Scheme\n1. **For loans**: PMMY (small), Stand-Up India (large)\n2. **For training**: PMKVY, NSDC courses\n3. **For selling**: Mahila E-Haat\n4. **For savings**: Sukanya Samriddhi\n\n*Tell me your specific need and I'll recommend the best scheme!*`;
  }
  if (lower.includes("sukanya") || lower.includes("savings") || lower.includes("girl child")) {
    return `## Sukanya Samriddhi Yojana (SSY)\n\n### What is it?\nA savings scheme by the Government of India for the girl child, offering one of the highest interest rates among government schemes.\n\n### Key Details\n- **Interest Rate**: ~8.2% (tax-free)\n- **Min Deposit**: ₹250/year\n- **Max Deposit**: ₹1,50,000/year\n- **Lock-in**: Until girl turns 21\n- **Partial Withdrawal**: At 18 years (50%) for education\n\n### Tax Benefits\n- Deposit: Deductible under Section 80C\n- Interest: Tax-free\n- Maturity: Tax-free\n\n### How to Open\n1. Visit Post Office or authorized bank\n2. Bring girl's birth certificate\n3. Parent's Aadhaar + PAN\n4. Initial deposit of ₹250\n\n*This is one of the best long-term investments for your daughter's future!*`;
  }
  if (lower.includes("food") || lower.includes("tiffin") || lower.includes("catering")) {
    return `## Starting a Food Business\n\n### 🍱 Options\n1. **Tiffin Service**: ₹5,000-8,000 investment\n2. **Pickle/Papad**: ₹3,000-5,000\n3. **Catering**: ₹15,000-25,000\n4. **Sweet shop**: ₹10,000-20,000\n\n### Recommended Scheme: Annapurna\n- Loan up to ₹50,000\n- For women in food/catering\n- 36 monthly installments\n\n### Requirements\n- FSSAI License (₹100 for basic)\n- Hygienic kitchen space\n- Basic utensils\n\n### 📈 Growth Path\n1. Start small from home\n2. Build regular customers\n3. Get FSSAI certified\n4. List on Swiggy/Zomato\n5. Scale with MUDRA loan\n\n*Would you like help with the FSSAI registration process?*`;
  }
  return `## I Can Help You With\n\n- 💼 **Business Ideas** — Tell me your budget and interests\n- 🏦 **Government Loans** — PMMY, Stand-Up India, Annapurna\n- 📚 **Training Programs** — PMKVY, NSDC courses\n- 🛍️ **Selling Products** — Mahila E-Haat marketplace\n- 💰 **Financial Planning** — Savings, investments, insurance\n- 📋 **Application Help** — Step-by-step scheme guidance\n\n### Try asking:\n- "I have ₹10,000, what business can I start?"\n- "Which loan is best for tailoring?"\n- "What training is available in my area?"\n\n*I'm here to guide you on your entrepreneurial journey!*`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm your Aadhya AI Assistant. I can help you with:\n\n- **Business ideas** based on your budget\n- **Government schemes** and how to apply\n- **Loan guidance** — which loan is right for you\n- **Skill training** recommendations\n- **Financial planning** tips\n\nTry asking me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl mb-1">AI Financial Assistant</h1>
        <p className="text-muted-foreground">Ask about business ideas, loans, schemes, and financial guidance.</p>
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
              <div className="bg-muted rounded-xl px-4 py-3 text-sm text-muted-foreground">Thinking...</div>
            </div>
          )}
        </div>

        <div className="border-t p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1 rounded-full border hover:bg-muted transition-colors text-muted-foreground">
                {s.length > 40 ? s.slice(0, 40) + "..." : s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask about business, loans, schemes..."
              className="flex-1"
            />
            <Button onClick={() => send(input)} disabled={!input.trim() || isTyping} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
