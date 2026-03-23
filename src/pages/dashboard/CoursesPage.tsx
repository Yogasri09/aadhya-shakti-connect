import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GraduationCap, Clock, MapPin, ExternalLink, Search } from "lucide-react";
import { toast } from "sonner";

const allCourses = [
  { id: 1, title: "Tailoring & Fashion Design", category: "Skill", duration: "6 months", location: "Delhi, Mumbai", eligibility: "Women aged 18-45", benefits: "Free training, tools kit, certificate", desc: "Comprehensive tailoring course covering basic stitching, pattern making, fashion design, and business setup.", link: "https://www.skillindia.gov.in" },
  { id: 2, title: "Beautician & Cosmetology", category: "Skill", duration: "3 months", location: "All States", eligibility: "Women aged 18-40, 10th pass", benefits: "Free training, starter kit, placement support", desc: "Professional beauty and cosmetology training including skincare, haircare, makeup artistry, and salon management.", link: "https://www.skillindia.gov.in" },
  { id: 3, title: "Teacher Training (D.El.Ed)", category: "Education", duration: "2 years", location: "State DIETs", eligibility: "12th pass with 50%+", benefits: "Government certificate, teaching license", desc: "Diploma in Elementary Education preparing women for teaching positions in primary schools.", link: "https://ncte.gov.in" },
  { id: 4, title: "Business & Entrepreneurship", category: "Business", duration: "3 months", location: "Online + Offline", eligibility: "Any woman entrepreneur", benefits: "Business plan template, mentor access, seed funding info", desc: "Learn to create business plans, understand market analysis, manage finances, and scale your micro-enterprise.", link: "https://www.niesbud.nic.in" },
  { id: 5, title: "Competitive Exam Coaching", category: "Education", duration: "1 year", location: "Online", eligibility: "Graduate women", benefits: "Free study material, mock tests, mentorship", desc: "Prepare for SSC, Banking, Railway exams with structured coaching and AI-powered practice tests.", link: "https://ncs.gov.in" },
  { id: 6, title: "Digital Marketing", category: "Digital", duration: "2 months", location: "Online", eligibility: "Basic computer knowledge", benefits: "Google certification, freelance opportunities", desc: "Learn SEO, social media marketing, content creation, and e-commerce selling strategies.", link: "https://www.skillindia.gov.in" },
  { id: 7, title: "Food Processing & Preservation", category: "Skill", duration: "3 months", location: "KVICs, All States", eligibility: "Women SHG members preferred", benefits: "Training, FSSAI guidance, raw materials", desc: "Learn food processing techniques — pickles, jams, masalas, snacks — with FSSAI compliance and packaging.", link: "https://www.kvic.gov.in" },
  { id: 8, title: "Handicraft & Artisan Training", category: "Skill", duration: "4 months", location: "Regional centers", eligibility: "Traditional artisan women", benefits: "Tools, marketplace access, GI tag support", desc: "Enhance traditional crafts with modern techniques. Covers pottery, embroidery, weaving, and block printing.", link: "https://www.handicrafts.nic.in" },
  { id: 9, title: "Nursing & Healthcare Assistant", category: "Healthcare", duration: "1 year", location: "Government hospitals", eligibility: "12th pass (Science)", benefits: "Stipend, placement, certificate", desc: "Become a certified healthcare assistant with hands-on training in government hospitals.", link: "https://www.mohfw.gov.in" },
  { id: 10, title: "Solar Panel Installation", category: "Technical", duration: "45 days", location: "NISE Centers", eligibility: "10th pass", benefits: "Free training, tools, self-employment support", desc: "Learn solar panel installation, maintenance, and repair — growing demand in rural areas.", link: "https://nise.res.in" },
];

const categories = ["All", "Skill", "Education", "Business", "Digital", "Healthcare", "Technical"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<typeof allCourses[0] | null>(null);

  const filtered = allCourses.filter(c =>
    (category === "All" || c.category === category) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = (course: typeof allCourses[0]) => {
    toast.success("Redirecting to official website...");
    window.open(course.link, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Training & Courses</h1>
        <p className="text-muted-foreground">Explore government-backed skill training programs.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full" onClick={() => setSelected(c)}>
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-9 w-9 rounded-lg hero-gradient flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{c.category}</span>
                </div>
                <h3 className="font-sans font-semibold text-sm mb-2">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{c.desc}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.location.split(",")[0]}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif">{selected.title}</DialogTitle>
              <DialogDescription>{selected.category} Program</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed">{selected.desc}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Duration</p><p className="font-medium">{selected.duration}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{selected.location}</p></div>
                <div className="p-3 rounded-lg bg-muted col-span-2"><p className="text-xs text-muted-foreground">Eligibility</p><p className="font-medium">{selected.eligibility}</p></div>
                <div className="p-3 rounded-lg bg-muted col-span-2"><p className="text-xs text-muted-foreground">Benefits</p><p className="font-medium">{selected.benefits}</p></div>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => handleApply(selected)}>Apply Now <ExternalLink className="ml-2 h-3.5 w-3.5" /></Button>
                <Button variant="outline" className="flex-1" onClick={() => window.open(selected.link, "_blank")}>Visit Official Website</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
