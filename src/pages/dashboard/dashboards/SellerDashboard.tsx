import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, IndianRupee, Package, Star, TrendingUp, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const widgets = [
  { icon: Package, title: "Active Listings", value: "12", sub: "3 pending approval", color: "text-primary" },
  { icon: IndianRupee, title: "Total Earnings", value: "₹48,500", sub: "This month", color: "text-accent" },
  { icon: ShoppingBag, title: "Orders Received", value: "27", sub: "5 to ship", color: "text-warm" },
  { icon: Star, title: "Avg Rating", value: "4.6", sub: "From 42 reviews", color: "text-success" },
];

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 18500 },
  { month: "Mar", sales: 15200 },
  { month: "Apr", sales: 22000 },
  { month: "May", sales: 19800 },
  { month: "Jun", sales: 48500 },
];

const topProducts = [
  { name: "Hand-stitched Kurta", orders: 12 },
  { name: "Embroidered Dupatta", orders: 9 },
  { name: "Pickles Combo Pack", orders: 8 },
  { name: "Handmade Bags", orders: 6 },
  { name: "Candles Set", orders: 4 },
];

interface Props {
  name: string;
}

export default function SellerDashboard({ name }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Hello, {name}!</h1>
        <p className="text-muted-foreground">Here's how your store is performing.</p>
      </div>

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

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim(4)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Sales Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Line type="monotone" dataKey="sales" stroke="hsl(24,85%,48%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-accent" /> Top Products</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="hsl(158,45%,42%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...anim(6)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><CalendarDays className="h-5 w-5 text-warm" /> Upcoming Expos</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: "Women Entrepreneur Expo", date: "Mar 28, 2026", loc: "Delhi" },
                { name: "Handcraft Fair", date: "Apr 12, 2026", loc: "Jaipur" },
              ].map(e => (
                <div key={e.name} className="p-3 rounded-lg border">
                  <p className="font-medium text-sm">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.loc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
