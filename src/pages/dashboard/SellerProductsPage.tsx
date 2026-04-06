import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Search, Edit, Trash2, Package, Eye, ShoppingBag, IndianRupee, MapPin, Loader2,
  CheckCircle, Clock, Truck, XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = ["Fashion & Textiles", "Handicrafts", "Accessories", "Food & Beverages", "Home Decor", "Beauty & Wellness", "Digital Products"];

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  status: string;
  views_count: number;
  state: string | null;
  city: string | null;
  image_url: string | null;
}

interface Order {
  id: string;
  product_id: string;
  total_price: number;
  status: string;
  shipping_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
}

export default function SellerProductsPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", price: "", description: "" });
  const [tab, setTab] = useState("products");

  const fetchData = async () => {
    if (!user) return;
    const [prodRes, orderRes] = await Promise.all([
      supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("*").eq("seller_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProducts(prodRes.data || []);
    setOrders(orderRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm({ name: "", category: "", price: "", description: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, category: product.category, price: product.price.toString(), description: product.description || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !form.name || !form.category || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);

    if (editingProduct) {
      const { error } = await supabase.from("products").update({
        name: form.name, category: form.category, price: parseFloat(form.price), description: form.description || null,
      }).eq("id", editingProduct.id);
      if (error) toast.error("Failed to update product");
      else toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("products").insert({
        seller_id: user.id, name: form.name, category: form.category,
        price: parseFloat(form.price), description: form.description || null,
        state: profile?.state || null, city: profile?.city || null,
      });
      if (error) toast.error("Failed to add product");
      else toast.success("Product added! It will be reviewed shortly.");
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else {
      toast.success("Product deleted");
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) toast.error("Failed to update order");
    else {
      toast.success(`Order ${status}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "pending": return <Clock className="h-4 w-4 text-warm" />;
      case "confirmed": return <CheckCircle className="h-4 w-4 text-primary" />;
      case "shipped": return <Truck className="h-4 w-4 text-accent" />;
      case "delivered": return <CheckCircle className="h-4 w-4 text-success" />;
      case "cancelled": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const totalViews = products.reduce((s, p) => s + p.views_count, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Seller Portal</h1>
          <p className="text-muted-foreground">Manage your products and orders.</p>
        </div>
        <Button onClick={openAddDialog} className="hero-gradient text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { icon: Package, value: products.length, label: "Products", color: "text-primary" },
          { icon: Eye, value: totalViews, label: "Views", color: "text-accent" },
          { icon: ShoppingBag, value: orders.length, label: "Orders", color: "text-warm" },
          { icon: IndianRupee, value: `₹${orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total_price), 0).toLocaleString()}`, label: "Revenue", color: "text-success" },
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
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(product => (
              <Card key={product.id} className="glass-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="h-28 bg-muted/50 rounded-lg flex items-center justify-center mb-3">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.status === "approved" ? "default" : "outline"} className="text-[10px]">{product.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Eye className="h-3 w-3" /> {product.views_count}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(product)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => deleteProduct(product.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No products found. Add your first product!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No orders yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <Card key={order.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {statusIcon(order.status)}
                      <Badge variant="outline" className="capitalize">{order.status}</Badge>
                    </div>
                    <span className="font-bold flex items-center"><IndianRupee className="h-3 w-3" />{Number(order.total_price).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1"><MapPin className="inline h-3 w-3 mr-1" />{order.shipping_address}</p>
                  <p className="text-xs text-muted-foreground">📞 {order.phone}</p>
                  {order.notes && <p className="text-xs text-muted-foreground mt-1">📝 {order.notes}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  {order.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                        <XCircle className="h-3 w-3 mr-1" /> Cancel
                      </Button>
                    </div>
                  )}
                  {order.status === "confirmed" && (
                    <Button size="sm" className="mt-3 w-full" onClick={() => updateOrderStatus(order.id, "shipped")}>
                      <Truck className="h-3 w-3 mr-1" /> Mark as Shipped
                    </Button>
                  )}
                  {order.status === "shipped" && (
                    <Button size="sm" className="mt-3 w-full" variant="outline" onClick={() => updateOrderStatus(order.id, "delivered")}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Mark as Delivered
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Product Name *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Hand-stitched Kurta" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="1200" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your product..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button className="flex-1 hero-gradient text-primary-foreground" onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingProduct ? "Save Changes" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
