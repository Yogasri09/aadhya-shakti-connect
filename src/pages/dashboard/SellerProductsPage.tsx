import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Search, Edit, Trash2, Package, Eye, ShoppingBag, IndianRupee, MapPin, Loader2,
  CheckCircle, Clock, Truck, XCircle, Briefcase, Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ImageUploader from "@/components/marketplace/ImageUploader";

const PRODUCT_CATS = ["Fashion & Textiles", "Handicrafts", "Accessories", "Food & Beverages", "Home Decor", "Beauty & Wellness", "Digital Products"];
const SERVICE_CATS = ["Tailoring", "Beautician", "Teaching", "Freelancing", "Cooking", "Digital Marketing", "Design"];
const EXP_LEVELS = ["Beginner", "Intermediate", "Expert"];

interface Product {
  id: string; name: string; category: string; price: number; description: string | null;
  status: string; views_count: number; state: string | null; city: string | null;
  image_url: string | null; images: string[] | null; stock: number;
}
interface Service {
  id: string; title: string; category: string; price: number; description: string | null;
  pricing_type: string; experience_level: string | null; availability: string | null;
  is_active: boolean; image_url: string | null; state: string | null; city: string | null;
}
interface Order {
  id: string; product_id: string; total_price: number; status: string;
  shipping_address: string; phone: string; notes: string | null; created_at: string;
}
interface Booking {
  id: string; service_id: string; total_price: number; status: string;
  scheduled_at: string; phone: string; notes: string | null; created_at: string;
}

