import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-24 px-6 text-center bg-background text-foreground overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-secondary/20 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 font-mono text-xl sm:text-2xl font-bold tracking-tighter text-muted-foreground mb-6"
      >
        gitfolio
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 max-w-4xl text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
      >
        Turn your GitHub into a stunning portfolio. Powered by AI, zero coding required.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-30 w-full max-w-md mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/login">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-primary/25 transition-all">
            Get Started Free
          </Button>
        </Link>
        <a href="#features">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold rounded-full shadow-lg">
            See Features
          </Button>
        </a>
      </motion.div>
    </section>
  );
}
