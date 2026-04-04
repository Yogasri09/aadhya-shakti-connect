import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, IndianRupee, Package, Star, TrendingUp, MapPin, Plus, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { getProductCategoryStats, getDemandByLocation, getSellerDemandTrend } from "@/data/demandEngine";
import { suggestBusinessIdeas } from "@/data/aiEngine";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)", "hsl(340,50%,50%)"];

interface Props {
  name: string;
}

export default function SellerDashboard({ name }: Props) {
  const categoryStats = getProductCategoryStats();
  const demandTrend = getSellerDemandTrend();
  const locationDemand = getDemandByLocation().slice(0, 6).map(d => ({
    state: d.state,
    demand: d.productDemand,
  }));
  const businessIdeas = suggestBusinessIdeas("Handicrafts", "Tamil Nadu", "Chennai");

  const widgets = [
    { icon: Package, title: "Total Products", value: "12", sub: "3 pending approval", color: "text-primary" },
    { icon: Eye, title: "Product Views", value: "2,450", sub: "+320 this week", color: "text-accent" },
    { icon: ShoppingBag, title: "Orders Received", value: "27", sub: "5 to ship", color: "text-warm" },
    { icon: IndianRupee, title: "Total Earnings", value: "₹48,500", sub: "This month", color: "text-success" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Hello, {name}!</h1>
          <p className="text-muted-foreground">Here's how your store is performing.</p>
        </div>
        <Link to="/dashboard/seller-products">
          <Button className="hero-gradient text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, i) => (
          <motion.div key={w.title} {...anim(i)}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${w.color}`}>
                    <w.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-sans">{w.value}</p>
                    <p className="text-xs text-muted-foreground">{w.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{w.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart → Product Categories */}
        <motion.div {...anim(4)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Product Categories</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryStats} cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryStats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Line Chart → Demand Trend */}
        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" /> Demand Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={demandTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(24,85%,48%)" strokeWidth={2} dot={{ r: 3 }} name="Views" />
                  <Line type="monotone" dataKey="orders" stroke="hsl(158,45%,42%)" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Location Demand */}
      <motion.div {...anim(6)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Product Demand by Location</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={locationDemand} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip />
                <Bar dataKey="demand" fill="hsl(35,60%,52%)" radius={[0, 4, 4, 0]} name="Demand Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Business Insights */}
      <motion.div {...anim(7)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Star className="h-5 w-5 text-warm" /> 🤖 AI Business Insights</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {businessIdeas.map(idea => (
                <div key={idea.title} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{idea.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{idea.confidence}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{idea.description}</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block">{idea.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