export default function SellerProductsPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");

  // Product dialog
  const [pDialog, setPDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pForm, setPForm] = useState({ name: "", category: "", price: "", description: "", stock: "1", images: [] as string[] });
  const [pSaving, setPSaving] = useState(false);

  // Service dialog
  const [sDialog, setSDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [sForm, setSForm] = useState({ title: "", category: "", price: "", description: "", pricing_type: "fixed", experience_level: "Beginner", availability: "", image_url: "", is_active: true });
  const [sSaving, setSSaving] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const [p, s, o, b] = await Promise.all([
      supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("services").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProducts(p.data || []); setServices(s.data || []);
    setOrders(o.data || []); setBookings(b.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  // ===== PRODUCTS =====
  const openAddProduct = () => {
    setEditingProduct(null);
    setPForm({ name: "", category: "", price: "", description: "", stock: "1", images: [] });
    setPDialog(true);
  };
  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setPForm({
      name: p.name, category: p.category, price: p.price.toString(),
      description: p.description || "", stock: p.stock.toString(),
      images: p.images || (p.image_url ? [p.image_url] : []),
    });
    setPDialog(true);
  };
  const saveProduct = async () => {
    if (!user || !pForm.name || !pForm.category || !pForm.price) {
      toast.error("Please fill required fields"); return;
    }
    setPSaving(true);
    const payload = {
      name: pForm.name, category: pForm.category, price: parseFloat(pForm.price),
      description: pForm.description || null, stock: parseInt(pForm.stock) || 1,
      images: pForm.images, image_url: pForm.images[0] || null,
    };
    if (editingProduct) {
      const { error } = await supabase.from("products").update(payload).eq("id", editingProduct.id);
      if (error) toast.error("Failed to update"); else toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("products").insert({
        seller_id: user.id, ...payload,
        state: profile?.state || null, city: profile?.city || null,
      });
      if (error) toast.error("Failed to add"); else toast.success("Product added!");
    }
    setPSaving(false); setPDialog(false); fetchData();
  };
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast.success("Product deleted");
    setProducts(prev => prev.filter(x => x.id !== id));
  };

  // ===== SERVICES =====
  const openAddService = () => {
    setEditingService(null);
    setSForm({ title: "", category: "", price: "", description: "", pricing_type: "fixed", experience_level: "Beginner", availability: "", image_url: "", is_active: true });
    setSDialog(true);
  };
  const openEditService = (s: Service) => {
    setEditingService(s);
    setSForm({
      title: s.title, category: s.category, price: s.price.toString(),
      description: s.description || "", pricing_type: s.pricing_type,
      experience_level: s.experience_level || "Beginner",
      availability: s.availability || "", image_url: s.image_url || "",
      is_active: s.is_active,
    });
    setSDialog(true);
  };
  const saveService = async () => {
    if (!user || !sForm.title || !sForm.category || !sForm.price) {
      toast.error("Please fill required fields"); return;
    }
    setSSaving(true);
    const payload = {
      title: sForm.title, category: sForm.category, price: parseFloat(sForm.price),
      description: sForm.description || null, pricing_type: sForm.pricing_type,
      experience_level: sForm.experience_level, availability: sForm.availability || null,
      image_url: sForm.image_url || null, is_active: sForm.is_active,
    };
    if (editingService) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingService.id);
      if (error) toast.error("Failed to update"); else toast.success("Service updated!");
    } else {
      const { error } = await supabase.from("services").insert({
        seller_id: user.id, ...payload,
        state: profile?.state || null, city: profile?.city || null,
      });
      if (error) toast.error("Failed to add"); else toast.success("Service added!");
    }
    setSSaving(false); setSDialog(false); fetchData();
  };
  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast.success("Service deleted");
    setServices(prev => prev.filter(x => x.id !== id));
  };

  // ===== ORDER STATUS =====
  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    toast.success(`Order ${status}`);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };
  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    toast.success(`Booking ${status}`);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "pending": return <Clock className="h-4 w-4 text-warm" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 text-primary" />;
      case "shipped": return <Truck className="h-4 w-4 text-accent" />;
      case "delivered":
      case "completed": return <CheckCircle className="h-4 w-4 text-success" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const totalRevenue =
    orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_price), 0) +
    bookings.filter(b => b.status === "completed").reduce((s, b) => s + Number(b.total_price), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Seller Portal</h1>
          <p className="text-muted-foreground">Manage products, services, orders, and bookings.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Package, value: products.length, label: "Products", color: "text-primary" },
          { icon: Briefcase, value: services.length, label: "Services", color: "text-accent" },
          { icon: ShoppingBag, value: orders.length + bookings.length, label: "Orders + Bookings", color: "text-warm" },
          { icon: IndianRupee, value: `₹${totalRevenue.toLocaleString()}`, label: "Revenue", color: "text-success" },
        ].map(w => (
          <Card key={w.label} className="glass-card">
            <CardContent className="p-4 flex items-center gap-3">
              <w.icon className={`h-8 w-8 ${w.color}`} />
              <div><p className="text-xl font-bold">{w.value}</p><p className="text-xs text-muted-foreground">{w.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
        </TabsList>

        {/* PRODUCTS TAB */}
        <TabsContent value="products" className="mt-4 space-y-4">
          <Button onClick={openAddProduct} className="hero-gradient text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <Card key={p.id} className="glass-card hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="h-28 bg-muted/50 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {p.image_url || (p.images && p.images[0]) ? (
                      <img src={p.image_url || p.images![0]} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : <Package className="h-10 w-10 text-muted-foreground/30" />}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                    <Badge variant={p.status === "approved" ? "default" : "outline"} className="text-[10px]">{p.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{p.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary text-sm">₹{p.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">Stock: {p.stock}</span>
                    <span className="text-muted-foreground flex items-center gap-0.5"><Eye className="h-3 w-3" />{p.views_count}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditProduct(p)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No products yet. Add your first one!</p>
            </div>
          )}
        </TabsContent>

        {/* SERVICES TAB */}
        <TabsContent value="services" className="mt-4 space-y-4">
          <Button onClick={openAddService} className="hero-gradient text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </Button>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => (
              <Card key={s.id} className="glass-card hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : <Briefcase className="h-10 w-10 text-primary/40" />}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{s.title}</h3>
                      <p className="text-xs text-muted-foreground">{s.category}</p>
                    </div>
                    <Badge variant={s.is_active ? "default" : "outline"} className="text-[10px]">{s.is_active ? "active" : "paused"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{s.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary text-sm">₹{s.price}<span className="text-[10px] font-normal">/{s.pricing_type === "hourly" ? "hr" : "fixed"}</span></span>
                    <Badge variant="outline" className="text-[10px]">{s.experience_level}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditService(s)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => deleteService(s.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {services.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No services yet. Offer your skills!</p>
            </div>
          )}
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No orders yet.</p>
            </div>
          ) : orders.map(o => (
            <Card key={o.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">{statusIcon(o.status)}<Badge variant="outline" className="capitalize">{o.status}</Badge></div>
                  <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{Number(o.total_price).toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><MapPin className="inline h-3 w-3 mr-1" />{o.shipping_address}</p>
                <p className="text-xs text-muted-foreground">📞 {o.phone}</p>
                {o.notes && <p className="text-xs text-muted-foreground mt-1">📝 {o.notes}</p>}
                <p className="text-xs text-muted-foreground mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
                {o.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(o.id, "confirmed")}><CheckCircle className="h-3 w-3 mr-1" />Confirm</Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateOrderStatus(o.id, "cancelled")}><XCircle className="h-3 w-3 mr-1" />Cancel</Button>
                  </div>
                )}
                {o.status === "confirmed" && <Button size="sm" className="mt-3 w-full" onClick={() => updateOrderStatus(o.id, "shipped")}><Truck className="h-3 w-3 mr-1" />Mark Shipped</Button>}
                {o.status === "shipped" && <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => updateOrderStatus(o.id, "delivered")}><CheckCircle className="h-3 w-3 mr-1" />Mark Delivered</Button>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* BOOKINGS TAB */}
        <TabsContent value="bookings" className="mt-4 space-y-3">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No bookings yet.</p>
            </div>
          ) : bookings.map(b => (
            <Card key={b.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">{statusIcon(b.status)}<Badge variant="outline" className="capitalize">{b.status}</Badge></div>
                  <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{Number(b.total_price).toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><Calendar className="inline h-3 w-3 mr-1" />{new Date(b.scheduled_at).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">📞 {b.phone}</p>
                {b.notes && <p className="text-xs text-muted-foreground mt-1">📝 {b.notes}</p>}
                {b.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1" onClick={() => updateBookingStatus(b.id, "confirmed")}><CheckCircle className="h-3 w-3 mr-1" />Confirm</Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateBookingStatus(b.id, "cancelled")}><XCircle className="h-3 w-3 mr-1" />Decline</Button>
                  </div>
                )}
                {b.status === "confirmed" && <Button size="sm" className="mt-3 w-full" onClick={() => updateBookingStatus(b.id, "completed")}><CheckCircle className="h-3 w-3 mr-1" />Mark Completed</Button>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* PRODUCT DIALOG */}
      <Dialog open={pDialog} onOpenChange={setPDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-serif">{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Images</Label>
              <ImageUploader value={pForm.images} onChange={imgs => setPForm(f => ({ ...f, images: imgs }))} /></div>
            <div><Label>Product Name *</Label>
              <Input value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} maxLength={100} /></div>
            <div><Label>Category *</Label>
              <Select value={pForm.category} onValueChange={v => setPForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{PRODUCT_CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹) *</Label>
                <Input type="number" min="0" value={pForm.price} onChange={e => setPForm(f => ({ ...f, price: e.target.value }))} /></div>
              <div><Label>Stock</Label>
                <Input type="number" min="0" value={pForm.stock} onChange={e => setPForm(f => ({ ...f, stock: e.target.value }))} /></div>
            </div>
            <div><Label>Description</Label>
              <Textarea value={pForm.description} onChange={e => setPForm(f => ({ ...f, description: e.target.value }))} rows={3} maxLength={1000} /></div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setPDialog(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={saveProduct} disabled={pSaving}>
                {pSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editingProduct ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SERVICE DIALOG */}
      <Dialog open={sDialog} onOpenChange={setSDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-serif">{editingService ? "Edit Service" : "Add Service"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Cover Image</Label>
              <ImageUploader value={sForm.image_url ? [sForm.image_url] : []} onChange={imgs => setSForm(f => ({ ...f, image_url: imgs[0] || "" }))} max={1} /></div>
            <div><Label>Service Title *</Label>
              <Input value={sForm.title} onChange={e => setSForm(f => ({ ...f, title: e.target.value }))} maxLength={100} /></div>
            <div><Label>Category *</Label>
              <Select value={sForm.category} onValueChange={v => setSForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{SERVICE_CATS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price (₹) *</Label>
                <Input type="number" min="0" value={sForm.price} onChange={e => setSForm(f => ({ ...f, price: e.target.value }))} /></div>
              <div><Label>Pricing</Label>
                <Select value={sForm.pricing_type} onValueChange={v => setSForm(f => ({ ...f, pricing_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="fixed">Fixed</SelectItem><SelectItem value="hourly">Hourly</SelectItem></SelectContent>
                </Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Experience</Label>
                <Select value={sForm.experience_level} onValueChange={v => setSForm(f => ({ ...f, experience_level: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EXP_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select></div>
              <div><Label>Availability</Label>
                <Input value={sForm.availability} onChange={e => setSForm(f => ({ ...f, availability: e.target.value }))} placeholder="Mon–Fri 9–5" maxLength={50} /></div>
            </div>
            <div><Label>Description</Label>
              <Textarea value={sForm.description} onChange={e => setSForm(f => ({ ...f, description: e.target.value }))} rows={3} maxLength={1000} /></div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active (visible in marketplace)</Label>
              <Switch id="active" checked={sForm.is_active} onCheckedChange={v => setSForm(f => ({ ...f, is_active: v }))} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSDialog(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={saveService} disabled={sSaving}>
                {sSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editingService ? "Save" : "Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
