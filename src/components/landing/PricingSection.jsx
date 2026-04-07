import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function PricingSection() {
  return (
    <section className="py-24 px-6 bg-surface-900 border-y border-border/50 relative">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-primary font-semibold tracking-wide uppercase text-sm mb-2"
        >
          Pricing
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
        >
          Simple pricing for developers
        </motion.h3>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6, delay: 0.2 }}
           className="mt-16 mx-auto max-w-lg bg-card border border-border shadow-2xl rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-bl-xl tracking-wider">
            Most Popular
          </div>
          <h4 className="text-2xl font-bold text-foreground mb-4">Pro Developer</h4>
          <div className="flex items-baseline justify-center gap-2 mb-8">
            <span className="text-5xl font-extrabold">$0</span>
            <span className="text-muted-foreground font-medium">/forever</span>
          </div>
          <ul className="space-y-4 mb-8 text-left">
            {[
              "Unlimited portfolio generations",
              "AI-powered project descriptions",
              "Dark & Light mode ready",
              "Multiple premium themes",
              "Customizable Resume & PDF export",
              "Shareable custom URL",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <FaCheck className="text-primary shrink-0" />
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
          <Link to="/login">
            <Button size="lg" className="w-full rounded-full h-12 text-lg">
              Start Building Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
