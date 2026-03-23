import { motion } from "framer-motion";
import { Trophy, Star, Award, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const badges = [
  { name: "Skill Starter", desc: "Completed your first course", icon: Star, earned: true },
  { name: "Business Builder", desc: "Listed your first product", icon: Target, earned: true },
  { name: "Certified Professional", desc: "Got 3 verified certificates", icon: Award, earned: false, progress: 66 },
  { name: "Community Champion", desc: "Helped 10 women in forum", icon: Trophy, earned: false, progress: 40 },
];

export default function AchievementsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl mb-1">Achievements</h1>
        <p className="text-muted-foreground">Track your badges and milestones.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {badges.map((b, i) => (
          <motion.div key={b.name}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card className={b.earned ? "border-primary/20" : ""}>
              <CardContent className="p-5">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${b.earned ? "hero-gradient" : "bg-muted"}`}>
                  <b.icon className={`h-6 w-6 ${b.earned ? "text-primary-foreground" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-sans font-semibold text-sm mb-1">{b.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{b.desc}</p>
                {b.earned ? (
                  <span className="text-xs font-semibold text-primary">✓ Earned</span>
                ) : (
                  <div>
                    <Progress value={b.progress} className="h-1.5 mb-1" />
                    <span className="text-xs text-muted-foreground">{b.progress}% complete</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
