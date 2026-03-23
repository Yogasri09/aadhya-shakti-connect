import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const events = [
  { id: 1, name: "Women Entrepreneur Expo 2026", date: "March 28-30, 2026", location: "Pragati Maidan, New Delhi", desc: "India's largest expo for women entrepreneurs. Showcase products, network with buyers, attend workshops.", registration: "Free for registered women entrepreneurs" },
  { id: 2, name: "Digital Skills Workshop", date: "April 5, 2026", location: "Online (Zoom)", desc: "Learn social media marketing, e-commerce listing, and digital payment tools for your business.", registration: "Free — Register online" },
  { id: 3, name: "SHG Mela – Rajasthan", date: "April 12-14, 2026", location: "Jaipur Exhibition Ground", desc: "Self Help Group products exhibition and sale. Handicrafts, textiles, food products from across Rajasthan.", registration: "₹200 stall booking" },
  { id: 4, name: "Financial Literacy Camp", date: "April 20, 2026", location: "District Collectorate, Lucknow", desc: "Learn about banking, savings schemes, insurance, and government loans. Free financial consultation.", registration: "Free — Walk-in" },
];

export default function EventsPage() {
  const [selected, setSelected] = useState<typeof events[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Events & Expo</h1>
        <p className="text-muted-foreground">Discover networking events, expos, and workshops near you.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {events.map((e, i) => (
          <motion.div key={e.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(e)}>
              <CardContent className="p-5">
                <h3 className="font-sans font-semibold text-sm mb-2">{e.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{e.desc}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{e.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location.split(",")[0]}</span>
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
              <p className="text-sm leading-relaxed">{selected.desc}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{selected.date}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Location</p><p className="font-medium">{selected.location}</p></div>
                <div className="p-3 rounded-lg bg-muted col-span-2"><p className="text-xs text-muted-foreground">Registration</p><p className="font-medium">{selected.registration}</p></div>
              </div>
              <Button className="w-full" onClick={() => { toast.success("Registration confirmed!"); setSelected(null); }}>Register Now</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
