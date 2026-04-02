import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Landmark, ExternalLink, Search, FileText, CheckCircle, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const schemes = [
  { id: 1, name: "Pradhan Mantri Mudra Yojana (PMMY)", tag: "Loan", state: [], desc: "Micro loans up to ₹10 lakh for non-corporate, non-farm micro/small enterprises.", eligibility: "Any Indian citizen with a business plan for non-farm income generating activity", docs: "Aadhaar, PAN, Business plan, Address proof, Category certificate (if applicable)", benefits: ["Collateral-free loans", "3 categories: Shishu (≤₹50K), Kishore (₹50K-5L), Tarun (₹5L-10L)", "No processing fee", "Women get priority"], steps: ["Visit nearest bank branch", "Fill MUDRA application form", "Submit business plan and documents", "Loan sanctioned within 7-10 days"], link: "https://www.mudra.org.in" },
  { id: 2, name: "Stand-Up India", tag: "Loan", state: [], desc: "Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.", eligibility: "SC/ST and/or women entrepreneurs, 18+ years, setting up greenfield enterprise", docs: "Aadhaar, PAN, Caste certificate (for SC/ST), Project report, ITR (if available)", benefits: ["₹10L to ₹1Cr composite loan", "Covers term loan + working capital", "Repayment up to 7 years", "18 months moratorium"], steps: ["Register on standupmitra.in", "Connect with nearest bank", "Submit project report", "Handholding support available"], link: "https://www.standupmitra.in" },
  { id: 3, name: "PMKVY – Pradhan Mantri Kaushal Vikas Yojana", tag: "Training", state: [], desc: "Free skill training and certification in 300+ trades across India.", eligibility: "Indian youth (any gender), school/college dropouts preferred, no age bar for special projects", docs: "Aadhaar, Bank account, Photo, 10th marksheet (if available)", benefits: ["Completely free training", "₹8,000 reward on certification", "Placement assistance", "Accident insurance of ₹2 lakh"], steps: ["Visit nearest PMKVY training center", "Enroll with Aadhaar", "Complete training (300-600 hours)", "Pass assessment and get certified"], link: "https://www.pmkvyofficial.org" },
  { id: 4, name: "Mahila E-Haat", tag: "Market", state: [], desc: "Online marketing platform for women entrepreneurs and SHGs.", eligibility: "Women entrepreneurs, Self Help Groups, NGOs supporting women", docs: "Organization/SHG registration, Product details with images, Bank account", benefits: ["Direct access to customers", "No middlemen", "Government backing", "Free marketing support"], steps: ["Register on Mahila E-Haat portal", "Upload product catalog", "Set pricing", "Receive orders directly"], link: "https://mahilaehaat-rmk.gov.in" },
  { id: 5, name: "Stree Shakti Package", tag: "Loan", state: [], desc: "Concessional interest rate on loans for women with 50%+ business ownership.", eligibility: "Women owning 50%+ share in a business, participation in EDP training preferred", docs: "Business registration, Ownership proof, EDP certificate, Financial statements", benefits: ["0.5% interest rate concession", "No collateral up to ₹5 lakh", "Available at SBI branches", "Quick processing"], steps: ["Approach SBI or associated banks", "Submit business documents", "Show EDP training certificate for extra benefits"], link: "https://www.sbi.co.in" },
  { id: 6, name: "Annapurna Scheme", tag: "Loan", state: [], desc: "Loans up to ₹50,000 for women starting food catering businesses.", eligibility: "Women above 18 who want to set up food/catering business", docs: "Aadhaar, Ration card, Two guarantors, Passport photos", benefits: ["₹50,000 loan at market rate", "Repayable in 36 monthly installments", "Initial moratorium period", "Specifically for food business"], steps: ["Contact State Bank of Mysore or partner banks", "Submit catering business plan", "Provide guarantors", "Receive loan approval"], link: "https://www.sbm.co.in" },
  { id: 7, name: "Sukanya Samriddhi Yojana", tag: "Savings", state: [], desc: "High-interest savings scheme for girl children with tax benefits.", eligibility: "Parents/guardians of girl child below 10 years", docs: "Birth certificate of girl child, Parent's Aadhaar & PAN, Address proof", benefits: ["~8.2% interest rate (tax-free)", "Tax deduction under 80C", "Partial withdrawal at 18 for education", "Matures at 21 years"], steps: ["Open account at any post office or bank", "Minimum deposit ₹250/year", "Maximum ₹1.5 lakh/year", "Matures when girl turns 21"], link: "https://www.nsiindia.gov.in" },
  { id: 8, name: "Working Women Hostel Scheme", tag: "Support", state: [], desc: "Safe and affordable accommodation for working women in cities.", eligibility: "Working women with gross income up to ₹50,000/month, single women, widows, divorcees", docs: "Employment proof, Income certificate, Aadhaar, Photos", benefits: ["Subsidized accommodation", "Childcare facility up to 18 years", "Safe environment", "Available in major cities"], steps: ["Check availability through District WCD office", "Apply through state portal", "Submit income and employment documents"], link: "https://wcd.nic.in" },
  // State-specific schemes
  { id: 9, name: "Tamil Nadu Magalir Thittam", tag: "Support", state: ["Tamil Nadu"], desc: "Comprehensive women development program in Tamil Nadu including SHG formation, skill training, and micro-credit.", eligibility: "Women in Tamil Nadu, SHG members preferred", docs: "Aadhaar, Ration card, SHG membership, Bank account", benefits: ["SHG formation support", "Micro-credit access", "Skill training programs", "Marketing support"], steps: ["Contact District Collector office", "Join nearest Self Help Group", "Apply through SHG leader", "Attend training programs"], link: "https://www.tamilnaduwomendev.org" },
  { id: 10, name: "Tamil Nadu TNSRLM", tag: "Loan", state: ["Tamil Nadu"], desc: "TN State Rural Livelihood Mission — bank linkage and enterprise support for rural women.", eligibility: "Rural women in Tamil Nadu, BPL households preferred", docs: "Aadhaar, BPL certificate, SHG details, Bank account", benefits: ["SHG bank linkage", "Enterprise development support", "Revolving fund", "Capacity building"], steps: ["Visit nearest Gram Panchayat", "Join SHG under TNSRLM", "Apply for bank linkage", "Access enterprise support"], link: "https://tnrd.gov.in" },
  { id: 11, name: "Maharashtra CMEGP", tag: "Loan", state: ["Maharashtra"], desc: "Chief Minister's Employment Generation Programme for Maharashtra — special benefits for women.", eligibility: "Women entrepreneurs in Maharashtra, 18-45 years", docs: "Aadhaar, PAN, Domicile certificate, Project report", benefits: ["25-35% subsidy on project cost", "Projects up to ₹50 lakh (manufacturing)", "Preference for women applicants", "Training support"], steps: ["Visit di.maharashtra.gov.in", "Register online", "Submit project report", "Attend selection committee"], link: "https://di.maharashtra.gov.in" },
  { id: 12, name: "Karnataka Udyogini Scheme", tag: "Loan", state: ["Karnataka"], desc: "Soft loans for women entrepreneurs from Karnataka Women's Development Corporation.", eligibility: "Women in Karnataka with annual family income below ₹1.5 lakh (General) / ₹2 lakh (SC/ST)", docs: "Aadhaar, Income proof, Caste certificate, Business plan", benefits: ["Loans up to ₹3 lakh", "Low interest rates", "No collateral required", "Subsidy available"], steps: ["Visit KSWDC office or taluk office", "Submit application with documents", "Attend interview", "Loan disbursed after approval"], link: "https://kswdc.karnataka.gov.in" },
  { id: 13, name: "Kerala Kudumbashree", tag: "Support", state: ["Kerala"], desc: "Kerala's flagship poverty eradication and women empowerment mission through NHGs.", eligibility: "Women in Kerala, BPL families preferred", docs: "Aadhaar, Ration card, Neighbourhood group details", benefits: ["Microfinance access", "Enterprise support", "Skill training", "Marketing platform"], steps: ["Join nearest Neighbourhood Group (NHG)", "Form Area Development Society", "Access micro-enterprise loans", "Get skill training"], link: "https://www.kudumbashree.org" },
  { id: 14, name: "Rajasthan Priyadarshini Scheme", tag: "Support", state: ["Rajasthan"], desc: "Women SHG empowerment through SGSY — capacity building and enterprise promotion.", eligibility: "Rural women in Rajasthan, SHG members", docs: "Aadhaar, SHG registration, Bank account", benefits: ["Revolving fund for SHGs", "Capacity building training", "Market linkage support", "Enterprise promotion"], steps: ["Register SHG at block office", "Complete capacity building training", "Apply for revolving fund", "Start enterprise"], link: "https://sje.rajasthan.gov.in" },
  { id: 15, name: "West Bengal Kanyashree Prakalpa", tag: "Support", state: ["West Bengal"], desc: "Conditional cash transfer for girls aged 13-18 to prevent child marriage and promote education.", eligibility: "Girls aged 13-18 in West Bengal from families with annual income ≤ ₹1.2 lakh", docs: "Age proof, Student ID, Income certificate, Bank account", benefits: ["₹750 annual scholarship", "₹25,000 one-time grant at 18", "Promotes girl education", "Prevents child marriage"], steps: ["Apply through school/institution", "Submit required documents", "Receive scholarship directly in bank", "Get one-time grant at 18"], link: "https://wbkanyashree.gov.in" },
];

