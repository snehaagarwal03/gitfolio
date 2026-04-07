import { motion } from "framer-motion";
import { FaRocket, FaRobot, FaFilePdf, FaPalette, FaPuzzlePiece, FaLink } from "react-icons/fa";

const features = [
  {
    icon: <FaRocket />,
    title: "Instant Portfolio",
    description: "Connect GitHub and get a live portfolio website instantly with your projects, skills, and stats.",
  },
  {
    icon: <FaRobot />,
    title: "AI-Enhanced",
    description: "Gemini AI polishes your project descriptions, extracts skills, and generates professional summaries.",
  },
  {
    icon: <FaFilePdf />,
    title: "Resume Builder",
    description: "Generate a professional resume from your data. Customize fonts, colors, and export to PDF.",
  },
  {
    icon: <FaPalette />,
    title: "Themes & Modes",
    description: "Switch between dark and light modes. Choose from multiple stunning themes for your portfolio.",
  },
  {
    icon: <FaPuzzlePiece />,
    title: "Custom Sections",
    description: "Add education, achievements, and other custom sections that aren't on GitHub.",
  },
  {
    icon: <FaLink />,
    title: "Shareable URL",
    description: "Get a clean, public URL (gitfolio.in/username) that you can share with recruiters instantly.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-surface-900 border-t border-border/50">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wide uppercase text-sm mb-2"
          >
            Features
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Everything you need for your presence
          </motion.h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl mb-4">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
