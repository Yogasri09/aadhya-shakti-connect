import { motion } from "framer-motion";
import { Search, GraduationCap, BadgeCheck, Briefcase, CircleDollarSign, TrendingUp } from "lucide-react";

const steps = [
  { icon: Search, label: "Discover Skills", desc: "Find the right skill for your goals" },
  { icon: GraduationCap, label: "Learn & Train", desc: "Access government training programs" },
  { icon: BadgeCheck, label: "Get Certified", desc: "Earn verified certifications" },
  { icon: Briefcase, label: "Start Business", desc: "Launch your enterprise" },
  { icon: CircleDollarSign, label: "Financial Support", desc: "Access loans & subsidies" },
  { icon: TrendingUp, label: "Grow & Thrive", desc: "Scale with community support" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Your Journey with Aadhya</h2>
          <p className="text-muted-foreground text-lg">Six steps from discovery to financial independence.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative flex items-start gap-4"
            >
              <div className="flex-shrink-0 h-12 w-12 rounded-full hero-gradient flex items-center justify-center text-primary-foreground font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <h3 className="font-sans font-semibold mb-1">{s.label}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
