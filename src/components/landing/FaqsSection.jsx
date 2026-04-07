import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const faqs = [
  {
    question: "How does GitFolio generate my portfolio?",
    answer: "GitFolio connects directly to your GitHub account across our secure integration. We fetch all relevant data, then pass repository descriptions through Google's powerful Gemini AI to write professional project summaries and build your 'About me' section instantly.",
  },
  {
    question: "Can I use GitFolio if I don't have a GitHub account?",
    answer: "Currently, GitFolio is optimized exclusively for developers whose public activity is primarily hosted on GitHub to automate away manual data-entry logic.",
  },
  {
    question: "Can I customize the generated portfolio?",
    answer: "Absolutely. Once the AI lays the foundational wireframe from your GitHub data, you can further adjust your portfolio theme globally or on specific section instances.",
  },
  {
    question: "Do you store any of my code or private repositories?",
    answer: "No. GitFolio only requests read-only access to your public information and metadata (like stars, forks, and repo descriptions). We never see your actual code.",
  },
  {
    question: "Is there a limit to how many times I can regenerate my portfolio?",
    answer: "As long as you're a registered user, you can sync and regenerate your portfolio as often as you want! Whenever you get a new star or merge a new major project, simply hit 'Regenerate'.",
  },
];

export default function FaqsSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold tracking-wide uppercase text-sm mb-2"
          >
            F.A.Q.
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Frequently Asked Questions
          </motion.h3>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 bg-card px-6 py-2 rounded-xl data-[state=open]:border-primary transition-colors">
                <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
