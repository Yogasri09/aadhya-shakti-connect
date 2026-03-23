import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark } from "lucide-react";

const schemes = [
  { title: "Pradhan Mantri Mudra Yojana", desc: "Loans up to ₹10 lakh for micro enterprises without collateral.", tag: "Loan" },
  { title: "Stand-Up India", desc: "Bank loans between ₹10 lakh and ₹1 crore for SC/ST/women entrepreneurs.", tag: "Loan" },
  { title: "PMKVY – Skill India", desc: "Free skill training with certification in 300+ trades across India.", tag: "Training" },
  { title: "Mahila E-Haat", desc: "Online marketplace for women entrepreneurs to sell products directly.", tag: "Market" },
];

export function SchemesPreview() {
  return (
    <section id="schemes" className="section-padding bg-secondary/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Government Schemes for You</h2>
          <p className="text-muted-foreground text-lg">Access verified government programs — loans, training, and marketplace support.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto mb-10">
          {schemes.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="bg-card rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Landmark className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-semibold text-sm">{s.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">{s.tag}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link to="/dashboard/schemes">View All Schemes <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
