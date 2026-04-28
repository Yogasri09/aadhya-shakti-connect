import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ShoppingBag, IndianRupee, Search, MapPin, Loader2, ShoppingCart, MessageSquare,
  Briefcase, Clock, Sparkles, Heart, Star,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RatingSummary from "@/components/marketplace/RatingSummary";
import ReviewsSection from "@/components/marketplace/ReviewsSection";
import WishlistButton from "@/components/marketplace/WishlistButton";
import ChatDrawer from "@/components/marketplace/ChatDrawer";
import StarRating from "@/components/marketplace/StarRating";

interface Product {
  id: string; name: string; price: number; description: string | null; category: string;
  state: string | null; city: string | null; image_url: string | null; images: string[] | null;
  seller_id: string; status: string; stock: number;
}
interface Service {
  id: string; title: string; price: number; description: string | null; category: string;
  pricing_type: string; experience_level: string | null; availability: string | null;
  state: string | null; city: string | null; image_url: string | null; seller_id: string; is_active: boolean;
}

const PRODUCT_CATS = ["All", "Fashion & Textiles", "Handicrafts", "Accessories", "Food & Beverages", "Home Decor", "Beauty & Wellness"];
const SERVICE_CATS = ["All", "Tailoring", "Beautician", "Teaching", "Freelancing", "Cooking", "Digital Marketing", "Design"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
];

const PAGE_SIZE = 12;

