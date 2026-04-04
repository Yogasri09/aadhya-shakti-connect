import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Search, Edit, Trash2, Package, Eye, ShoppingBag, IndianRupee, MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PRODUCTS, type MockProduct } from "@/data/mockDatabase";
import { getSkillDemandForState } from "@/data/demandEngine";

const CATEGORIES = ["Fashion & Textiles", "Handicrafts", "Accessories", "Food & Beverages", "Home Decor", "Beauty & Wellness", "Digital Products"];

export default function SellerProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>([...MOCK_PRODUCTS.slice(0, 12)]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MockProduct | null>(null);
  const [form, setForm] = useState({
    name: "", category: "", price: "", description: "",
  });

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

  const openEditDialog = (product: MockProduct) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.category || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p =>
        p.id === editingProduct.id
          ? { ...p, name: form.name, category: form.category, price: parseFloat(form.price), description: form.description }
          : p
      ));
      toast.success("Product updated successfully!");
    } else {
      const newProduct: MockProduct = {
        id: `p${Date.now()}`,
        sellerId: "s1",
        sellerName: "You",
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        description: form.description,
        state: "Tamil Nadu",
        city: "Chennai",
        views: 0,
        orders: 0,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts(prev => [newProduct, ...prev]);
      toast.success("Product added successfully! It will be reviewed shortly.");
    }
    setDialogOpen(false);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  const totalViews = products.reduce((s, p) => s + p.views, 0);
  const totalOrders = products.reduce((s, p) => s + p.orders, 0);

  // Demand insights for the sidebar
  const demandInsights = getSkillDemandForState("Tamil Nadu").slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">My Products</h1>
          <p className="text-muted-foreground">Manage your product listings and view demand insights.</p>
        </div>
        <Button onClick={openAddDialog} className="hero-gradient text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <div><p className="text-xl font-bold">{products.length}</p><p className="text-xs text-muted-foreground">Listed</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Eye className="h-8 w-8 text-accent" />
            <div><p className="text-xl font-bold">{totalViews.toLocaleString()}</p><p className="text-xs text-muted-foreground">Views</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <ShoppingBag className="h-8 w-8 text-warm" />
            <div><p className="text-xl font-bold">{totalOrders}</p><p className="text-xs text-muted-foreground">Orders</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <IndianRupee className="h-8 w-8 text-success" />
            <div><p className="text-xl font-bold">₹{products.reduce((s, p) => s + p.price * p.orders, 0).toLocaleString()}</p><p className="text-xs text-muted-foreground">Revenue</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(product => (
              <Card key={product.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.status === "active" ? "default" : "outline"} className="text-[10px]">
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {product.views}</span>
                      <span className="flex items-center gap-0.5"><ShoppingBag className="h-3 w-3" /> {product.orders}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditDialog(product)}>
                      <Edit className="h-3 w-3 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteProduct(product.id)}>
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
        </div>

        {/* Demand Insights Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base font-sans flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Demand Insights</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {demandInsights.map(d => (
                <div key={d.skill} className="flex items-center justify-between p-2 rounded-lg border">
                  <span className="text-sm">{d.skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${d.score}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{d.score}%</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                💡 Consider listing products in high-demand categories to increase sales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-sans">📊 Quick Stats</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Price</span>
                <span className="font-medium">₹{Math.round(products.reduce((s, p) => s + p.price, 0) / products.length).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Top Category</span>
                <span className="font-medium">Fashion & Textiles</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-medium">{totalViews > 0 ? ((totalOrders / totalViews) * 100).toFixed(1) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
              <Button className="flex-1" onClick={handleSave}>{editingProduct ? "Save Changes" : "Add Product"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
