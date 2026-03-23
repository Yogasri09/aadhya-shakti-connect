import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, IndianRupee, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const products = [
  { id: 1, name: "Hand-Embroidered Dupatta", price: 850, seller: "Meena Devi", location: "Varanasi", desc: "Beautiful Banarasi hand-embroidered dupatta with traditional motifs. Made with love and precision.", initials: "MD" },
  { id: 2, name: "Organic Mango Pickle", price: 250, seller: "Sunita Patil", location: "Ratnagiri", desc: "Home-made organic mango pickle using traditional recipe. No preservatives, pure taste.", initials: "SP" },
  { id: 3, name: "Block Print Cotton Saree", price: 1200, seller: "Roshni Kumari", location: "Jaipur", desc: "Hand block printed cotton saree with natural dyes. Each piece is unique and eco-friendly.", initials: "RK" },
  { id: 4, name: "Handmade Terracotta Jewelry", price: 450, seller: "Kavita Sharma", location: "Lucknow", desc: "Beautiful terracotta earrings and necklace set hand-painted with vibrant colors.", initials: "KS" },
  { id: 5, name: "Masala Box (Set of 8)", price: 380, seller: "Anjali Devi", location: "Hyderabad", desc: "Fresh ground spice collection — turmeric, chili, coriander, cumin, garam masala, and more.", initials: "AD" },
  { id: 6, name: "Crochet Baby Blanket", price: 650, seller: "Fatima Begum", location: "Bhopal", desc: "Soft handmade crochet blanket perfect for babies. Available in multiple colors.", initials: "FB" },
];

export default function MarketplacePage() {
  const [selected, setSelected] = useState<typeof products[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Marketplace</h1>
          <p className="text-muted-foreground">Products made by women entrepreneurs across India.</p>
        </div>
        <Button>List Your Product</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(p)}>
              <CardContent className="p-5">
                <div className="h-32 rounded-lg bg-muted flex items-center justify-center mb-3">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-sans font-semibold text-sm mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm flex items-center"><IndianRupee className="h-3 w-3" />{p.price}</span>
                  <span className="text-xs text-muted-foreground">{p.seller}</span>
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
              <div className="h-48 rounded-lg bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <p className="text-sm leading-relaxed">{selected.desc}</p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">{selected.initials}</div>
                <div><p className="font-medium text-sm">{selected.seller}</p><p className="text-xs text-muted-foreground">{selected.location}</p></div>
                <span className="ml-auto font-bold text-lg flex items-center"><IndianRupee className="h-4 w-4" />{selected.price}</span>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => toast.success("Order request sent to " + selected.seller)}>Request Order</Button>
                <Button variant="outline" className="flex-1" onClick={() => toast.success("Message sent to seller")}><MessageSquare className="mr-2 h-4 w-4" />Contact Seller</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
