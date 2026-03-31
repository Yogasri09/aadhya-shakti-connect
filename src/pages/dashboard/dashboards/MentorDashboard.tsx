import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Star, Clock, CalendarDays, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const widgets = [
  { icon: Users, title: "Active Mentees", value: "8", sub: "2 new this week", color: "text-primary" },
  { icon: MessageSquare, title: "Sessions Completed", value: "34", sub: "This month", color: "text-accent" },
  { icon: Star, title: "Mentor Rating", value: "4.8", sub: "From 28 reviews", color: "text-warm" },
  { icon: Clock, title: "Hours Mentored", value: "62", sub: "This quarter", color: "text-success" },
];

const sessionsData = [
  { week: "Week 1", sessions: 6 },
  { week: "Week 2", sessions: 9 },
  { week: "Week 3", sessions: 7 },
  { week: "Week 4", sessions: 12 },
];

const mentees = [
  { name: "Anjali Verma", skill: "Tailoring", progress: 72 },
  { name: "Meena Kumari", skill: "Business Basics", progress: 55 },
  { name: "Sita Devi", skill: "Digital Marketing", progress: 38 },
  { name: "Rekha Sharma", skill: "Beauty Care", progress: 85 },
];

interface Props {
  name: string;
}

export default function MentorDashboard({ name }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Welcome, Mentor {name}!</h1>
        <p className="text-muted-foreground">Here's an overview of your mentorship activity.</p>
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
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Sessions This Month</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sessionsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Mentee Progress</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {mentees.map(m => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{m.name}</span>
                    <span className="text-muted-foreground text-xs">{m.skill} · {m.progress}%</span>
                  </div>
                  <Progress value={m.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...anim(6)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><CalendarDays className="h-5 w-5 text-warm" /> Upcoming Sessions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { mentee: "Anjali Verma", topic: "Advanced Stitching", date: "Apr 1, 2026", time: "10:00 AM" },
                { mentee: "Meena Kumari", topic: "Business Plan Review", date: "Apr 2, 2026", time: "2:00 PM" },
              ].map(s => (
                <div key={s.mentee} className="p-3 rounded-lg border">
                  <p className="font-medium text-sm">{s.mentee}</p>
                  <p className="text-xs text-muted-foreground">{s.topic}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.date} · {s.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
