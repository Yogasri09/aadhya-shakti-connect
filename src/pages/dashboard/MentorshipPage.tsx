import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BadgeCheck, Users, Search, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const mentors = [
  { id: 1, name: "Dr. Anita Gupta", skill: "Business Strategy", expertise: "Business Strategy", location: "Delhi", state: "Delhi", certified: true, exp: "15 years", bio: "Former SIDBI consultant. Has mentored 200+ women entrepreneurs in Rajasthan and UP. Specializes in micro-enterprise development and financial planning.", initials: "AG", rating: 4.9 },
  { id: 2, name: "Rekha Bhatia", skill: "Tailoring & Fashion", expertise: "Career Guidance", location: "Jaipur", state: "Rajasthan", certified: true, exp: "12 years", bio: "Award-winning fashion designer turned trainer. Runs a tailoring school for rural women. Expert in garment business setup and market access.", initials: "RB", rating: 4.7 },
  { id: 3, name: "Shanti Mishra", skill: "Food Processing", expertise: "Financial Planning", location: "Lucknow", state: "Uttar Pradesh", certified: true, exp: "10 years", bio: "FSSAI certified food safety expert. Helps women start food businesses with proper licensing, packaging, and marketing strategies.", initials: "SM", rating: 4.8 },
  { id: 4, name: "Pooja Nair", skill: "Digital Marketing", expertise: "Technical Skills", location: "Kochi", state: "Kerala", certified: true, exp: "8 years", bio: "Google-certified digital marketer. Specializes in helping small businesses go online, e-commerce setup, and social media marketing.", initials: "PN", rating: 4.6 },
  { id: 5, name: "Lakshmi Sundaram", skill: "Handicrafts & Export", expertise: "Business Strategy", location: "Chennai", state: "Tamil Nadu", certified: true, exp: "20 years", bio: "Expert in handicraft export business. Helped 100+ artisan women reach international markets through quality improvement and branding.", initials: "LS", rating: 4.9 },
  { id: 6, name: "Priya Deshmukh", skill: "Healthcare & Wellness", expertise: "Career Guidance", location: "Pune", state: "Maharashtra", certified: true, exp: "14 years", bio: "Healthcare administrator and wellness coach. Guides women into healthcare careers, nursing, and wellness industry opportunities.", initials: "PD", rating: 4.5 },
  { id: 7, name: "Kavitha Reddy", skill: "Agriculture & Organic Farming", expertise: "Technical Skills", location: "Hyderabad", state: "Telangana", certified: true, exp: "11 years", bio: "Organic farming expert and agriculture consultant. Helps rural women transition to profitable organic farming and value-added products.", initials: "KR", rating: 4.7 },
  { id: 8, name: "Fatima Sheikh", skill: "Education & Training", expertise: "Career Guidance", location: "Bangalore", state: "Karnataka", certified: true, exp: "9 years", bio: "Education technology specialist. Helps women access online learning platforms, certification programs, and career advancement opportunities.", initials: "FS", rating: 4.6 },
];

const expertiseOptions = ["All", "Business Strategy", "Career Guidance", "Technical Skills", "Financial Planning"];

export default function MentorshipPage() {
  const { profile, questionnaire } = useAuth();
  const [selected, setSelected] = useState<typeof mentors[0] | null>(null);
  const [search, setSearch] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const filtered = mentors.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.skill.toLowerCase().includes(search.toLowerCase());
    const matchExpertise = expertiseFilter === "All" || m.expertise === expertiseFilter;
    const matchLocation = locationFilter === "All" || m.state === locationFilter;
    return matchSearch && matchExpertise && matchLocation;
  }).sort((a, b) => {
    if (!profile?.state) return 0;
    const aMatch = a.state === profile.state ? 0 : 1;
    const bMatch = b.state === profile.state ? 0 : 1;
    if (aMatch !== bMatch) return aMatch - bMatch;
    // Also sort by questionnaire mentorship area match
    if (questionnaire?.mentorshipArea) {
      const aExMatch = a.expertise === questionnaire.mentorshipArea ? 0 : 1;
      const bExMatch = b.expertise === questionnaire.mentorshipArea ? 0 : 1;
      return aExMatch - bExMatch;
    }
    return 0;
  });

  const isNearby = (m: typeof mentors[0]) => profile?.state && m.state === profile.state;
  const isRecommended = (m: typeof mentors[0]) => questionnaire?.mentorshipArea && m.expertise === questionnaire.mentorshipArea;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Mentorship & Guidance</h1>
        <p className="text-muted-foreground">Connect with verified mentors who can guide your journey.
          {profile?.state && <span className="text-primary ml-1">Showing mentors near {profile.state}.</span>}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="mentor-search" placeholder="Search mentors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
          <SelectTrigger className="w-full sm:w-48" id="mentor-expertise-filter"><SelectValue placeholder="Expertise" /></SelectTrigger>
          <SelectContent>
            {expertiseOptions.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-44" id="mentor-location-filter"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Locations</SelectItem>
            {profile?.state && <SelectItem value={profile.state}>{profile.state} (Your State)</SelectItem>}
            {[...new Set(mentors.map(m => m.state))].filter(s => s !== profile?.state).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className={`cursor-pointer hover:shadow-md transition-shadow ${isRecommended(m) ? "border-primary/30 bg-primary/[0.02]" : ""}`} onClick={() => setSelected(m)}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-semibold text-sm truncate">{m.name}</h3>
                    {m.certified && <BadgeCheck className="h-4 w-4 text-success flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.skill} · {m.exp}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{m.location}</span>
                    <span className="flex items-center gap-0.5 text-xs text-warm"><Star className="h-3 w-3 fill-warm" />{m.rating}</span>
                    {isNearby(m) && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Nearby</span>}
                    {isRecommended(m) && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">Recommended</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">{selected.name}</DialogTitle>
              <DialogDescription>{selected.expertise} Expert · {selected.location}, {selected.state}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">{selected.initials}</div>
                <div>
                  <div className="flex items-center gap-2"><p className="font-semibold">{selected.name}</p>{selected.certified && <BadgeCheck className="h-4 w-4 text-success" />}</div>
                  <p className="text-sm text-muted-foreground">{selected.skill} · {selected.exp}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{selected.location}, {selected.state}</span>
                    <span className="flex items-center gap-0.5 text-xs text-warm"><Star className="h-3 w-3 fill-warm" />{selected.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{selected.bio}</p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => toast.success("Mentorship request sent to " + selected.name + "!")}><Users className="mr-2 h-4 w-4" />Request Mentorship</Button>
                <Button variant="outline" onClick={() => toast.info("Certificate verified for " + selected.name)}>Verify Certification</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
