import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Landmark, ExternalLink, Search, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const schemes = [
  { id: 1, name: "Pradhan Mantri Mudra Yojana (PMMY)", tag: "Loan", desc: "Micro loans up to ₹10 lakh for non-corporate, non-farm micro/small enterprises.", eligibility: "Any Indian citizen with a business plan for non-farm income generating activity", docs: "Aadhaar, PAN, Business plan, Address proof, Category certificate (if applicable)", benefits: "Collateral-free loans in 3 categories: Shishu (up to ₹50,000), Kishore (₹50,000-5L), Tarun (₹5L-10L)", steps: "1. Visit nearest bank branch\n2. Fill MUDRA application form\n3. Submit business plan and documents\n4. Loan sanctioned within 7-10 days", link: "https://www.mudra.org.in" },
  { id: 2, name: "Stand-Up India", tag: "Loan", desc: "Bank loans between ₹10 lakh and ₹1 crore for SC/ST and women entrepreneurs.", eligibility: "SC/ST and/or women entrepreneurs, 18+ years, setting up greenfield enterprise", docs: "Aadhaar, PAN, Caste certificate (for SC/ST), Project report, ITR (if available)", benefits: "Composite loan covering term loan + working capital. Repayment period up to 7 years with max moratorium of 18 months.", steps: "1. Register on standupmitra.in\n2. Connect with nearest bank\n3. Submit project report\n4. Handholding support available", link: "https://www.standupmitra.in" },
  { id: 3, name: "PMKVY – Pradhan Mantri Kaushal Vikas Yojana", tag: "Training", desc: "Free skill training and certification in 300+ trades across India.", eligibility: "Indian youth (any gender), school/college dropouts preferred, no age bar for special projects", docs: "Aadhaar, Bank account, Photo, 10th marksheet (if available)", benefits: "Free training, ₹8,000 reward on certification, placement assistance, accident insurance of ₹2 lakh", steps: "1. Visit nearest PMKVY training center\n2. Enroll with Aadhaar\n3. Complete training (300-600 hours)\n4. Pass assessment and get certified", link: "https://www.pmkvyofficial.org" },
  { id: 4, name: "Mahila E-Haat", tag: "Market", desc: "Online marketing platform for women entrepreneurs and SHGs.", eligibility: "Women entrepreneurs, Self Help Groups, NGOs supporting women", docs: "Organization/SHG registration, Product details with images, Bank account", benefits: "Direct access to customers, no middlemen, government backing, free marketing support", steps: "1. Register on Mahila E-Haat portal\n2. Upload product catalog\n3. Set pricing\n4. Receive orders directly", link: "https://mahilaehaat-rmk.gov.in" },
  { id: 5, name: "Stree Shakti Package", tag: "Loan", desc: "Concessional interest rate on loans for women with 50%+ business ownership.", eligibility: "Women owning 50%+ share in a business, participation in EDP training preferred", docs: "Business registration, Ownership proof, EDP certificate, Financial statements", benefits: "0.5% interest rate concession on loans above ₹2 lakh, no collateral up to ₹5 lakh", steps: "1. Approach SBI or associated banks\n2. Submit business documents\n3. Show EDP training certificate for extra benefits", link: "https://www.sbi.co.in" },
  { id: 6, name: "Annapurna Scheme", tag: "Loan", desc: "Loans up to ₹50,000 for women starting food catering businesses.", eligibility: "Women above 18 who want to set up food/catering business", docs: "Aadhaar, Ration card, Two guarantors, Passport photos", benefits: "₹50,000 loan at market rate, repayable in 36 monthly installments after initial moratorium", steps: "1. Contact State Bank of Mysore or partner banks\n2. Submit catering business plan\n3. Provide guarantors\n4. Receive loan approval", link: "https://www.sbm.co.in" },
  { id: 7, name: "Sukanya Samriddhi Yojana", tag: "Savings", desc: "High-interest savings scheme for girl children with tax benefits.", eligibility: "Parents/guardians of girl child below 10 years", docs: "Birth certificate of girl child, Parent's Aadhaar & PAN, Address proof", benefits: "Current interest rate ~8.2%, tax-free returns, can be used for education/marriage", steps: "1. Open account at any post office or bank\n2. Minimum deposit ₹250/year\n3. Maximum ₹1.5 lakh/year\n4. Matures when girl turns 21", link: "https://www.nsiindia.gov.in" },
  { id: 8, name: "Working Women Hostel Scheme", tag: "Support", desc: "Safe and affordable accommodation for working women in cities.", eligibility: "Working women with gross income up to ₹50,000/month, single women, widows, divorcees", docs: "Employment proof, Income certificate, Aadhaar, Photos", benefits: "Subsidized accommodation, childcare facility for children up to 18 years", steps: "1. Check availability through District WCD office\n2. Apply through state portal\n3. Submit income and employment documents", link: "https://wcd.nic.in" },
];

export default function SchemesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof schemes[0] | null>(null);

  const filtered = schemes.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.tag.toLowerCase().includes(search.toLowerCase()));

  const handleApply = (scheme: typeof schemes[0]) => {
    toast.success("Redirecting to official government portal...");
    window.open(scheme.link, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Government Schemes</h1>
        <p className="text-muted-foreground">Browse verified government schemes for loans, training, and support.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search schemes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(s)}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{s.tag}</span>
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
              <DialogDescription>{selected.tag} Scheme</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{selected.desc}</p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground mb-1">Eligibility</p><p className="text-sm">{selected.eligibility}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground mb-1"><FileText className="h-3 w-3 inline mr-1" />Required Documents</p><p className="text-sm">{selected.docs}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground mb-1"><CheckCircle className="h-3 w-3 inline mr-1" />Benefits</p><p className="text-sm">{selected.benefits}</p></div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">How to Apply</p>
                  <div className="text-sm space-y-1">
                    {selected.steps.split("\n").map((s, i) => <p key={i}>{s}</p>)}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => handleApply(selected)}>Apply for Scheme <ExternalLink className="ml-2 h-3.5 w-3.5" /></Button>
                <Button variant="outline" className="flex-1" onClick={() => window.open(selected.link, "_blank")}>View Official Page</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
