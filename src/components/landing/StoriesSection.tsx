import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const stories = [
  { name: "Priya Sharma", location: "Jaipur, Rajasthan", quote: "Started my tailoring business with ₹5,000 and now I earn ₹25,000 monthly. Aadhya helped me find the right government scheme.", initials: "PS" },
  { name: "Meena Devi", location: "Varanasi, UP", quote: "I never knew I could get free beautician training from the government. Now I run my own salon and train other women.", initials: "MD" },
  { name: "Lakshmi Nair", location: "Kochi, Kerala", quote: "The AI assistant helped me understand which loan was right for my handicraft business. I got ₹2 lakh at just 4% interest.", initials: "LN" },
];

export function StoriesSection() {
  return (
    <section id="stories" className="section-padding-lg">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-3xl md:text-4xl mb-4">Real Stories, Real Impact</h2>
          <p className="text-muted-foreground text-lg">Women transforming their lives with the right guidance and tools.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border shadow-sm"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-sm leading-relaxed mb-6 text-foreground/90">"{s.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full hero-gradient flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {s.initials}
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
