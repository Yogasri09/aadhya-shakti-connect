import { motion } from "framer-motion";
import { Bot, GraduationCap, BadgeCheck, ShoppingBag, Users, Landmark } from "lucide-react";

const solutions = [
  { icon: Bot, title: "AI Financial Assistant", desc: "Get personalized business ideas, loan guidance, and scheme recommendations." },
  { icon: Landmark, title: "Government Training Access", desc: "Browse and apply for 95+ central and state government training programs." },
  { icon: BadgeCheck, title: "Verified Certifications", desc: "Verify your certificates instantly and build trust with employers." },
  { icon: ShoppingBag, title: "Women Marketplace", desc: "Sell your products directly to customers through our online marketplace." },
  { icon: Users, title: "Expo & Networking", desc: "Connect with mentors, attend events, and grow your professional network." },
  { icon: GraduationCap, title: "Skill Courses", desc: "Learn tailoring, beautician skills, business management, and more." },
];

export function SolutionSection() {
  return (
    <section id="features" className="section-padding-lg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl mb-4">One Platform, Everything You Need</h2>
          <p className="text-muted-foreground text-lg">
            Aadhya bridges the gap between awareness and action with smart, AI-powered tools.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-card rounded-xl p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-11 w-11 rounded-xl hero-gradient flex items-center justify-center mb-4 group-hover:scale-[1.03] transition-transform">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-sans font-semibold text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
