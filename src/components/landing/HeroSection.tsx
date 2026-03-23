import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-illustration.png";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-warm/5 blur-3xl" />
      </div>

      <div className="container grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Women Empowerment
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6">
            Empower Your Future with Skills, Support &amp; Smart Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Discover government programs, build skills, start businesses, and grow with AI-powered guidance — all in one platform designed for women.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Explore Opportunities</a>
            </Button>
          </div>

          <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
            <div><span className="text-foreground font-semibold text-lg">12,400+</span><br />Women Trained</div>
            <div className="w-px h-8 bg-border" />
            <div><span className="text-foreground font-semibold text-lg">850+</span><br />Businesses Started</div>
            <div className="w-px h-8 bg-border" />
            <div><span className="text-foreground font-semibold text-lg">95+</span><br />Govt. Schemes</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center"
        >
          <img
            src={heroImg}
            alt="Women entrepreneurs collaborating, sewing, and selling products"
            className="w-full max-w-lg animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
}
