import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, GraduationCap, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const widgets = [
  { icon: Users, title: "Total Users", value: "1,245", sub: "+48 this week", color: "text-primary" },
  { icon: GraduationCap, title: "Active Courses", value: "18", sub: "3 pending review", color: "text-accent" },
  { icon: ShoppingBag, title: "Marketplace Items", value: "342", sub: "12 flagged", color: "text-warm" },
  { icon: Shield, title: "Mentors Active", value: "24", sub: "6 applications", color: "text-success" },
];

const userGrowth = [
  { month: "Jan", users: 820 },
  { month: "Feb", users: 910 },
  { month: "Mar", users: 985 },
  { month: "Apr", users: 1050 },
  { month: "May", users: 1150 },
  { month: "Jun", users: 1245 },
];

const roleDistribution = [
  { name: "Users", value: 1100 },
  { name: "Sellers", value: 95 },
  { name: "Mentors", value: 24 },
  { name: "Admins", value: 4 },
];
const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(0,72%,51%)"];

const recentFlags = [
  { type: "Product", item: "Unapproved supplement", by: "Auto-flag", time: "2h ago" },
  { type: "User", item: "Spam account reported", by: "Community", time: "5h ago" },
  { type: "Review", item: "Abusive language detected", by: "AI Filter", time: "1d ago" },
];

interface Props {
  name: string;
}

export default function AdminDashboard({ name }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {name}. Here's the platform overview.</p>
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
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> User Growth</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="users" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Role Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                    {roleDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...anim(6)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Recent Flags</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFlags.map(f => (
                <div key={f.item} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{f.item}</p>
                    <p className="text-xs text-muted-foreground">{f.type} · Flagged by {f.by}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{f.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
