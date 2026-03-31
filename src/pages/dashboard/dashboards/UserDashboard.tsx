import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Landmark, ShoppingBag, TrendingUp, Bot, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const widgets = [
  { icon: GraduationCap, title: "Courses Enrolled", value: "3", sub: "1 in progress", color: "text-primary" },
  { icon: Landmark, title: "Schemes Applied", value: "2", sub: "1 approved", color: "text-accent" },
  { icon: ShoppingBag, title: "Products Listed", value: "5", sub: "₹12,400 earned", color: "text-warm" },
  { icon: TrendingUp, title: "Skill Progress", value: "68%", sub: "Tailoring", color: "text-success" },
];

const interestData = [
  { name: "Tailoring", value: 30 },
  { name: "Beauty", value: 25 },
  { name: "Food", value: 20 },
  { name: "Digital", value: 15 },
  { name: "Other", value: 10 },
];
const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)"];

const weeklyData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3.5 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 1.5 },
];

const recommended = [
  { title: "Beautician Training", desc: "Free 3-month certified course by NSDC", link: "/dashboard/courses" },
  { title: "MUDRA Loan", desc: "Get up to ₹10 lakh for your business", link: "/dashboard/schemes" },
  { title: "Women Expo 2026", desc: "Showcase your products – March 28, Delhi", link: "/dashboard/events" },
];

interface Props {
  name: string;
}

export default function UserDashboard({ name }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">Here's your progress and recommendations.</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim(4)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans">Your Interests</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={interestData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} paddingAngle={3} dataKey="value">
                    {interestData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans">Weekly Activity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="hsl(24,85%,48%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(6)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans">Skill Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[{ name: "Tailoring", pct: 68 }, { name: "Business Basics", pct: 42 }, { name: "Digital Marketing", pct: 15 }].map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm mb-1"><span>{s.name}</span><span className="text-muted-foreground">{s.pct}%</span></div>
                  <Progress value={s.pct} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...anim(7)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recommended.map(r => (
              <Link key={r.title} to={r.link} className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <p className="font-medium text-sm">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...anim(8)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><CalendarDays className="h-5 w-5 text-warm" /> Upcoming Events</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: "Women Entrepreneur Expo", date: "Mar 28, 2026", loc: "Delhi" },
                { name: "Digital Skills Workshop", date: "Apr 5, 2026", loc: "Online" },
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
