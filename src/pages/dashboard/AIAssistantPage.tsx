import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bot, Send, User, Briefcase, Landmark, GraduationCap, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickButtons = [
  { label: "Start Business", icon: Briefcase, query: "I want to start a business with low investment. What are my options?" },
  { label: "Find Loan", icon: Landmark, query: "What government loans are available for women entrepreneurs?" },
  { label: "Get Job", icon: Search, query: "What job opportunities and training programs are available for women?" },
  { label: "Explore Courses", icon: GraduationCap, query: "Which skill courses are best for women to get employment?" },
];

const suggestions = [
  "I have ₹5,000, what business can I start?",
  "What loans are available for tailoring business?",
  "How to apply for Mudra Loan?",
  "Which course is best for me?",
  "Explain Stand-Up India scheme",
  "What is PMEGP scheme?",
  "Jobs for women in my area",
  "How to sell products online?",
];

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();

  if (lower.includes("5000") || lower.includes("5,000")) {
    return `## Business Ideas with ₹5,000 Investment\n\n### 1. **Mehndi/Henna Art** (₹1,000-3,000)\n- Buy henna cones and practice designs\n- Earn ₹500-2,000 per event\n- Expected income: ₹8,000-15,000/month\n\n### 2. **Homemade Snacks** (₹2,000-4,000)\n- Make namkeen, chips, murukku\n- Sell at local shops or online\n- Expected income: ₹6,000-12,000/month\n\n### 3. **Candle & Incense Making** (₹3,000-5,000)\n- Trending craft business\n- Sell on Amazon, Flipkart\n- Expected income: ₹8,000-18,000/month\n\n### 4. **Mobile Recharge & Bill Payment** (₹2,000-5,000)\n- Start a digital services point\n- Earn commission per transaction\n- Expected income: ₹5,000-10,000/month\n\n### 💡 Recommended Next Steps\n1. Apply for **PMMY Shishu Loan** (up to ₹50,000 no collateral)\n2. Register on **Mahila E-Haat** to sell products online\n3. Take free **PMKVY training** to upgrade skills\n\n*Which business interests you? I can give you a detailed plan!*`;
  }

  if (lower.includes("10,000") || lower.includes("10000") || lower.includes("small business")) {
    return `## Business Ideas with ₹10,000 Investment\n\n### 1. **Tiffin Service** (₹5,000-8,000)\n- Start from home kitchen\n- Target: offices, PGs, students\n- Expected income: ₹15,000-25,000/month\n\n### 2. **Tailoring from Home** (₹8,000-10,000)\n- Buy a basic sewing machine\n- Start with alterations, then move to stitching\n- Expected income: ₹10,000-20,000/month\n\n### 3. **Beauty Services at Home** (₹5,000-10,000)\n- Start with basic beauty services\n- Build clientele through word of mouth\n- Expected income: ₹12,000-18,000/month\n\n### 4. **Pickle & Papad Making** (₹3,000-5,000)\n- Low investment, high demand\n- Sell locally or through Mahila E-Haat\n- Expected income: ₹8,000-15,000/month\n\n### 💡 Recommended Scheme\nApply for **PMMY Shishu Loan** — get up to ₹50,000 without collateral to expand your business.\n\n*Would you like to know more about any of these options?*`;
  }

  if (lower.includes("mudra") || lower.includes("pmmy")) {
    return `## Pradhan Mantri Mudra Yojana (PMMY)\n\n### 🏦 Three Categories\n\n| Category | Amount | For |\n|----------|--------|-----|\n| **Shishu** | Up to ₹50,000 | New businesses |\n| **Kishore** | ₹50,000 - ₹5 lakh | Growing businesses |\n| **Tarun** | ₹5 lakh - ₹10 lakh | Established businesses |\n\n### ✅ Key Benefits\n- **No collateral needed**\n- No processing fee\n- Women get priority\n- Available at all banks\n\n### 📋 Documents Required\n1. Aadhaar Card\n2. PAN Card\n3. Business plan (1-2 pages)\n4. 2 passport photos\n5. Address proof\n6. Bank statements (6 months)\n\n### 📝 How to Apply\n1. Visit nearest bank branch\n2. Ask for MUDRA loan application form\n3. Submit documents + business plan\n4. Bank processes in 7-10 days\n5. Loan disbursed to account\n\n### 🌐 Online Application\nVisit **mudra.org.in** or apply through:\n- Bank website\n- Jan Dhan app\n- CSC center\n\n*Would you like help writing a business plan for your MUDRA loan application?*`;
  }

  if (lower.includes("stand-up india") || lower.includes("stand up india") || lower.includes("standup")) {
    return `## Stand-Up India Scheme\n\n### 🎯 Purpose\nLoans between ₹10 lakh to ₹1 crore for women & SC/ST entrepreneurs to start **new businesses** (greenfield enterprises).\n\n### ✅ Eligibility\n- Women entrepreneur (18+ years)\n- New business (not existing)\n- Manufacturing, services, or trading sector\n- Should not be a defaulter\n\n### 💰 Loan Details\n- **Amount**: ₹10 lakh to ₹1 crore\n- **Interest**: Base rate + 3% + tenure premium\n- **Repayment**: 7 years (with 18 months moratorium)\n- **Margin**: 25% (can include subsidy)\n\n### 📋 Documents\n1. Identity proof (Aadhaar/PAN)\n2. Address proof\n3. Business plan\n4. Project report\n5. IT returns (if any)\n\n### 📝 How to Apply\n1. Visit **standupmitra.in**\n2. Register with details\n3. Choose bank branch\n4. Submit application online\n5. Meet bank manager\n\n*This is excellent for starting a manufacturing or service business!*`;
  }

  if (lower.includes("pmegp")) {
    return `## PMEGP (Prime Minister's Employment Generation Programme)\n\n### 🎯 Purpose\nGenerate employment through micro-enterprise setup in rural & urban areas.\n\n### 💰 Benefits\n- **Urban Women**: 25% subsidy on project cost\n- **Rural Women**: 35% subsidy on project cost\n- Project cost up to ₹25 lakh (manufacturing)\n- Project cost up to ₹10 lakh (services)\n\n### ✅ Eligibility\n- Age: 18+ years\n- Education: 8th pass (for projects above ₹10 lakh)\n- New projects only\n- No income limit\n\n### 📋 Steps to Apply\n1. Visit **kviconline.gov.in**\n2. Click on PMEGP e-portal\n3. Fill online application\n4. Upload documents\n5. District committee reviews\n6. Training provided\n7. Loan sanctioned\n\n### 🔑 Important\n- You need 5-10% of project cost as your contribution\n- Balance from bank loan\n- Subsidy goes directly to bank\n\n*Would you like to calculate the subsidy for your project?*`;
  }

  if (lower.includes("startup india")) {
    return `## Startup India Scheme\n\n### 🎯 Purpose\nPromote innovation and startups with funding, tax benefits, and mentoring.\n\n### 💰 Benefits\n- **Tax holiday**: 3 years income tax exemption\n- **Self-certification**: Easy compliance\n- **Fund of Funds**: ₹10,000 crore corpus\n- **Fast patent filing**: 80% rebate on fees\n- **Easy winding up**: Close business in 90 days\n\n### ✅ Registration Steps\n1. Visit **startupindia.gov.in**\n2. Click "Register"\n3. Fill startup details\n4. Upload incorporation certificate\n5. Get recognition number\n6. Apply for tax benefits via DPIIT\n\n### 👩‍💼 Women-Specific Benefits\n- Additional grants for women-led startups\n- Mentoring through women entrepreneurship platform\n- Access to incubators\n\n*Would you like help registering your startup?*`;
  }

  if (lower.includes("mahila e-haat") || lower.includes("e-haat") || lower.includes("sell online") || lower.includes("sell products")) {
    return `## Mahila E-Haat – Online Marketplace for Women\n\n### 🎯 What is it?\nGovernment platform where women entrepreneurs can **sell products directly online** — no middlemen!\n\n### 🛍️ What You Can Sell\n- Handicrafts & handloom\n- Food products\n- Clothing & accessories\n- Home decor\n- Beauty products\n- Any women-made product\n\n### ✅ How to Register\n1. Visit **mahilaehaat-rmk.gov.in**\n2. Click "Vendor Registration"\n3. Fill details + upload products\n4. Get verified\n5. Start selling!\n\n### 💡 Tips for Success\n- Take good product photos\n- Write clear descriptions\n- Price competitively\n- Respond to queries quickly\n- Also list on Amazon Saheli\n\n### 📱 Other Platforms\n- **Amazon Saheli**: amazon.in/saheli\n- **Flipkart Samarth**: flipkart.com\n- **GeM**: gem.gov.in (government purchases)\n\n*I can help you create product listings. What do you make?*`;
  }

  if (lower.includes("ddu-gky") || lower.includes("ddu gky") || lower.includes("gramin kaushalya")) {
    return `## DDU-GKY (Deen Dayal Upadhyaya Grameen Kaushalya Yojana)\n\n### 🎯 Purpose\nFree skill training + guaranteed job placement for rural youth (15-35 years).\n\n### 💰 Benefits\n- **Completely free training**\n- Residential training with food & hostel\n- ₹8,000 post-placement support\n- Job placement guarantee\n- 3-12 months training\n\n### 📚 Courses Available\n- Retail Sales\n- Beauty & Wellness\n- Healthcare\n- IT/ITES\n- Hospitality\n- Electronics\n- Automobile\n- Construction\n\n### ✅ Eligibility\n- Age: 15-35 years (women up to 45)\n- Rural poor household\n- No income tax payer family\n\n### 📝 How to Apply\n1. Visit nearest Gram Panchayat\n2. Or call **1800-180-6070** (toll-free)\n3. Register at **ddugky.gov.in**\n4. Choose training center\n5. Start training!\n\n*This is perfect if you want free certified training with job guarantee!*`;
  }

  if (lower.includes("skill india") || lower.includes("pmkvy")) {
    return `## Skill India / PMKVY\n\n### 🎯 Pradhan Mantri Kaushal Vikas Yojana\nFree short-term skill training with government certification.\n\n### 💰 Benefits\n- **Free training** (no fees)\n- ₹8,000 reward on certification\n- Industry-recognized certificate\n- Placement assistance\n- 150-300 hours training\n\n### 📚 Popular Courses for Women\n| Course | Duration | Reward |\n|--------|----------|--------|\n| Beauty Therapy | 200 hrs | ₹8,000 |\n| Tailoring | 200 hrs | ₹8,000 |\n| Healthcare | 300 hrs | ₹8,000 |\n| Retail Sales | 150 hrs | ₹8,000 |\n| Data Entry | 200 hrs | ₹8,000 |\n| Food Processing | 200 hrs | ₹8,000 |\n\n### 📝 How to Enroll\n1. Visit **pmkvyofficial.org**\n2. Find nearest training center\n3. Walk in with Aadhaar card\n4. Choose course\n5. Start training!\n\n### 📞 Helpline: 1800-123-9626 (toll-free)\n\n*Which skill interests you? I can find the nearest training center!*`;
  }

  if (lower.includes("tamil nadu") || lower.includes("tn scheme")) {
    return `## Tamil Nadu Women Development Schemes\n\n### 🎯 Key Schemes\n\n#### 1. Pudhu Vaazhvu Project\n- Livelihood support for rural women\n- SHG formation & training\n- Micro-credit support\n\n#### 2. TANSTIA-FNF\n- Women entrepreneurship development\n- Technical training\n- Marketing support\n\n#### 3. Moovalur Ramamirtham Scheme\n- ₹1,000/month for girl students\n- Higher education support\n- Empowerment through education\n\n#### 4. TNSRLM (TN State Rural Livelihood Mission)\n- SHG bank linkage\n- Skill training\n- Market access\n\n### 📝 How to Apply\n1. Visit **tnrd.gov.in**\n2. Contact District Rural Development Agency\n3. Join nearest Self Help Group\n4. Apply through SHG or directly\n\n### 📞 Helpline: 1800-425-1002\n\n*Would you like information about schemes in other states too?*`;
  }

  if (lower.includes("loan") || lower.includes("finance") || lower.includes("bank")) {
    return `## Government Loans for Women Entrepreneurs\n\n### 🏦 Top Loan Schemes\n\n| Scheme | Amount | Interest | Collateral |\n|--------|--------|----------|------------|\n| **PMMY Shishu** | Up to ₹50,000 | 10-12% | No |\n| **PMMY Kishore** | ₹50K - ₹5L | 10-14% | No |\n| **PMMY Tarun** | ₹5L - ₹10L | 12-16% | Yes |\n| **Stand-Up India** | ₹10L - ₹1Cr | 10-12% | Yes |\n| **Annapurna** | ₹50,000 | 12% | No |\n| **Stree Shakti** | Varies | Base-0.5% | No (≤₹5L) |\n| **PMEGP** | Up to ₹25L | + 25-35% subsidy | Partial |\n\n### 📋 General Documents Needed\n1. Aadhaar Card\n2. PAN Card\n3. Business Plan\n4. Address Proof\n5. Bank Statements\n6. Photos\n\n### 🔑 Tips\n- Start with PMMY Shishu for small amounts\n- Good credit history helps\n- Have a clear business plan ready\n- Women get 0.5% interest discount at SBI\n\n*Which loan amount are you looking for? I'll recommend the best option.*`;
  }

  if (lower.includes("scheme") || lower.includes("government") || lower.includes("yojana")) {
    return `## Key Government Schemes for Women\n\n| # | Scheme | Type | Key Benefit |\n|---|--------|------|------------|\n| 1 | **PMMY** | Loan | Up to ₹10L, no collateral |\n| 2 | **Stand-Up India** | Loan | ₹10L-1Cr for new businesses |\n| 3 | **PMEGP** | Subsidy | 25-35% subsidy on project |\n| 4 | **Startup India** | Support | Tax holiday + funding |\n| 5 | **Mahila E-Haat** | Market | Free online selling platform |\n| 6 | **DDU-GKY** | Training | Free training + placement |\n| 7 | **PMKVY** | Training | Free certification + ₹8,000 |\n| 8 | **Annapurna** | Loan | ₹50,000 for food business |\n| 9 | **Stree Shakti** | Loan | 0.5% interest concession |\n| 10 | **Sukanya Samriddhi** | Savings | 8.2% tax-free for girls |\n\n### How to Choose\n- 💰 **Need money?** → PMMY, Stand-Up India\n- 📚 **Want training?** → DDU-GKY, PMKVY\n- 🛍️ **Want to sell?** → Mahila E-Haat\n- 🏢 **Starting startup?** → Startup India\n- 🍽️ **Food business?** → Annapurna Scheme\n\n*Tell me your specific need — I'll recommend the perfect scheme!*`;
  }

  if (lower.includes("job") || lower.includes("employment") || lower.includes("work") || lower.includes("career")) {
    return `## Job & Career Opportunities for Women\n\n### 💼 In-Demand Jobs\n\n| Job | Salary Range | Training Needed |\n|-----|-------------|----------------|\n| Data Entry Operator | ₹8K-15K/month | Basic computer |\n| Beauty Therapist | ₹10K-25K/month | 3-6 months |\n| Tailor/Fashion | ₹8K-20K/month | 3-6 months |\n| Digital Marketing | ₹12K-30K/month | 2-3 months |\n| Customer Support | ₹10K-18K/month | Communication |\n| Teaching | ₹12K-25K/month | B.Ed/TTC |\n| Healthcare Aide | ₹10K-20K/month | 3 months |\n| Content Writing | ₹10K-25K/month | Writing skills |\n\n### 🏠 Work From Home Options\n- Freelance writing/design\n- Online tutoring\n- Data entry\n- Social media management\n- Virtual assistant\n\n### 📝 Job Portals for Women\n- **JobsForHer.com** — women-focused\n- **HerSecondInnings.com** — career restart\n- **Sheroes.in** — women community\n- **NAPS** — naps.gov.in (apprenticeship)\n\n### 💡 Free Training\nTake **PMKVY** courses → get certified → get placed!\n\n*What type of work are you looking for? I'll find the best match!*`;
  }

  if (lower.includes("course") || lower.includes("training") || lower.includes("learn") || lower.includes("skill")) {
    return `## Skill Courses Recommended for You\n\n### 🎓 Top Courses\n\n| Course | Duration | Cost | Platform |\n|--------|----------|------|----------|\n| **Tailoring & Fashion** | 3-6 months | Free (PMKVY) | NSDC |\n| **Beautician** | 3 months | Free (PMKVY) | Local center |\n| **Digital Marketing** | 2 months | Free | Google Garage |\n| **Web Development** | 6 months | Free | freeCodeCamp |\n| **Data Entry** | 1 month | Free (PMKVY) | NSDC |\n| **Teacher Training** | 1 year | Varies | NIOS |\n| **Food Processing** | 3 months | Free (PMKVY) | FCI |\n| **Handicrafts** | 2-4 months | Free | DC Handicrafts |\n| **Mobile App Dev** | 6 months | Free | Google |\n| **Exam Coaching** | 3-12 months | Varies | Online |\n\n### 💡 My Recommendations\n1. Start with **PMKVY free courses** — get ₹8,000 reward\n2. Take **Google Digital Marketing** — free certificate\n3. Join **DDU-GKY** for residential training + job\n\n### 📝 How to Enroll\n- PMKVY: pmkvyofficial.org\n- NSDC: nsdcindia.org\n- Google: learndigital.withgoogle.com\n\n*Which course interests you? I'll guide you step by step!*`;
  }

  if (lower.includes("tailoring") || lower.includes("sewing") || lower.includes("fashion design")) {
    return `## Starting a Tailoring Business\n\n### 🧵 Investment Plans\n\n| Level | Investment | Expected Income |\n|-------|-----------|----------------|\n| **Basic** | ₹5,000-10,000 | ₹8,000-15,000/mo |\n| **Medium** | ₹20,000-50,000 | ₹15,000-30,000/mo |\n| **Advanced** | ₹1,00,000+ | ₹30,000-60,000/mo |\n\n### 📋 Step-by-Step Plan\n1. **Get trained** — Take PMKVY tailoring course (free)\n2. **Buy machine** — Start with basic (₹5,000-8,000)\n3. **Set up space** — Home-based initially\n4. **Get customers** — Start with alterations\n5. **Expand** — Move to custom stitching\n6. **Scale** — Apply for MUDRA loan to buy more machines\n\n### 💰 Funding Options\n- PMMY Shishu: ₹50,000 (no collateral)\n- Annapurna: ₹50,000\n- PMEGP: Up to ₹10 lakh (35% subsidy if rural)\n\n### 📱 Sell Online\n- Instagram/Facebook for showcasing designs\n- Mahila E-Haat for government platform\n- Meesho for reselling\n\n*Would you like a detailed business plan for getting a MUDRA loan?*`;
  }

  if (lower.includes("food") || lower.includes("tiffin") || lower.includes("catering") || lower.includes("restaurant")) {
    return `## Starting a Food Business\n\n### 🍱 Options\n1. **Tiffin Service**: ₹5,000-8,000 investment\n2. **Pickle/Papad**: ₹3,000-5,000\n3. **Catering**: ₹15,000-25,000\n4. **Sweet shop**: ₹10,000-20,000\n5. **Cloud Kitchen**: ₹30,000-50,000\n\n### Recommended Scheme: Annapurna\n- Loan up to ₹50,000\n- For women in food/catering\n- 36 monthly installments\n\n### Requirements\n- FSSAI License (₹100 for basic)\n- Hygienic kitchen space\n- Basic utensils\n\n### 📈 Growth Path\n1. Start small from home\n2. Build regular customers\n3. Get FSSAI certified\n4. List on Swiggy/Zomato\n5. Scale with MUDRA loan\n\n*Would you like help with the FSSAI registration process?*`;
  }

  if (lower.includes("beauty") || lower.includes("parlour") || lower.includes("salon")) {
    return `## Starting a Beauty Business\n\n### 💄 Investment Options\n\n| Type | Investment | Income Potential |\n|------|-----------|------------------|\n| **Home-based** | ₹5,000-15,000 | ₹10,000-20,000/mo |\n| **Small parlour** | ₹50,000-1,00,000 | ₹20,000-40,000/mo |\n| **Full salon** | ₹2,00,000+ | ₹50,000-1,00,000/mo |\n\n### 📋 Steps\n1. Take PMKVY beautician course (free, 3 months)\n2. Practice on friends/family\n3. Start home-based services\n4. Get clients via WhatsApp/Instagram\n5. Save and upgrade to a parlour\n\n### 💰 Funding\n- PMMY Shishu: Up to ₹50,000\n- PMMY Kishore: Up to ₹5 lakh (for parlour setup)\n- PMEGP: 25-35% subsidy\n\n### 🎓 Free Training\n- PMKVY Beauty & Wellness\n- VLCC academy scholarships\n- State government programs\n\n*Shall I find the nearest PMKVY beauty training center for you?*`;
  }

  if (lower.includes("sukanya") || lower.includes("savings") || lower.includes("girl child")) {
    return `## Sukanya Samriddhi Yojana (SSY)\n\n### What is it?\nA savings scheme by the Government of India for the girl child, offering one of the highest interest rates.\n\n### Key Details\n- **Interest Rate**: ~8.2% (tax-free)\n- **Min Deposit**: ₹250/year\n- **Max Deposit**: ₹1,50,000/year\n- **Lock-in**: Until girl turns 21\n- **Partial Withdrawal**: At 18 years (50%) for education\n\n### Tax Benefits\n- Deposit: Deductible under Section 80C\n- Interest: Tax-free\n- Maturity: Tax-free\n\n### How to Open\n1. Visit Post Office or authorized bank\n2. Bring girl's birth certificate\n3. Parent's Aadhaar + PAN\n4. Initial deposit of ₹250\n\n*This is one of the best long-term investments for your daughter's future!*`;
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste") || lower.includes("hey")) {
    return `## Namaste! 🙏 Welcome to Aadhya AI Assistant\n\nI'm here to help you with:\n\n- 💼 **Business Ideas** — I'll suggest based on your budget\n- 🏦 **Government Loans** — PMMY, Stand-Up India, PMEGP, and more\n- 📚 **Free Training** — PMKVY, DDU-GKY, Skill India courses\n- 🛍️ **Selling Products** — Mahila E-Haat, Amazon Saheli\n- 💰 **Financial Planning** — Savings, investments, insurance\n- 📋 **Application Help** — Step-by-step guidance for any scheme\n- 💼 **Job Search** — Find the right career path\n\n### Try these questions:\n- "I have ₹5,000, what business can I start?"\n- "How to apply for Mudra Loan?"\n- "What free training is available?"\n- "How to sell products online?"\n\n*Just type your question — I'm here to guide your journey to financial independence!*`;
  }

  return `## I Can Help You With\n\n🔍 Here are topics I can guide you on:\n\n### 💼 Business\n- Business ideas by budget (₹1,000 to ₹10 lakh)\n- Step-by-step business plans\n- How to sell products online\n\n### 🏦 Loans & Schemes\n- **PMMY/Mudra** — Up to ₹10 lakh\n- **Stand-Up India** — ₹10L to ₹1Cr\n- **PMEGP** — 25-35% subsidy\n- **Startup India** — Tax benefits\n- **Annapurna** — ₹50,000 for food business\n- **Mahila E-Haat** — Free selling platform\n\n### 📚 Training & Jobs\n- **PMKVY** — Free training + ₹8,000\n- **DDU-GKY** — Free training + job placement\n- **Skill India** — 300+ courses\n- Job opportunities for women\n\n### 💡 Try asking:\n- "I have ₹5,000, what business can I start?"\n- "How to apply for PMEGP?"\n- "What training is available for beautician?"\n- "How to sell products online?"\n- "What jobs can I do from home?"\n\n*I'm your personal guide to financial independence! Ask me anything!*`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! 🙏 I'm your **Aadhya AI Assistant**. I can help you with:\n\n- 💼 **Business ideas** based on your budget\n- 🏦 **Government schemes** — PMMY, Stand-Up India, PMEGP, Startup India\n- 📚 **Free training** — PMKVY, DDU-GKY, Skill India\n- 💰 **Loan guidance** — which loan is right for you\n- 🛍️ **Selling products** — Mahila E-Haat, online platforms\n- 💼 **Job search** — career paths & opportunities\n\nUse the **quick buttons** below or type your question!" },
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
    }, 600 + Math.random() * 600);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl mb-1">AI Financial Assistant</h1>
        <p className="text-muted-foreground">Ask about business ideas, loans, schemes, jobs, and financial guidance.</p>
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
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask about business, loans, schemes, jobs..."
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
