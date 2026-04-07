import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function CtaSection() {
  return (
    <section className="py-24 px-6 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground mb-6"
        >
          Ready to stand out?
        </motion.h2>
        <motion.p
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, delay: 0.1 }}
           className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
        >
          Join thousands of developers turning their code into beautiful portfolios instantly. No coding or design skills required.
        </motion.p>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
           className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link to="/login">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-transform">
              Get Started for Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
