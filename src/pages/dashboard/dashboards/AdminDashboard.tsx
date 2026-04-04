import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, ShoppingBag, GraduationCap, Shield, TrendingUp, MapPin,
  Package, Landmark, UserCheck, BookOpen, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { GROWTH_DATA } from "@/data/mockDatabase";
import {
  getDemandByLocation, getLocationHeatmapData, getTrendingSkills,
  getSkillDemandForState, getMostSearchedCourses,
} from "@/data/demandEngine";
import { INDIAN_STATES } from "@/data/locationData";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)", "hsl(0,72%,51%)"];
const BAR_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)"];

interface Props { name: string; }

export default function AdminDashboard({ name }: Props) {
  const stats = useDashboardStats();
  const [selectedState, setSelectedState] = useState("Tamil Nadu");

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const widgets = [
    { icon: Users, title: "Total Users", value: stats.totalUsers.toLocaleString(), sub: "All registered users", color: "text-primary" },
    { icon: ShoppingBag, title: "Total Sellers", value: stats.totalSellers.toLocaleString(), sub: "Active sellers", color: "text-warm" },
    { icon: UserCheck, title: "Total Mentors", value: stats.totalMentors.toLocaleString(), sub: "Verified mentors", color: "text-accent" },
    { icon: Package, title: "Total Products", value: stats.totalProducts.toLocaleString(), sub: "Listed products", color: "text-success" },
    { icon: BookOpen, title: "Total Courses", value: stats.totalCourses.toLocaleString(), sub: "Available courses", color: "text-primary" },
    { icon: Landmark, title: "Total Schemes", value: stats.totalSchemes.toLocaleString(), sub: "Active schemes", color: "text-warm" },
  ];

  const roleData = [
    { name: "Users", count: stats.totalUsers - stats.totalSellers - stats.totalMentors - stats.totalAdmins },
    { name: "Sellers", count: stats.totalSellers },
    { name: "Mentors", count: stats.totalMentors },
  ];

  const platformDistribution = [
    { name: "Courses", value: stats.totalCourses || 1 },
    { name: "Products", value: stats.totalProducts || 1 },
    { name: "Schemes", value: stats.totalSchemes || 1 },
    { name: "Mentors", value: stats.totalMentors || 1 },
  ];

  const heatmap = getLocationHeatmapData().slice(0, 10);
  const stateDemand = getSkillDemandForState(selectedState);
  const trendingSkills = getTrendingSkills().slice(0, 6);
  const mostSearched = getMostSearchedCourses();
  const locationDemand = getDemandByLocation().slice(0, 10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {name}. Here's the platform overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {widgets.map((w, i) => (
          <motion.div key={w.title} {...anim(i)}>
            <Card className="h-full">
              <CardContent className="p-4">
                <div className={`h-9 w-9 rounded-lg bg-muted flex items-center justify-center ${w.color} mb-2`}>
                  <w.icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold font-sans">{w.value}</p>
                <p className="text-xs text-muted-foreground">{w.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{w.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="location">Location Analytics</TabsTrigger>
          <TabsTrigger value="growth">Growth & Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div {...anim(6)}>
              <Card className="h-full">
                <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Users by Role</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={roleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {roleData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...anim(7)}>
              <Card className="h-full">
                <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><Shield className="h-5 w-5 text-accent" /> Platform Distribution</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={platformDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                        {platformDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div {...anim(8)}>
            <Card>
              <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Growth Over Time</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={GROWTH_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="users" stroke="hsl(24,85%,48%)" strokeWidth={2} dot={{ r: 3 }} name="Users" />
                    <Line type="monotone" dataKey="sellers" stroke="hsl(158,45%,42%)" strokeWidth={2} dot={{ r: 3 }} name="Sellers" />
                    <Line type="monotone" dataKey="mentors" stroke="hsl(35,60%,52%)" strokeWidth={2} dot={{ r: 3 }} name="Mentors" />
                    <Line type="monotone" dataKey="products" stroke="hsl(200,60%,50%)" strokeWidth={2} dot={{ r: 3 }} name="Products" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <motion.div {...anim(0)}>
            <Card>
              <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Location-Based Demand</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={heatmap} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="state" type="category" tick={{ fontSize: 10 }} width={120} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="skillDemand" fill="hsl(24,85%,48%)" radius={[0, 4, 4, 0]} name="Skill Demand" />
                    <Bar dataKey="businessDemand" fill="hsl(158,45%,42%)" radius={[0, 4, 4, 0]} name="Business Demand" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div {...anim(1)}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-sans">Skill Demand by State</CardTitle>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDIAN_STATES.filter(s => ["Tamil Nadu","Maharashtra","Rajasthan","Gujarat","Kerala","Karnataka","Uttar Pradesh","West Bengal","Delhi","Bihar","Telangana","Andhra Pradesh","Madhya Pradesh","Punjab","Haryana","Odisha"].includes(s)).map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stateDemand}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                      <XAxis dataKey="skill" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...anim(2)}>
              <Card className="h-full">
                <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><MapPin className="h-5 w-5 text-accent" /> Demand Insights</CardTitle></CardHeader>
                <CardContent className="space-y-3 max-h-[320px] overflow-y-auto">
                  {locationDemand.slice(0, 6).map(d => (
                    <div key={d.state} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{d.state}</span>
                        <div className="flex gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">Course: {d.courseDemand}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">Product: {d.productDemand}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Top skills: {d.topSkills.join(", ")}</p>
                      <p className="text-xs text-muted-foreground">Trending: {d.topBusinessTypes.slice(0, 2).join(", ")}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div {...anim(0)}>
              <Card className="h-full">
                <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Trending Skills</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={trendingSkills}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                      <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {trendingSkills.map((s, i) => (
                          <Cell key={i} fill={s.trend === "rising" ? "hsl(158,45%,42%)" : s.trend === "stable" ? "hsl(35,60%,52%)" : "hsl(0,72%,51%)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(158,45%,42%)]" /> Rising</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(35,60%,52%)]" /> Stable</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[hsl(0,72%,51%)]" /> Declining</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...anim(1)}>
              <Card className="h-full">
                <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><GraduationCap className="h-5 w-5 text-warm" /> Most Searched Courses</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={mostSearched} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={140} />
                      <Tooltip />
                      <Bar dataKey="enrolled" fill="hsl(35,60%,52%)" radius={[0, 4, 4, 0]} name="Enrolled" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
