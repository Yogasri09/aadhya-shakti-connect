import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Landmark, ShoppingBag, TrendingUp, Bot, CalendarDays, Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { RecommendedForYou } from "@/components/dashboard/RecommendedForYou";

const anim = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" } as const,
  animate: { opacity: 1, y: 0, filter: "blur(0px)" } as const,
  transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
});

const PIE_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)", "hsl(200,60%,50%)", "hsl(280,40%,55%)", "hsl(340,50%,50%)", "hsl(120,40%,45%)", "hsl(60,50%,45%)"];

const GOAL_COLORS = ["hsl(24,85%,48%)", "hsl(158,45%,42%)", "hsl(35,60%,52%)"];

const weeklyData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3.5 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 1.5 },
];

const skillProgressData = [
  { skill: "Beginner", count: 30 },
  { skill: "Intermediate", count: 50 },
  { skill: "Advanced", count: 20 },
];

interface Props {
  name: string;
}

export default function UserDashboard({ name }: Props) {
  const { profile, questionnaire } = useAuth();

  // Build interest data from questionnaire
  const interestData = questionnaire?.interests && questionnaire.interests.length > 0
    ? questionnaire.interests.map((interest, i) => ({
        name: interest.split(" ")[0], // Shorten labels
        value: Math.max(15, 40 - i * 8),
      }))
    : [
        { name: "Tailoring", value: 30 },
        { name: "Beauty", value: 25 },
        { name: "Food", value: 20 },
        { name: "Digital", value: 15 },
        { name: "Other", value: 10 },
      ];

  // Build goal data from questionnaire
  const goalData = questionnaire?.primaryGoal
    ? [
        { name: questionnaire.primaryGoal, value: 50 },
        { name: questionnaire.motivation || "Growth", value: 30 },
        { name: questionnaire.learningMode || "Online", value: 20 },
      ]
    : [
        { name: "Business", value: 40 },
        { name: "Skill Dev", value: 35 },
        { name: "Employment", value: 25 },
      ];

  // Build skill level data from questionnaire
  const userSkillLevel = questionnaire?.skillLevel || "Beginner";
  const adjustedSkillData = skillProgressData.map(d => ({
    ...d,
    count: d.skill === userSkillLevel ? d.count + 20 : d.count,
  }));

  // Dynamic widgets
  const widgets = [
    { icon: GraduationCap, title: "Courses Enrolled", value: "3", sub: "1 in progress", color: "text-primary" },
    { icon: Landmark, title: "Schemes Applied", value: "2", sub: "1 approved", color: "text-accent" },
    { icon: ShoppingBag, title: "Products Listed", value: "5", sub: "₹12,400 earned", color: "text-warm" },
    { icon: TrendingUp, title: "Skill Progress", value: userSkillLevel === "Advanced" ? "85%" : userSkillLevel === "Intermediate" ? "55%" : "25%", sub: questionnaire?.interests?.[0]?.split(" ")[0] || "Tailoring", color: "text-success" },
  ];

  // Dynamic recommendations based on questionnaire
  const recommended = getRecommendations(questionnaire, profile?.state);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Welcome back, {name}!</h1>
        <p className="text-muted-foreground">
          Here's your personalized progress and recommendations.
          {profile?.state && <span className="inline-flex items-center gap-1 ml-2 text-primary"><MapPin className="h-3 w-3" />{profile.city ? `${profile.city}, ${profile.state}` : profile.state}</span>}
        </p>
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
        {/* Pie Chart → Interests */}
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

        {/* Donut Chart → Goals */}
        <motion.div {...anim(5)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans">Goals Distribution</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={goalData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {goalData.map((_, i) => <Cell key={i} fill={GOAL_COLORS[i % GOAL_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart → Skill Level */}
        <motion.div {...anim(6)}>
          <Card className="h-full">
            <CardHeader><CardTitle className="text-lg font-sans">Skill Level</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={adjustedSkillData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                  <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(24,85%,48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Line Chart → Progress */}
      <motion.div {...anim(7)}>
        <Card>
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

      {/* Skill Progress Bars */}
      <motion.div {...anim(8)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans">Skill Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {getSkillProgress(questionnaire).map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1"><span>{s.name}</span><span className="text-muted-foreground">{s.pct}%</span></div>
                <Progress value={s.pct} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendations - real, personalized */}
      <motion.div {...anim(9)}>
        <RecommendedForYou />
      </motion.div>

      {/* Upcoming Events */}
      <motion.div {...anim(10)}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-sans flex items-center gap-2"><CalendarDays className="h-5 w-5 text-warm" /> Upcoming Events</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: "Women Entrepreneur Expo", date: "Apr 15, 2026", loc: "Delhi" },
                { name: "Digital Skills Workshop", date: "Apr 22, 2026", loc: "Online" },
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

// Helper: get skill progress from questionnaire
function getSkillProgress(q: ReturnType<typeof useAuth>["questionnaire"]) {
  if (!q?.interests || q.interests.length === 0) {
    return [
      { name: "Tailoring", pct: 68 },
      { name: "Business Basics", pct: 42 },
      { name: "Digital Marketing", pct: 15 },
    ];
  }
  const base = q.skillLevel === "Advanced" ? 70 : q.skillLevel === "Intermediate" ? 40 : 15;
  return q.interests.slice(0, 4).map((interest, i) => ({
    name: interest.split("&")[0].trim(),
    pct: Math.min(95, base + Math.floor(Math.random() * 20) - i * 8),
  }));
}

// Helper: get recommendations
function getRecommendations(q: ReturnType<typeof useAuth>["questionnaire"], state?: string | null) {
  const defaults = {
    courses: [
      { title: "Beautician Training", desc: "Free 3-month certified course by NSDC" },
      { title: "Digital Marketing", desc: "Google-certified, free online course" },
    ],
    mentors: [
      { title: "Dr. Anita Gupta", desc: "Business Strategy · 15 years" },
      { title: "Pooja Nair", desc: "Digital Marketing · 8 years" },
    ],
    schemes: [
      { title: "MUDRA Loan (PMMY)", desc: "Up to ₹10 lakh for your business" },
      { title: "PMKVY Training", desc: "Free skill training + ₹8,000 reward" },
    ],
  };

  if (!q) return defaults;

  const courses: { title: string; desc: string }[] = [];
  const mentors: { title: string; desc: string }[] = [];
  const schemes: { title: string; desc: string }[] = [];

  // Course recommendations based on interests
  if (q.interests?.some(i => i.includes("Beauty"))) courses.push({ title: "Beautician & Cosmetology", desc: "Free 3-month NSDC course" });
  if (q.interests?.some(i => i.includes("Food"))) courses.push({ title: "Food Processing", desc: "3-month KVIC certified training" });
  if (q.interests?.some(i => i.includes("Technology"))) courses.push({ title: "Digital Marketing", desc: "Free Google certification" });
  if (q.interests?.some(i => i.includes("Arts"))) courses.push({ title: "Handicraft Training", desc: "4-month artisan program" });
  if (q.interests?.some(i => i.includes("Business"))) courses.push({ title: "Entrepreneurship", desc: "3-month NIESBUD program" });
  if (q.interests?.some(i => i.includes("Education"))) courses.push({ title: "Teacher Training", desc: "D.El.Ed diploma program" });
  if (courses.length === 0) courses.push(...defaults.courses);

  // Mentor recommendations
  if (q.mentorshipArea === "Business Strategy") mentors.push({ title: "Dr. Anita Gupta", desc: "Business Strategy · 15 years" });
  if (q.mentorshipArea === "Technical Skills") mentors.push({ title: "Pooja Nair", desc: "Digital Marketing · 8 years" });
  if (q.mentorshipArea === "Career Guidance") mentors.push({ title: "Rekha Bhatia", desc: "Fashion & Career · 12 years" });
  if (q.mentorshipArea === "Financial Planning") mentors.push({ title: "Shanti Mishra", desc: "Business Finance · 10 years" });
  if (mentors.length === 0) mentors.push(...defaults.mentors);

  // Scheme recommendations based on budget and interests
  if (q.budget?.includes("Low")) schemes.push({ title: "PMMY Shishu Loan", desc: "Up to ₹50,000, no collateral" });
  if (q.budget?.includes("Medium")) schemes.push({ title: "PMMY Kishore Loan", desc: "₹50,000 - ₹5 lakh" });
  if (q.budget?.includes("High")) schemes.push({ title: "Stand-Up India", desc: "₹10 lakh to ₹1 crore" });
  if (q.govSchemeInterest === "Yes") schemes.push({ title: "PMKVY Training", desc: "Free skill training + ₹8,000" });
  if (state === "Tamil Nadu") schemes.push({ title: "TN Magalir Thittam", desc: "Women empowerment scheme" });
  if (schemes.length === 0) schemes.push(...defaults.schemes);

  return {
    courses: courses.slice(0, 2),
    mentors: mentors.slice(0, 2),
    schemes: schemes.slice(0, 2),
  };
}
