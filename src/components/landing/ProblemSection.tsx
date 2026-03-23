import { motion } from "framer-motion";
import { AlertTriangle, Eye, Briefcase, ShieldAlert, CircleDollarSign } from "lucide-react";

const problems = [
  { icon: Eye, title: "Lack of Awareness", desc: "Most women don't know about government schemes designed for them." },
  { icon: AlertTriangle, title: "Limited Training Access", desc: "Quality skill training remains inaccessible in many regions." },
  { icon: Briefcase, title: "Business Barriers", desc: "Starting and sustaining businesses without guidance is challenging." },
  { icon: ShieldAlert, title: "Trust Deficit", desc: "Hard to find verified mentors and legitimate opportunities." },
  { icon: CircleDollarSign, title: "Financial Confusion", desc: "Understanding loans, subsidies, and investment options is overwhelming." },
];

export function ProblemSection() {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-4">The Challenges Women Face</h2>
          <p className="text-muted-foreground text-lg">
            Millions of women have the talent but lack the right tools, knowledge, and connections.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="font-sans font-semibold text-base mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
