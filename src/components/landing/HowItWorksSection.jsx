import { motion } from "framer-motion";
import { FaGithub, FaWandMagicSparkles, FaGlobe } from "react-icons/fa6";

const steps = [
  {
    icon: <FaGithub className="text-3xl" />,
    title: "1. Connect GitHub",
    description: "Enter your username or sign in with GitHub. We instantly fetch your repositories, stats, and contribution history.",
  },
  {
    icon: <FaWandMagicSparkles className="text-3xl" />,
    title: "2. AI Magic",
    description: "Our Gemini-powered AI analyzes your code, rewrites project descriptions, and generates a professional bio.",
  },
  {
    icon: <FaGlobe className="text-3xl" />,
    title: "3. Publish & Share",
    description: "Your modern, resizable, and themeable portfolio is live. Share your personal URL with the world and recruiters.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-primary font-semibold tracking-wide uppercase text-sm mb-2"
          >
            How it works
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            From zero to portfolio in seconds
          </motion.h3>
        </div>

        <div className="grid gap-12 md:grid-cols-3 relative">
          {/* Connector line for large screens */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 mx-auto bg-card border-4 border-background rounded-full shadow-xl flex items-center justify-center text-primary relative z-10 mb-6 group transition-transform hover:scale-110">
                {step.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
