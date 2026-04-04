import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Star, Clock, TrendingUp, MapPin, CalendarDays, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { MOCK_MENTOR_REQUESTS } from "@/data/mockDatabase";
import { getMentorExpertiseStats, getMenteeCategoryStats, getDemandByLocation } from "@/data/demandEngine";
import { useAuth } from "@/contexts/AuthContext";
import { useMentorStats } from "@/hooks/useDashboardStats";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)"];

interface Props { name: string; }

export default function MentorDashboard({ name }: Props) {
  const { user } = useAuth();
  const stats = useMentorStats(user?.id);

  const pendingRequests = MOCK_MENTOR_REQUESTS.filter(r => r.status === "pending");
  const expertiseStats = getMentorExpertiseStats();
  const menteeCategoryStats = getMenteeCategoryStats().slice(0, 6);
  const locationDemand = getDemandByLocation().slice(0, 6).map(d => ({ state: d.state, demand: d.mentorshipDemand }));

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const widgets = [
    { icon: Users, title: "Active Mentees", value: stats.totalMentees.toString(), sub: "Accepted requests", color: "text-primary" },
    { icon: MessageSquare, title: "Pending Requests", value: stats.pendingRequests.toString(), sub: "Awaiting review", color: "text-warm" },
    { icon: Star, title: "Sessions Completed", value: stats.completedSessions.toString(), sub: "Total sessions", color: "text-accent" },
    { icon: Clock, title: "Hours Mentored", value: stats.totalHours.toString(), sub: "Total hours", color: "text-success" },
  ];

  const mentees = [
    { name: "Anjali Verma", skill: "Tailoring", progress: 72 },
    { name: "Meena Kumari", skill: "Business Basics", progress: 55 },
    { name: "Sita Devi", skill: "Digital Marketing", progress: 38 },
    { name: "Rekha Sharma", skill: "Beauty Care", progress: 85 },
  ];

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

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim(4)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Star className="h-5 w-5 text-primary" /> Expertise Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={expertiseStats} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expertiseStats.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Users className="h-5 w-5 text-accent" /> Mentee Interests</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={menteeCategoryStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim(6)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Mentorship Demand by Location</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={locationDemand} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip />
                  <Bar dataKey="demand" fill="hsl(158,45%,42%)" radius={[0, 4, 4, 0]} name="Demand Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(7)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-accent" /> Mentee Progress</CardTitle></CardHeader>
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

      <motion.div {...anim(8)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-sans flex items-center gap-2"><MessageSquare className="h-5 w-5 text-warm" /> Pending Mentee Requests</CardTitle>
            <Link to="/dashboard/mentor-requests">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {pendingRequests.slice(0, 4).map(req => (
                <div key={req.id} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{req.userName}</span>
                    <Badge variant="outline" className="text-[10px]">{req.userInterest}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{req.message}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {req.userCity}, {req.userState}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...anim(9)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><CalendarDays className="h-5 w-5 text-warm" /> Suggested Courses for Mentees</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { title: "Tailoring & Fashion Design", provider: "KVIC", duration: "4 months" },
                { title: "E-commerce for Women", provider: "Flipkart Samarth", duration: "4 weeks" },
                { title: "Digital Marketing", provider: "Google", duration: "6 weeks" },
              ].map(c => (
                <div key={c.title} className="p-3 rounded-lg border">
                  <p className="font-medium text-sm">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.provider} · {c.duration}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
