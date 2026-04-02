import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GraduationCap, Clock, MapPin, ExternalLink, Search, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const allCourses = [
  { id: 1, title: "Tailoring & Fashion Design", category: "Skill", duration: "6 months", location: "Delhi, Mumbai, Tamil Nadu", state: ["Delhi", "Maharashtra", "Tamil Nadu"], eligibility: "Women aged 18-45", benefits: "Free training, tools kit, certificate", desc: "Comprehensive tailoring course covering basic stitching, pattern making, fashion design, and business setup.", link: "https://www.skillindia.gov.in", certificate: true },
  { id: 2, title: "Beautician & Cosmetology", category: "Skill", duration: "3 months", location: "All States", state: [], eligibility: "Women aged 18-40, 10th pass", benefits: "Free training, starter kit, placement support", desc: "Professional beauty and cosmetology training including skincare, haircare, makeup artistry, and salon management.", link: "https://www.skillindia.gov.in", certificate: true },
  { id: 3, title: "Teacher Training (D.El.Ed)", category: "Education", duration: "2 years", location: "State DIETs", state: [], eligibility: "12th pass with 50%+", benefits: "Government certificate, teaching license", desc: "Diploma in Elementary Education preparing women for teaching positions in primary schools.", link: "https://ncte.gov.in", certificate: true },
  { id: 4, title: "Business & Entrepreneurship", category: "Business", duration: "3 months", location: "Online + Offline", state: [], eligibility: "Any woman entrepreneur", benefits: "Business plan template, mentor access, seed funding info", desc: "Learn to create business plans, understand market analysis, manage finances, and scale your micro-enterprise.", link: "https://www.niesbud.nic.in", certificate: true },
  { id: 5, title: "Competitive Exam Coaching", category: "Education", duration: "1 year", location: "Online", state: [], eligibility: "Graduate women", benefits: "Free study material, mock tests, mentorship", desc: "Prepare for SSC, Banking, Railway exams with structured coaching and AI-powered practice tests.", link: "https://ncs.gov.in", certificate: false },
  { id: 6, title: "Digital Marketing", category: "Digital", duration: "2 months", location: "Online", state: [], eligibility: "Basic computer knowledge", benefits: "Google certification, freelance opportunities", desc: "Learn SEO, social media marketing, content creation, and e-commerce selling strategies.", link: "https://learndigital.withgoogle.com", certificate: true },
  { id: 7, title: "Food Processing & Preservation", category: "Skill", duration: "3 months", location: "KVICs, Tamil Nadu, Kerala, Karnataka", state: ["Tamil Nadu", "Kerala", "Karnataka"], eligibility: "Women SHG members preferred", benefits: "Training, FSSAI guidance, raw materials", desc: "Learn food processing techniques — pickles, jams, masalas, snacks — with FSSAI compliance and packaging.", link: "https://www.kvic.gov.in", certificate: true },
  { id: 8, title: "Handicraft & Artisan Training", category: "Skill", duration: "4 months", location: "Regional centers, Rajasthan, UP, West Bengal", state: ["Rajasthan", "Uttar Pradesh", "West Bengal"], eligibility: "Traditional artisan women", benefits: "Tools, marketplace access, GI tag support", desc: "Enhance traditional crafts with modern techniques. Covers pottery, embroidery, weaving, and block printing.", link: "https://www.handicrafts.nic.in", certificate: true },
  { id: 9, title: "Nursing & Healthcare Assistant", category: "Healthcare", duration: "1 year", location: "Government hospitals", state: [], eligibility: "12th pass (Science)", benefits: "Stipend, placement, certificate", desc: "Become a certified healthcare assistant with hands-on training in government hospitals.", link: "https://www.mohfw.gov.in", certificate: true },
  { id: 10, title: "Solar Panel Installation", category: "Technical", duration: "45 days", location: "NISE Centers, Gujarat, Rajasthan", state: ["Gujarat", "Rajasthan"], eligibility: "10th pass", benefits: "Free training, tools, self-employment support", desc: "Learn solar panel installation, maintenance, and repair — growing demand in rural areas.", link: "https://nise.res.in", certificate: true },
];

const categories = ["All", "Skill", "Education", "Business", "Digital", "Healthcare", "Technical"];

export default function CoursesPage() {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [selected, setSelected] = useState<typeof allCourses[0] | null>(null);

  const filtered = allCourses
    .filter(c =>
      (category === "All" || c.category === category) &&
      c.title.toLowerCase().includes(search.toLowerCase()) &&
      (locationFilter === "All" || c.state.length === 0 || c.state.includes(locationFilter))
    )
    .sort((a, b) => {
      // Sort by location relevance
      const userState = profile?.state;
      if (!userState) return 0;
      const aMatch = a.state.length === 0 || a.state.includes(userState) ? 0 : 1;
      const bMatch = b.state.length === 0 || b.state.includes(userState) ? 0 : 1;
      return aMatch - bMatch;
    });

  const handleApply = (course: typeof allCourses[0]) => {
    toast.success("Redirecting to official website...");
    window.open(course.link, "_blank");
  };

  const isNearby = (course: typeof allCourses[0]) => {
    return profile?.state && (course.state.length === 0 || course.state.includes(profile.state));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Training & Courses</h1>
        <p className="text-muted-foreground">Explore government-backed skill training programs.
          {profile?.state && <span className="text-primary ml-1">Showing results near {profile.state}.</span>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="course-search" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44" id="course-category-filter"><SelectValue /></SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-44" id="course-location-filter"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Locations</SelectItem>
            {profile?.state && <SelectItem value={profile.state}>{profile.state} (Your State)</SelectItem>}
            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Karnataka">Karnataka</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
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
                  {isNearby(c) && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />Nearby</span>}
                  {c.certificate && <BadgeCheck className="h-4 w-4 text-success ml-auto" />}
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
              <DialogDescription>{selected.category} Program {selected.certificate && "· Certificate Available ✅"}</DialogDescription>
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
