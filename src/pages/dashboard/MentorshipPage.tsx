import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Users } from "lucide-react";
import { toast } from "sonner";

const mentors = [
  { id: 1, name: "Dr. Anita Gupta", skill: "Business Strategy", certified: true, exp: "15 years", bio: "Former SIDBI consultant. Has mentored 200+ women entrepreneurs in Rajasthan and UP.", initials: "AG" },
  { id: 2, name: "Rekha Bhatia", skill: "Tailoring & Fashion", certified: true, exp: "12 years", bio: "Award-winning fashion designer turned trainer. Runs a tailoring school for rural women.", initials: "RB" },
  { id: 3, name: "Shanti Mishra", skill: "Food Processing", certified: true, exp: "10 years", bio: "FSSAI certified food safety expert. Helps women start food businesses with proper licensing.", initials: "SM" },
  { id: 4, name: "Pooja Nair", skill: "Digital Marketing", certified: true, exp: "8 years", bio: "Google-certified digital marketer. Specializes in helping small businesses go online.", initials: "PN" },
];

export default function MentorshipPage() {
  const [selected, setSelected] = useState<typeof mentors[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Mentorship & Jobs</h1>
        <p className="text-muted-foreground">Connect with verified mentors who can guide your journey.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {mentors.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(m)}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-12 w-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">{m.initials}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-semibold text-sm">{m.name}</h3>
                    {m.certified && <BadgeCheck className="h-4 w-4 text-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.skill} · {m.exp}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">{selected.name}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-lg">{selected.initials}</div>
                <div>
                  <div className="flex items-center gap-2"><p className="font-semibold">{selected.name}</p>{selected.certified && <BadgeCheck className="h-4 w-4 text-success" />}</div>
                  <p className="text-sm text-muted-foreground">{selected.skill} · {selected.exp}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{selected.bio}</p>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => toast.success("Mentorship request sent!")}><Users className="mr-2 h-4 w-4" />Apply for Mentorship</Button>
                <Button variant="outline" onClick={() => toast.info("Certificate verified!")}>Verify Certification</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
