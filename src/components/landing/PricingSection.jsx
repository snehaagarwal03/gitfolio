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
        
        <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Free Tier */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.5, delay: 0 }}
             className="bg-card border border-border shadow-md rounded-3xl p-8 relative overflow-hidden flex flex-col"
          >
            <h4 className="text-xl font-bold text-foreground mb-2">Free</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">₹0</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-left text-sm flex-1">
              {[
                "1 portfolio generation/mo", 
                "Standard GitHub sync", 
                "Default theme access", 
                "Community support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheck className="text-primary mt-1 shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/login">
              <Button variant="outline" className="w-full rounded-full h-11">Get Started</Button>
            </Link>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="bg-card border-2 border-primary shadow-2xl rounded-3xl p-8 relative overflow-hidden flex flex-col scale-105 z-10"
          >
            <div className="absolute top-0 right-0 p-2 px-4 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-bl-xl tracking-wider">
              Most Popular
            </div>
            <h4 className="text-xl font-bold text-foreground mb-2 mt-2">Pro Developer</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">₹499</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-left text-sm flex-1">
              {[
                "Unlimited generations",
                "Advanced LLM project summaries",
                "All premium themes & modes",
                "Resume PDF export",
                "Shareable gitfolio.in slug",
                "Email support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheck className="text-primary mt-1 shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/login">
              <Button className="w-full rounded-full h-11">Start Free Trial</Button>
            </Link>
          </motion.div>

          {/* Plus Tier */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="bg-card border border-border shadow-md rounded-3xl p-8 relative overflow-hidden flex flex-col"
          >
            <h4 className="text-xl font-bold text-foreground mb-2">Plus</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">₹1,499</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 text-left text-sm flex-1">
              {[
                "Everything in Pro",
                "Multiple linked GitHub accounts",
                "Custom domain connection",
                "Custom AI model fine-tuning",
                "Visitor analytics dashboard",
                "24/7 Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaCheck className="text-primary mt-1 shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/login">
              <Button variant="outline" className="w-full rounded-full h-11">Get Plus</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
