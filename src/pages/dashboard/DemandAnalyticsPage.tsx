import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, TrendingUp, GraduationCap, ShoppingBag, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts";
import { INDIAN_STATES } from "@/data/locationData";
import {
  getDemandByLocation, getTrendingSkills, getBusinessPredictions,
  getSkillDemandForState, getBusinessDemandForState, getMostSearchedCourses,
  getDemandTrendData,
} from "@/data/demandEngine";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)", "hsl(340,50%,50%)"];
const SKILL_COLORS: Record<string, string> = {
  tailoring: "hsl(24,85%,48%)",
  handicrafts: "hsl(158,45%,42%)",
  digital: "hsl(200,60%,50%)",
  beauty: "hsl(280,40%,55%)",
  food: "hsl(35,60%,52%)",
};

const AVAILABLE_STATES = [
  "Tamil Nadu", "Maharashtra", "Rajasthan", "Gujarat", "Kerala",
  "Karnataka", "Uttar Pradesh", "West Bengal", "Delhi", "Bihar",
  "Telangana", "Andhra Pradesh", "Madhya Pradesh", "Punjab", "Haryana", "Odisha",
];

export default function DemandAnalyticsPage() {
  const [selectedState, setSelectedState] = useState("Tamil Nadu");

  const locationDemand = getDemandByLocation();
  const trendingSkills = getTrendingSkills().slice(0, 8);
  const businessPredictions = getBusinessPredictions();
  const skillDemand = getSkillDemandForState(selectedState);
  const businessDemand = getBusinessDemandForState(selectedState);
  const mostSearched = getMostSearchedCourses();
  const trendData = getDemandTrendData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1">Demand Analytics</h1>
          <p className="text-muted-foreground">Location-based demand prediction and trend analysis.</p>
        </div>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-60">
            {INDIAN_STATES.filter(s => AVAILABLE_STATES.includes(s)).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State-specific insight banner */}
      <motion.div {...anim(0)}>
        <Card className="hero-gradient text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="font-serif text-lg">{selectedState} — Demand Summary</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-3">
              {(() => {
                const demand = getDemandByLocation(selectedState)[0];
                if (!demand) return null;
                return (
                  <>
                    <div className="bg-white/15 rounded-lg p-3">
                      <p className="text-sm opacity-80">Top Skill</p>
                      <p className="font-bold text-lg">{demand.topSkills[0]}</p>
                    </div>
                    <div className="bg-white/15 rounded-lg p-3">
                      <p className="text-sm opacity-80">Top Business</p>
                      <p className="font-bold text-lg">{demand.topBusinessTypes[0]}</p>
                    </div>
                    <div className="bg-white/15 rounded-lg p-3">
                      <p className="text-sm opacity-80">Top Course</p>
                      <p className="font-bold text-lg">{demand.trendingCourses[0]}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 1: State Skill & Business Demand */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim(1)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Skills Demand — {selectedState}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={skillDemand}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="skill" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" height={55} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} name="Demand Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(2)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" /> Business Demand — {selectedState}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={businessDemand} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <YAxis dataKey="businessType" type="category" tick={{ fontSize: 9 }} width={130} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(158,45%,42%)" radius={[0, 4, 4, 0]} name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Demand Trend Over Time */}
      <motion.div {...anim(3)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Demand Trends Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="tailoring" stroke={SKILL_COLORS.tailoring} strokeWidth={2} dot={{ r: 3 }} name="Tailoring" />
                <Line type="monotone" dataKey="handicrafts" stroke={SKILL_COLORS.handicrafts} strokeWidth={2} dot={{ r: 3 }} name="Handicrafts" />
                <Line type="monotone" dataKey="digital" stroke={SKILL_COLORS.digital} strokeWidth={2} dot={{ r: 3 }} name="Digital" />
                <Line type="monotone" dataKey="beauty" stroke={SKILL_COLORS.beauty} strokeWidth={2} dot={{ r: 3 }} name="Beauty" />
                <Line type="monotone" dataKey="food" stroke={SKILL_COLORS.food} strokeWidth={2} dot={{ r: 3 }} name="Food" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Row 3: Trending Skills + Most Searched Courses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim(4)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-warm" /> Trending Business Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={businessPredictions} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="score" nameKey="businessType">
                    {businessPredictions.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Score: ${value}`} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Most Searched Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mostSearched} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 8 }} width={150} />
                  <Tooltip />
                  <Bar dataKey="enrolled" fill="hsl(35,60%,52%)" radius={[0, 4, 4, 0]} name="Enrolled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Location Demand Cards */}
      <motion.div {...anim(6)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Location Demand Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {locationDemand.slice(0, 8).map(d => (
                <div
                  key={d.state}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedState === d.state ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedState(d.state)}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="font-medium text-sm">{d.state}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    🎯 {d.topSkills[0]}
                  </p>
                  <div className="flex gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">📚{d.courseDemand}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">🛒{d.productDemand}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-warm/10 text-warm">🧑‍🏫{d.mentorshipDemand}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
