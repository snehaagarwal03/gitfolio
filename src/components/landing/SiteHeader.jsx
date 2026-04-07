import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40"
    >
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold font-mono tracking-tighter">
          gitfolio<span className="text-primary">.</span>
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        <a href="#faqs" className="hover:text-foreground transition-colors">FAQs</a>
      </nav>
      <div className="flex items-center gap-3">
        <Link to="/login">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Sign In</Button>
        </Link>
        <Link to="/login">
          <Button className="rounded-full flex items-center gap-2">
            Get Started
          </Button>
        </Link>
      </div>
    </motion.header>
  );
}
