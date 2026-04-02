import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, User, Briefcase, Landmark, GraduationCap, Search, MapPin, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickButtons = [
  { label: "Best for Me", icon: Sparkles, query: "What courses and schemes are best for me based on my profile?" },
  { label: "Start Business", icon: Briefcase, query: "I want to start a business with low investment. What are my options?" },
  { label: "My State Schemes", icon: Landmark, query: "What government schemes are available in my state?" },
  { label: "Explore Courses", icon: GraduationCap, query: "Which skill courses are best for women to get employment?" },
];

function getContextualResponse(msg: string, profile: ReturnType<typeof useAuth>["profile"], questionnaire: ReturnType<typeof useAuth>["questionnaire"]): string {
  const lower = msg.toLowerCase();
  const userName = profile?.full_name?.split(" ")[0] || "there";
  const userState = profile?.state || "";
  const userCity = profile?.city || "";

  // Personalized "best for me" response
  if (lower.includes("best for me") || lower.includes("recommend") || lower.includes("personalized") || lower.includes("my profile")) {
    const interests = questionnaire?.interests?.join(", ") || "general skills";
    const goal = questionnaire?.primaryGoal || "career growth";
    const skill = questionnaire?.skillLevel || "beginner";
    const budget = questionnaire?.budget || "flexible";
    const location = userState ? `in ${userCity ? userCity + ", " : ""}${userState}` : "";

    return `## Personalized Recommendations for ${userName}! 🎯\n\nBased on your profile, here's what I recommend:\n\n### 📋 Your Profile Summary\n- **Goal**: ${goal}\n- **Interests**: ${interests}\n- **Skill Level**: ${skill}\n- **Budget**: ${budget}\n${location ? `- **Location**: ${location}\n` : ""}\n\n### 🎓 Recommended Courses\n${questionnaire?.interests?.some(i => i.includes("Beauty")) ? "1. **Beautician & Cosmetology** — Free 3-month NSDC course\n" : ""}${questionnaire?.interests?.some(i => i.includes("Business")) ? "1. **Business & Entrepreneurship** — 3-month NIESBUD program\n" : ""}${questionnaire?.interests?.some(i => i.includes("Technology")) ? "1. **Digital Marketing** — Free Google certification\n" : ""}${questionnaire?.interests?.some(i => i.includes("Food")) ? "1. **Food Processing** — 3-month KVIC training\n" : ""}${questionnaire?.interests?.some(i => i.includes("Arts")) ? "1. **Handicraft Training** — 4-month artisan program\n" : ""}${!questionnaire?.interests?.length ? "1. **PMKVY Training** — Free certification + ₹8,000 reward\n2. **Digital Marketing** — Free Google certification\n" : ""}\n### 🏦 Recommended Schemes\n${budget.includes("Low") ? "- **PMMY Shishu Loan** — Up to ₹50,000, no collateral\n" : ""}${budget.includes("Medium") ? "- **PMMY Kishore Loan** — ₹50,000 to ₹5 lakh\n" : ""}${budget.includes("High") ? "- **Stand-Up India** — ₹10 lakh to ₹1 crore\n" : ""}- **PMKVY** — Free training + ₹8,000 reward\n${userState ? `\n### 📍 Schemes in ${userState}\n` + getStateSchemes(userState) : ""}\n\n*Ask me about any specific scheme or course for more details!*`;
  }

  // State-specific response
  if (lower.includes("my state") || lower.includes("in my") || (userState && lower.includes(userState.toLowerCase()))) {
    const state = userState || "your state";
    return `## Schemes & Opportunities in ${state} 📍\n\n${getStateSchemes(state)}\n\n### 🎓 Training Centers\n- PMKVY centers available across ${state}\n- DDU-GKY residential training programs\n- State skill development centers\n\n### 💡 Tip\nVisit your nearest **District Industries Centre (DIC)** for personalized guidance on state-specific benefits.\n\n*Would you like details on any specific ${state} scheme?*`;
  }

  // Business ideas based on budget
  if (lower.includes("5000") || lower.includes("5,000")) {
    return `## Business Ideas with ₹5,000 Investment${userName !== "there" ? ` for ${userName}` : ""}\n\n### 1. **Mehndi/Henna Art** (₹1,000-3,000)\n- Buy henna cones and practice designs\n- Earn ₹500-2,000 per event\n- Expected income: ₹8,000-15,000/month\n\n### 2. **Homemade Snacks** (₹2,000-4,000)\n- Make namkeen, chips, murukku\n- Sell at local shops or online\n- Expected income: ₹6,000-12,000/month\n\n### 3. **Candle & Incense Making** (₹3,000-5,000)\n- Trending craft business\n- Sell on Amazon, Flipkart\n- Expected income: ₹8,000-18,000/month\n\n### 4. **Mobile Recharge & Bill Payment** (₹2,000-5,000)\n- Start a digital services point\n- Earn commission per transaction\n- Expected income: ₹5,000-10,000/month\n\n### 💡 Recommended Next Steps\n1. Apply for **PMMY Shishu Loan** (up to ₹50,000 no collateral)\n2. Register on **Mahila E-Haat** to sell products online\n3. Take free **PMKVY training** to upgrade skills\n\n*Which business interests you? I can give you a detailed plan!*`;
  }

  if (lower.includes("mudra") || lower.includes("pmmy")) {
    return `## Pradhan Mantri Mudra Yojana (PMMY)\n\n### 🏦 Three Categories\n\n| Category | Amount | For |\n|----------|--------|-----|\n| **Shishu** | Up to ₹50,000 | New businesses |\n| **Kishore** | ₹50,000 - ₹5 lakh | Growing businesses |\n| **Tarun** | ₹5 lakh - ₹10 lakh | Established businesses |\n\n### ✅ Key Benefits\n- **No collateral needed**\n- No processing fee\n- Women get priority\n- Available at all banks\n\n### 📋 Documents Required\n1. Aadhaar Card\n2. PAN Card\n3. Business plan (1-2 pages)\n4. 2 passport photos\n5. Address proof\n6. Bank statements (6 months)\n\n### 📝 How to Apply\n1. Visit nearest bank branch\n2. Ask for MUDRA loan application form\n3. Submit documents + business plan\n4. Bank processes in 7-10 days\n5. Loan disbursed to account\n\n### 🌐 Online Application\nVisit **mudra.org.in** or apply through:\n- Bank website\n- Jan Dhan app\n- CSC center\n\n${questionnaire?.budget?.includes("Low") ? "**💡 Based on your budget, I recommend starting with Shishu category.**\n\n" : ""}*Would you like help writing a business plan for your MUDRA loan application?*`;
  }

  if (lower.includes("stand-up india") || lower.includes("stand up india") || lower.includes("standup")) {
    return `## Stand-Up India Scheme\n\n### 🎯 Purpose\nLoans between ₹10 lakh to ₹1 crore for women & SC/ST entrepreneurs to start **new businesses** (greenfield enterprises).\n\n### ✅ Eligibility\n- Women entrepreneur (18+ years)\n- New business (not existing)\n- Manufacturing, services, or trading sector\n- Should not be a defaulter\n\n### 💰 Loan Details\n- **Amount**: ₹10 lakh to ₹1 crore\n- **Interest**: Base rate + 3% + tenure premium\n- **Repayment**: 7 years (with 18 months moratorium)\n- **Margin**: 25% (can include subsidy)\n\n### 📝 How to Apply\n1. Visit **standupmitra.in**\n2. Register with details\n3. Choose bank branch\n4. Submit application online\n5. Meet bank manager\n\n*This is excellent for starting a manufacturing or service business!*`;
  }

  if (lower.includes("loan") || lower.includes("finance") || lower.includes("bank")) {
    return `## Government Loans for Women Entrepreneurs\n\n### 🏦 Top Loan Schemes\n\n| Scheme | Amount | Interest | Collateral |\n|--------|--------|----------|------------|\n| **PMMY Shishu** | Up to ₹50,000 | 10-12% | No |\n| **PMMY Kishore** | ₹50K - ₹5L | 10-14% | No |\n| **PMMY Tarun** | ₹5L - ₹10L | 12-16% | Yes |\n| **Stand-Up India** | ₹10L - ₹1Cr | 10-12% | Yes |\n| **Annapurna** | ₹50,000 | 12% | No |\n| **Stree Shakti** | Varies | Base-0.5% | No (≤₹5L) |\n| **PMEGP** | Up to ₹25L | + 25-35% subsidy | Partial |\n\n${questionnaire?.budget ? `### 💡 Based on your budget (${questionnaire.budget})\n${questionnaire.budget.includes("Low") ? "I recommend **PMMY Shishu** — easiest to get, no collateral." : questionnaire.budget.includes("Medium") ? "I recommend **PMMY Kishore** or **PMEGP** for best subsidy." : "I recommend **Stand-Up India** for maximum funding."}\n\n` : ""}*Which loan amount are you looking for? I'll recommend the best option.*`;
  }

  if (lower.includes("scheme") || lower.includes("government") || lower.includes("yojana")) {
    return `## Key Government Schemes for Women\n\n| # | Scheme | Type | Key Benefit |\n|---|--------|------|------------|\n| 1 | **PMMY** | Loan | Up to ₹10L, no collateral |\n| 2 | **Stand-Up India** | Loan | ₹10L-1Cr for new businesses |\n| 3 | **PMEGP** | Subsidy | 25-35% subsidy on project |\n| 4 | **Startup India** | Support | Tax holiday + funding |\n| 5 | **Mahila E-Haat** | Market | Free online selling platform |\n| 6 | **DDU-GKY** | Training | Free training + placement |\n| 7 | **PMKVY** | Training | Free certification + ₹8,000 |\n| 8 | **Annapurna** | Loan | ₹50,000 for food business |\n| 9 | **Stree Shakti** | Loan | 0.5% interest concession |\n| 10 | **Sukanya Samriddhi** | Savings | 8.2% tax-free for girls |\n\n${userState ? `### 📍 State-Specific (${userState})\n${getStateSchemes(userState)}\n\n` : ""}### How to Choose\n- 💰 **Need money?** → PMMY, Stand-Up India\n- 📚 **Want training?** → DDU-GKY, PMKVY\n- 🛍️ **Want to sell?** → Mahila E-Haat\n\n*Tell me your specific need — I'll recommend the perfect scheme!*`;
  }

  if (lower.includes("course") || lower.includes("training") || lower.includes("learn") || lower.includes("skill")) {
    return `## Skill Courses Recommended${userName !== "there" ? ` for ${userName}` : ""}\n\n### 🎓 Top Courses\n\n| Course | Duration | Cost | Platform |\n|--------|----------|------|----------|\n| **Tailoring & Fashion** | 3-6 months | Free (PMKVY) | NSDC |\n| **Beautician** | 3 months | Free (PMKVY) | Local center |\n| **Digital Marketing** | 2 months | Free | Google Garage |\n| **Food Processing** | 3 months | Free (PMKVY) | FCI |\n| **Handicrafts** | 2-4 months | Free | DC Handicrafts |\n\n${questionnaire?.interests?.length ? `### 💡 Based on Your Interests (${questionnaire.interests.slice(0, 3).join(", ")})\n${questionnaire.interests.some(i => i.includes("Beauty")) ? "- **Beautician Training** — Perfect match!\n" : ""}${questionnaire.interests.some(i => i.includes("Business")) ? "- **Business & Entrepreneurship** — Direct match!\n" : ""}${questionnaire.interests.some(i => i.includes("Technology")) ? "- **Digital Marketing** — Google certified!\n" : ""}${questionnaire.interests.some(i => i.includes("Food")) ? "- **Food Processing** — Great opportunity!\n" : ""}\n` : ""}*Which course interests you? I'll guide you step by step!*`;
  }

  if (lower.includes("business") || lower.includes("start") || lower.includes("idea")) {
    return `## Business Ideas${userName !== "there" ? ` for ${userName}` : ""}\n\n### By Investment Level\n\n#### 💰 Low Investment (₹1,000-10,000)\n1. Mehndi Art, Homemade Snacks, Candle Making\n2. Mobile recharge, Tiffin service\n\n#### 💰💰 Medium Investment (₹10,000-50,000)\n1. Tailoring from home, Beauty services\n2. Pickle/papad business, Digital services\n\n#### 💰💰💰 Higher Investment (₹50,000+)\n1. Full beauty salon, Cloud kitchen\n2. Boutique, Training center\n\n${questionnaire?.businessType ? `### 💡 Based on your preference (${questionnaire.businessType})\n${questionnaire.businessType.includes("Handmade") ? "Focus on **handicraft** and **artisan** products — great margins on Mahila E-Haat!\n" : ""}${questionnaire.businessType.includes("Digital") ? "Start with **freelancing** — content writing, social media management, graphic design.\n" : ""}${questionnaire.businessType.includes("Food") ? "Start a **tiffin service** or **pickle business** — low investment, high demand.\n" : ""}\n` : ""}\n### 🚀 Recommended Funding\n- PMMY Shishu for small start\n- PMEGP for subsidy-backed projects\n\n*Tell me your budget and I'll give you a detailed plan!*`;
  }

  if (lower.includes("job") || lower.includes("employment") || lower.includes("work") || lower.includes("career")) {
    return `## Job & Career Opportunities\n\n### 💼 In-Demand Jobs\n\n| Job | Salary Range | Training Needed |\n|-----|-------------|----------------|\n| Data Entry Operator | ₹8K-15K/month | Basic computer |\n| Beauty Therapist | ₹10K-25K/month | 3-6 months |\n| Tailor/Fashion | ₹8K-20K/month | 3-6 months |\n| Digital Marketing | ₹12K-30K/month | 2-3 months |\n| Customer Support | ₹10K-18K/month | Communication |\n\n### 🏠 Work From Home Options\n- Freelance writing/design\n- Online tutoring\n- Data entry, Virtual assistant\n- Social media management\n\n### 📝 Job Portals for Women\n- **JobsForHer.com** — women-focused\n- **HerSecondInnings.com** — career restart\n- **Sheroes.in** — women community\n\n*What type of work are you looking for?*`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("hey")) {
    return `## Namaste${userName !== "there" ? `, ${userName}` : ""}! 🙏 Welcome to Aadhya AI Assistant\n\nI'm here to help you with:\n\n- 💼 **Business Ideas** — based on your budget\n- 🏦 **Government Loans** — PMMY, Stand-Up India, PMEGP\n- 📚 **Free Training** — PMKVY, DDU-GKY courses\n- 🛍️ **Selling Products** — Mahila E-Haat, online platforms\n- 📍 **Local Opportunities** — schemes in ${userState || "your state"}\n\n${questionnaire ? `### Your Profile\n- **Goal**: ${questionnaire.primaryGoal || "Not set"}\n- **Interests**: ${questionnaire.interests?.join(", ") || "Not set"}\n- **Skill Level**: ${questionnaire.skillLevel || "Not set"}\n\nI'll personalize my answers based on your profile!\n\n` : ""}### Try these questions:\n- "What's best for me?"\n- "Schemes in my state"\n- "Business ideas for my budget"\n\n*Just type your question!*`;
  }

  // Default fallback
  return `## I Can Help You With${userName !== "there" ? `, ${userName}` : ""}\n\n🔍 Here are topics I can guide you on:\n\n### 💼 Business\n- Business ideas by budget\n- Step-by-step business plans\n- How to sell products online\n\n### 🏦 Loans & Schemes\n- **PMMY/Mudra** — Up to ₹10 lakh\n- **Stand-Up India** — ₹10L to ₹1Cr\n- **PMEGP** — 25-35% subsidy\n${userState ? `- **${userState} schemes** — State-specific benefits\n` : ""}\n### 📚 Training & Jobs\n- **PMKVY** — Free training + ₹8,000\n- **DDU-GKY** — Free training + job placement\n- Job opportunities for women\n\n### 💡 Try asking:\n- "What's best for me?"\n- "Business ideas with ₹5,000"\n- "Schemes in my state"\n- "How to sell products online?"\n\n*I'm your personal guide to financial independence!*`;
}