export default function SchemesPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("All");
  const [tagFilter, setTagFilter] = useState("All");
  const [selected, setSelected] = useState<typeof schemes[0] | null>(null);

  const filtered = schemes.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.tag.toLowerCase().includes(search.toLowerCase());
    const matchState = stateFilter === "All" || s.state.length === 0 || s.state.includes(stateFilter);
    const matchTag = tagFilter === "All" || s.tag === tagFilter;
    return matchSearch && matchState && matchTag;
  }).sort((a, b) => {
    if (!profile?.state) return 0;
    const aLocal = a.state.includes(profile.state) ? 0 : a.state.length === 0 ? 1 : 2;
    const bLocal = b.state.includes(profile.state) ? 0 : b.state.length === 0 ? 1 : 2;
    return aLocal - bLocal;
  });

  const handleApply = (scheme: typeof schemes[0]) => {
    toast.success("Redirecting to official government portal...");
    window.open(scheme.link, "_blank");
  };

  const isInUserState = (scheme: typeof schemes[0]) => {
    return profile?.state && scheme.state.includes(profile.state);
  };

  const tags = ["All", "Loan", "Training", "Market", "Support", "Savings"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Government Schemes</h1>
        <p className="text-muted-foreground">Browse verified government schemes for loans, training, and support.
          {profile?.state && <span className="text-primary ml-1">Highlighting schemes in {profile.state}.</span>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="scheme-search" placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-full sm:w-36" id="scheme-tag-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            {tags.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full sm:w-48" id="scheme-state-filter"><SelectValue placeholder="Filter by state" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All States (National)</SelectItem>
            {profile?.state && <SelectItem value={profile.state}>{profile.state} (Your State)</SelectItem>}
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Kerala">Kerala</SelectItem>
            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
            <SelectItem value="West Bengal">West Bengal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isInUserState(s) ? "border-primary/30 bg-primary/[0.02]" : ""}`} onClick={() => setSelected(s)}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{s.tag}</span>
                  {isInUserState(s) && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />Your State</span>}
                  {s.state.length > 0 && !isInUserState(s) && <span className="text-[10px] text-muted-foreground">{s.state.join(", ")}</span>}
                </div>
                <h3 className="font-sans font-semibold text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-lg">{selected.name}</DialogTitle>
              <DialogDescription>{selected.tag} Scheme {selected.state.length > 0 && `· ${selected.state.join(", ")}`}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{selected.desc}</p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground mb-1">Eligibility</p><p className="text-sm">{selected.eligibility}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground mb-1"><FileText className="h-3 w-3 inline mr-1" />Required Documents</p><p className="text-sm">{selected.docs}</p></div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-2"><CheckCircle className="h-3 w-3 inline mr-1" />Benefits</p>
                  <ul className="space-y-1">
                    {selected.benefits.map((b, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-2">Step-by-Step Process</p>
                  <ol className="space-y-1">
                    {selected.steps.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary font-semibold min-w-[20px]">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="flex gap-3">
                <Button id="scheme-apply-btn" className="flex-1" onClick={() => handleApply(selected)}>Apply Now <ExternalLink className="ml-2 h-3.5 w-3.5" /></Button>
                <Button variant="outline" className="flex-1" onClick={() => window.open(selected.link, "_blank")}>View Official Page</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
