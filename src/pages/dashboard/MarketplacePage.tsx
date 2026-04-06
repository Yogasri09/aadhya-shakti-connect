import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, IndianRupee, Search, MapPin, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  category: string;
  state: string | null;
  city: string | null;
  image_url: string | null;
  seller_id: string;
  status: string;
}

const categories = ["All", "Fashion & Textiles", "Handicrafts", "Accessories", "Food & Beverages", "Home Decor", "Beauty & Wellness"];

export default function MarketplacePage() {
  const { user, hasRole } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [orderOpen, setOrderOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ address: "", phone: "", notes: "" });
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p =>
    (category === "All" || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || "").toLowerCase().includes(search.toLowerCase()))
  );

  const handleOrder = async () => {
    if (!selected || !user) return;
    if (!orderForm.address.trim() || !orderForm.phone.trim()) {
      toast.error("Please fill in address and phone number");
      return;
    }
    if (orderForm.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setPlacing(true);
    const { error } = await supabase.from("orders").insert({
      buyer_id: user.id,
      seller_id: selected.seller_id,
      product_id: selected.id,
      total_price: selected.price,
      shipping_address: orderForm.address.trim(),
      phone: orderForm.phone.trim(),
      notes: orderForm.notes.trim() || null,
    });
    if (error) {
      toast.error("Failed to place order");
    } else {
      toast.success("Order placed successfully! The seller will be notified.");
      // Create notification for buyer
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Order Placed! 🛒",
        message: `Your order for "${selected.name}" has been placed. You'll be notified when the seller confirms.`,
        type: "order",
      });
    }
    setPlacing(false);
    setOrderOpen(false);
    setSelected(null);
    setOrderForm({ address: "", phone: "", notes: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Marketplace</h1>
        <p className="text-muted-foreground">Products made by women entrepreneurs across India.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No products found</p>
          <p className="text-sm">Check back later or try a different category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
            >
              <Card className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 glass-card overflow-hidden" onClick={() => setSelected(p)}>
                <CardContent className="p-5">
                  <div className="h-32 rounded-lg bg-muted/50 flex items-center justify-center mb-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p.category}</span>
                  <h3 className="font-sans font-semibold text-sm mt-1.5 mb-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm flex items-center text-primary"><IndianRupee className="h-3 w-3" />{p.price}</span>
                    {(p.state || p.city) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{[p.city, p.state].filter(Boolean).join(", ")}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Product Detail Dialog */}
      <Dialog open={!!selected && !orderOpen} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif">{selected.name}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="h-48 rounded-lg bg-muted/50 flex items-center justify-center">
                {selected.image_url ? (
                  <img src={selected.image_url} alt={selected.name} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>
              <p className="text-sm leading-relaxed">{selected.description || "No description available."}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{selected.category}</span>
                <span className="font-bold text-xl flex items-center text-primary"><IndianRupee className="h-4 w-4" />{selected.price}</span>
              </div>
              {user && selected.seller_id !== user.id && (
                <Button className="w-full hero-gradient text-primary-foreground" onClick={() => setOrderOpen(true)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Place Order
                </Button>
              )}
              {!user && <p className="text-center text-sm text-muted-foreground">Log in to place an order.</p>}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Order Form Dialog */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Place Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="font-medium text-sm">{selected?.name}</span>
              <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{selected?.price}</span>
            </div>
            <div>
              <Label>Shipping Address *</Label>
              <Textarea placeholder="Enter your full shipping address..." value={orderForm.address} onChange={e => setOrderForm(p => ({ ...p, address: e.target.value }))} rows={3} />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input placeholder="Enter your phone number" value={orderForm.phone} onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input placeholder="Any special instructions..." value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setOrderOpen(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={handleOrder} disabled={placing}>
                {placing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                Confirm Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