function getStateSchemes(state: string): string {
  const stateSchemes: Record<string, string> = {
    "Tamil Nadu": "- **Magalir Thittam** — Women SHG empowerment program\n- **TNSRLM** — Rural livelihood mission, bank linkage\n- **Pudhu Vaazhvu** — Livelihood support for rural women\n- **Helpline**: 1800-425-1002",
    "Maharashtra": "- **CMEGP** — 25-35% subsidy on projects\n- **Ladki Bahin Yojana** — Monthly financial assistance\n- **MAVIM** — Mahila Arthik Vikas Mahamandal support",
    "Karnataka": "- **Udyogini Scheme** — Soft loans for women\n- **Stree Shakti** — SHG empowerment\n- **Sanjeevini** — Rural livelihood mission",
    "Kerala": "- **Kudumbashree** — India's largest women SHG network\n- **WE Mission** — Women Entrepreneurship Mission\n- **KESM** — Kerala Self Employment Mission",
    "Rajasthan": "- **Priyadarshini** — SHG enterprise promotion\n- **Bhamashah** — Financial inclusion for women\n- **Palanhar** — Support for vulnerable women",
    "West Bengal": "- **Kanyashree Prakalpa** — ₹25,000 grant for girls at 18\n- **Lakshmir Bhandar** — Monthly income support\n- **Rupashree** — Marriage assistance",
    "Gujarat": "- **Mahila Samridhi** — Women empowerment program\n- **Sakhi Mandal** — SHG support scheme\n- **Mission Mangalam** — Livelihood mission",
    "Uttar Pradesh": "- **BC Sakhi** — Banking correspondent scheme\n- **Kanya Sumangala** — Girl child support (₹15,000)\n- **Mahila Samakhya** — Women's education program",
    "Delhi": "- **Ladli Scheme** — Financial support for girls\n- **Mahila Samman** — Monthly assistance\n- **Working Women Hostel** — Safe accommodation",
    "Telangana": "- **She Teams** — Women safety program\n- **Aasra** — Pension for single women\n- **KCR Kit** — ₹12,000 for pregnant women",
    "Andhra Pradesh": "- **She Teams** — Women safety\n- **YSR Aasara** — SHG loan waiver\n- **Jagananna Chedodu** — ₹10,000 for tailors/washermen",
    "Bihar": "- **Mukhyamantri Kanya** — Marriage assistance\n- **JEEViKA** — Bihar Rural Livelihood Mission\n- **Cycle Yojana** — Free bicycles for girls",
  };
  return stateSchemes[state] || `Contact your **District Women & Child Development Office** for state-specific schemes in ${state}.`;
}