export default function MarketplacePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingP, setLoadingP] = useState(true);
  const [pSearch, setPSearch] = useState("");
  const [pCategory, setPCategory] = useState("All");
  const [pSort, setPSort] = useState("newest");
  const [pPage, setPPage] = useState(1);

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [loadingS, setLoadingS] = useState(true);
  const [sSearch, setSSearch] = useState("");
  const [sCategory, setSCategory] = useState("All");
  const [sSort, setSSort] = useState("newest");
  const [sPage, setSPage] = useState(1);

  // Wishlist state
  const [wishlist, setWishlist] = useState<{ products: Product[]; services: Service[] } | null>(null);

  // Detail dialogs
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Order/booking
  const [orderOpen, setOrderOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({ address: "", phone: "", notes: "" });
  const [bookingForm, setBookingForm] = useState({ scheduled_at: "", phone: "", notes: "" });
  const [placing, setPlacing] = useState(false);

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState<{ sellerId: string; productId?: string; serviceId?: string } | null>(null);

  useEffect(() => {
    supabase.from("products").select("*").eq("status", "approved").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoadingP(false); });
    supabase.from("services").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data }) => { setServices(data || []); setLoadingS(false); });
  }, []);

  useEffect(() => {
    if (tab !== "wishlist" || !user) return;
    (async () => {
      const { data: items } = await supabase.from("wishlists").select("*").eq("user_id", user.id);
      const productIds = (items || []).filter(i => i.target_type === "product").map(i => i.target_id);
      const serviceIds = (items || []).filter(i => i.target_type === "service").map(i => i.target_id);
      const [pRes, sRes] = await Promise.all([
        productIds.length ? supabase.from("products").select("*").in("id", productIds) : Promise.resolve({ data: [] as Product[] }),
        serviceIds.length ? supabase.from("services").select("*").in("id", serviceIds) : Promise.resolve({ data: [] as Service[] }),
      ]);
      setWishlist({ products: (pRes.data || []) as Product[], services: (sRes.data || []) as Service[] });
    })();
  }, [tab, user]);

  // Filter + sort products
  const filteredProducts = products
    .filter(p => (pCategory === "All" || p.category === pCategory) &&
      (p.name.toLowerCase().includes(pSearch.toLowerCase()) || (p.description || "").toLowerCase().includes(pSearch.toLowerCase())))
    .sort((a, b) => pSort === "price_low" ? a.price - b.price : pSort === "price_high" ? b.price - a.price : 0);
  const pagedProducts = filteredProducts.slice(0, pPage * PAGE_SIZE);

  const filteredServices = services
    .filter(s => (sCategory === "All" || s.category === sCategory) &&
      (s.title.toLowerCase().includes(sSearch.toLowerCase()) || (s.description || "").toLowerCase().includes(sSearch.toLowerCase())))
    .sort((a, b) => sSort === "price_low" ? a.price - b.price : sSort === "price_high" ? b.price - a.price : 0);
  const pagedServices = filteredServices.slice(0, sPage * PAGE_SIZE);

  const placeOrder = async () => {
    if (!selectedProduct || !user) return;
    if (!orderForm.address.trim() || orderForm.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please fill address and a valid phone number"); return;
    }
    setPlacing(true);
    const { error } = await supabase.from("orders").insert({
      buyer_id: user.id, seller_id: selectedProduct.seller_id, product_id: selectedProduct.id,
      total_price: selectedProduct.price, shipping_address: orderForm.address.trim(),
      phone: orderForm.phone.trim(), notes: orderForm.notes.trim() || null,
    });
    if (error) toast.error("Failed to place order");
    else {
      toast.success("Order placed! Seller has been notified.");
      await supabase.from("notifications").insert({
        user_id: user.id, title: "Order Placed! 🛒",
        message: `Your order for "${selectedProduct.name}" has been placed.`, type: "order",
      });
    }
    setPlacing(false); setOrderOpen(false); setSelectedProduct(null);
    setOrderForm({ address: "", phone: "", notes: "" });
  };

  const placeBooking = async () => {
    if (!selectedService || !user) return;
    if (!bookingForm.scheduled_at || bookingForm.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please pick a date/time and enter a valid phone number"); return;
    }
    setPlacing(true);
    const { error } = await supabase.from("bookings").insert({
      buyer_id: user.id, seller_id: selectedService.seller_id, service_id: selectedService.id,
      scheduled_at: new Date(bookingForm.scheduled_at).toISOString(),
      total_price: selectedService.price, phone: bookingForm.phone.trim(),
      notes: bookingForm.notes.trim() || null,
    });
    if (error) toast.error("Failed to book service");
    else {
      toast.success("Booking requested! Provider will confirm shortly.");
      await supabase.from("notifications").insert({
        user_id: user.id, title: "Service Booked! 📅",
        message: `Your booking for "${selectedService.title}" is awaiting confirmation.`, type: "booking",
      });
    }
    setPlacing(false); setBookingOpen(false); setSelectedService(null);
    setBookingForm({ scheduled_at: "", phone: "", notes: "" });
  };

  const startChat = (sellerId: string, productId?: string, serviceId?: string) => {
    if (!user) { toast.error("Log in to chat"); return; }
    if (sellerId === user.id) { toast.error("That's you 😊"); return; }
    setChatTarget({ sellerId, productId, serviceId });
    setChatOpen(true);
  };

  const renderProductCard = (p: Product, i: number) => (
    <motion.div key={p.id}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
    >
      <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 glass-card overflow-hidden h-full relative" onClick={() => setSelectedProduct(p)}>
        <WishlistButton targetId={p.id} targetType="product" />
        <CardContent className="p-4">
          <div className="h-36 -mx-4 -mt-4 mb-3 bg-muted/50 flex items-center justify-center overflow-hidden">
            {p.image_url || (p.images && p.images[0]) ? (
              <img src={p.image_url || p.images![0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
            )}
          </div>
          <Badge variant="outline" className="text-[10px] mb-1.5">{p.category}</Badge>
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{p.name}</h3>
          <RatingSummary targetId={p.id} targetType="product" compact />
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-base flex items-center text-primary"><IndianRupee className="h-3.5 w-3.5" />{p.price.toLocaleString()}</span>
            {(p.city || p.state) && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{[p.city, p.state].filter(Boolean).join(", ")}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderServiceCard = (s: Service, i: number) => (
    <motion.div key={s.id}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.4) }}
    >
      <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 glass-card overflow-hidden h-full relative" onClick={() => setSelectedService(s)}>
        <WishlistButton targetId={s.id} targetType="service" />
        <CardContent className="p-4">
          <div className="h-36 -mx-4 -mt-4 mb-3 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
            {s.image_url ? (
              <img src={s.image_url} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <Briefcase className="h-10 w-10 text-primary/40" />
            )}
          </div>
          <Badge variant="outline" className="text-[10px] mb-1.5">{s.category}</Badge>
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{s.title}</h3>
          <RatingSummary targetId={s.id} targetType="service" compact />
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-base flex items-center text-primary">
              <IndianRupee className="h-3.5 w-3.5" />{s.price.toLocaleString()}
              <span className="text-[10px] text-muted-foreground font-normal ml-1">/{s.pricing_type === "hourly" ? "hr" : "fixed"}</span>
            </span>
            {s.experience_level && (
              <Badge variant="secondary" className="text-[10px]"><Sparkles className="h-2.5 w-2.5 mr-0.5" />{s.experience_level}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Marketplace</h1>
        <p className="text-muted-foreground">Discover products and services from women entrepreneurs.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="products"><ShoppingBag className="h-4 w-4 mr-1.5" />Products</TabsTrigger>
          <TabsTrigger value="services"><Briefcase className="h-4 w-4 mr-1.5" />Services</TabsTrigger>
          <TabsTrigger value="wishlist"><Heart className="h-4 w-4 mr-1.5" />Wishlist</TabsTrigger>
        </TabsList>

        {/* PRODUCTS */}
        <TabsContent value="products" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={pSearch} onChange={e => setPSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={pCategory} onValueChange={setPCategory}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{PRODUCT_CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={pSort} onValueChange={setPSort}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {loadingP ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState icon={ShoppingBag} text="No products found" />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pagedProducts.map(renderProductCard)}
              </div>
              {pagedProducts.length < filteredProducts.length && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => setPPage(p => p + 1)}>Load more</Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* SERVICES */}
        <TabsContent value="services" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search services..." value={sSearch} onChange={e => setSSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={sCategory} onValueChange={setSCategory}>
              <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>{SERVICE_CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sSort} onValueChange={setSSort}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {loadingS ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filteredServices.length === 0 ? (
            <EmptyState icon={Briefcase} text="No services available yet" />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {pagedServices.map(renderServiceCard)}
              </div>
              {pagedServices.length < filteredServices.length && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => setSPage(p => p + 1)}>Load more</Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* WISHLIST */}
        <TabsContent value="wishlist" className="space-y-6 mt-6">
          {!user ? (
            <EmptyState icon={Heart} text="Log in to save items to your wishlist" />
          ) : !wishlist ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : wishlist.products.length === 0 && wishlist.services.length === 0 ? (
            <EmptyState icon={Heart} text="Your wishlist is empty. Tap the heart on any item to save it." />
          ) : (
            <>
              {wishlist.products.length > 0 && (
                <section>
                  <h2 className="font-serif text-lg mb-3">Saved Products ({wishlist.products.length})</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {wishlist.products.map((p, i) => renderProductCard(p, i))}
                  </div>
                </section>
              )}
              {wishlist.services.length > 0 && (
                <section>
                  <h2 className="font-serif text-lg mb-3">Saved Services ({wishlist.services.length})</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {wishlist.services.map((s, i) => renderServiceCard(s, i))}
                  </div>
                </section>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* PRODUCT DETAIL */}
      <Dialog open={!!selectedProduct && !orderOpen} onOpenChange={() => setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-serif">{selectedProduct.name}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="h-56 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
                {selectedProduct.image_url || (selectedProduct.images && selectedProduct.images[0]) ? (
                  <img src={selectedProduct.image_url || selectedProduct.images![0]} alt={selectedProduct.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-14 w-14 text-muted-foreground/30" />
                )}
              </div>
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {selectedProduct.images.map((u, i) => (
                    <img key={i} src={u} alt="" loading="lazy" className="h-16 w-16 rounded-md object-cover border" />
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="outline">{selectedProduct.category}</Badge>
                <span className="font-bold text-2xl flex items-center text-primary"><IndianRupee className="h-5 w-5" />{selectedProduct.price.toLocaleString()}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedProduct.description || "No description available."}</p>
              {(selectedProduct.city || selectedProduct.state) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{[selectedProduct.city, selectedProduct.state].filter(Boolean).join(", ")}</p>
              )}

              {user && selectedProduct.seller_id !== user.id && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => startChat(selectedProduct.seller_id, selectedProduct.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />Chat
                  </Button>
                  <Button className="flex-1 hero-gradient text-primary-foreground" onClick={() => setOrderOpen(true)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />Buy Now
                  </Button>
                </div>
              )}
              {!user && <p className="text-center text-sm text-muted-foreground">Log in to buy or chat with the seller.</p>}

              <div className="border-t pt-4">
                <h3 className="font-serif text-base mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Reviews</h3>
                <ReviewsSection targetId={selectedProduct.id} targetType="product" />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* SERVICE DETAIL */}
      <Dialog open={!!selectedService && !bookingOpen} onOpenChange={() => setSelectedService(null)}>
        {selectedService && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-serif">{selectedService.title}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="h-48 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
                {selectedService.image_url ? (
                  <img src={selectedService.image_url} alt={selectedService.title} className="h-full w-full object-cover" />
                ) : (
                  <Briefcase className="h-14 w-14 text-primary/40" />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedService.category}</Badge>
                {selectedService.experience_level && <Badge variant="secondary"><Sparkles className="h-3 w-3 mr-1" />{selectedService.experience_level}</Badge>}
                {selectedService.availability && <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{selectedService.availability}</Badge>}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{selectedService.pricing_type === "hourly" ? "Hourly rate" : "Fixed price"}</span>
                <span className="font-bold text-2xl flex items-center text-primary">
                  <IndianRupee className="h-5 w-5" />{selectedService.price.toLocaleString()}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/{selectedService.pricing_type === "hourly" ? "hr" : "fixed"}</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{selectedService.description || "No description provided."}</p>
              {(selectedService.city || selectedService.state) && (
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{[selectedService.city, selectedService.state].filter(Boolean).join(", ")}</p>
              )}

              {user && selectedService.seller_id !== user.id && (
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => startChat(selectedService.seller_id, undefined, selectedService.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />Chat
                  </Button>
                  <Button className="flex-1 hero-gradient text-primary-foreground" onClick={() => setBookingOpen(true)}>
                    <Clock className="h-4 w-4 mr-2" />Book Now
                  </Button>
                </div>
              )}
              {!user && <p className="text-center text-sm text-muted-foreground">Log in to book this service.</p>}

              <div className="border-t pt-4">
                <h3 className="font-serif text-base mb-3 flex items-center gap-2"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /> Reviews</h3>
                <ReviewsSection targetId={selectedService.id} targetType="service" />
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ORDER FORM */}
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Place Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="font-medium text-sm">{selectedProduct?.name}</span>
              <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{selectedProduct?.price}</span>
            </div>
            <div><Label>Shipping Address *</Label>
              <Textarea value={orderForm.address} onChange={e => setOrderForm(p => ({ ...p, address: e.target.value }))} rows={3} maxLength={500} /></div>
            <div><Label>Phone Number *</Label>
              <Input value={orderForm.phone} onChange={e => setOrderForm(p => ({ ...p, phone: e.target.value }))} maxLength={15} /></div>
            <div><Label>Notes (optional)</Label>
              <Input value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))} maxLength={200} /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setOrderOpen(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={placeOrder} disabled={placing}>
                {placing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Confirm Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* BOOKING FORM */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Book Service</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="font-medium text-sm">{selectedService?.title}</span>
              <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{selectedService?.price}</span>
            </div>
            <div><Label>Preferred Date & Time *</Label>
              <Input type="datetime-local" value={bookingForm.scheduled_at} onChange={e => setBookingForm(p => ({ ...p, scheduled_at: e.target.value }))} min={new Date().toISOString().slice(0, 16)} /></div>
            <div><Label>Phone Number *</Label>
              <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} maxLength={15} /></div>
            <div><Label>Notes (optional)</Label>
              <Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} rows={2} maxLength={300} /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setBookingOpen(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={placeBooking} disabled={placing}>
                {placing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Request Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CHAT */}
      {chatTarget && (
        <ChatDrawer
          open={chatOpen}
          onOpenChange={setChatOpen}
          sellerId={chatTarget.sellerId}
          productId={chatTarget.productId}
          serviceId={chatTarget.serviceId}
        />
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof ShoppingBag; text: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <Icon className="h-12 w-12 mx-auto mb-3 opacity-30" />
      <p className="font-medium">{text}</p>
    </div>
  );
}