export default function AIAssistantPage() {
  const { profile, questionnaire } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Set initial greeting based on profile
  useEffect(() => {
    const userName = profile?.full_name?.split(" ")[0] || "";
    const greeting = `Namaste${userName ? `, ${userName}` : ""}! 🙏 I'm your **Aadhya AI Assistant**. I can help you with:\n\n- 💼 **Business ideas** based on your budget\n- 🏦 **Government schemes** — PMMY, Stand-Up India, PMEGP\n- 📚 **Free training** — PMKVY, DDU-GKY courses\n- 💰 **Loan guidance** — which loan is right for you\n- 📍 **Local opportunities** — schemes in ${profile?.state || "your state"}\n\n${questionnaire ? `I have your profile data — my answers will be **personalized** for you!\n\n` : ""}Use the **quick buttons** below or type your question!`;
    setMessages([{ role: "assistant", content: greeting }]);
  }, [profile, questionnaire]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const suggestions = [
    "What's best for me?",
    questionnaire ? "Schemes in my state" : "Government schemes for women",
    "Business ideas with ₹5,000",
    "How to apply for Mudra Loan?",
    "Best courses for women",
    questionnaire?.interests?.[0] ? `Tell me about ${questionnaire.interests[0]}` : "Jobs for women",
  ];

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getContextualResponse(text, profile, questionnaire);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
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
