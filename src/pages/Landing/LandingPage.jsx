import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiZap,
  FiLayout,
  FiFileText,
  FiLayers,
  FiEdit3,
  FiDownload,
  FiCheckCircle,
  FiChevronRight,
  FiChevronDown,
  FiStar,
  FiArrowRight,
} from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Do I need to know how to code?",
      answer:
        "Not at all! GitFolio is designed for developers of all skill levels. Simply connect your GitHub account, and our AI handles everything from analyzing your code to generating compelling portfolio content. You can customize the output using our intuitive visual editor without writing a single line of code.",
    },
    {
      question: "Can I edit the generated content?",
      answer:
        "Absolutely! You have full control over every aspect of your portfolio and resume. Edit project descriptions, add custom sections for experience and education, tweak the layout, and fine-tune the AI-generated content to perfectly match your personal brand and career goals.",
    },
    {
      question: "Is the resume ATS friendly?",
      answer:
        "Yes, all our resume templates are specifically designed to be ATS (Applicant Tracking System) compatible. We use clean, parseable formatting with proper heading structures and standard fonts. The PDF export maintains this compatibility while still looking professional and modern.",
    },
    {
      question: "Can I use a custom domain?",
      answer:
        "Custom domain support is available on our Pro plan. You can connect your own domain (like yourname.dev) to your GitFolio portfolio with simple DNS configuration. We provide step-by-step instructions to make the process seamless.",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Connect GitHub",
      description:
        "Sign in with your GitHub account and securely authorize GitFolio to access your public repositories, profile information, and contribution stats.",
      icon: FiGithub,
    },
    {
      step: 2,
      title: "AI Generation",
      description:
        "Our advanced AI analyzes your code, commits, and project structure to craft compelling descriptions, highlight your skills, and generate professional content.",
      icon: FiZap,
    },
    {
      step: 3,
      title: "Customize & Export",
      description:
        "Fine-tune your portfolio with our visual editor, choose from stunning themes, and export your polished resume as a PDF ready for job applications.",
      icon: FiLayout,
    },
  ];

  const features = [
    {
      icon: FiZap,
      title: "AI-Powered Generation",
      description:
        "Leverage cutting-edge AI to automatically analyze your GitHub activity and generate compelling, personalized content that showcases your unique developer journey.",
    },
    {
      icon: FiLayout,
      title: "One-Click Portfolio",
      description:
        "Select your best repositories and instantly generate a fully responsive, modern portfolio website that looks great on every device and screen size.",
    },
    {
      icon: FiFileText,
      title: "Resume Builder",
      description:
        "Transform your GitHub profile and projects into a professional, ATS-friendly resume with beautiful formatting that recruiters and hiring managers love.",
    },
    {
      icon: FiLayers,
      title: "Theme Customization",
      description:
        "Choose from a curated collection of stunning themes and color palettes to make your portfolio uniquely yours and aligned with your personal brand.",
    },
    {
      icon: FiEdit3,
      title: "Editable Sections",
      description:
        "Add custom sections for work experience, education, certifications, and achievements using our intuitive rich text editor with full formatting support.",
    },
    {
      icon: FiDownload,
      title: "PDF Export",
      description:
        "Download your customized resume as a high-quality, print-ready PDF that maintains perfect formatting and is optimized for applicant tracking systems.",
    },
  ];

  const pricing = {
    hobby: {
      name: "Hobby",
      price: "$0",
      period: "/mo",
      features: [
        "Basic AI Generation",
        "Standard Theme",
        "1 Portfolio Link",
        "Community Support",
      ],
      cta: "Start for Free",
      ctaLink: "/signup",
      highlighted: false,
    },
    pro: {
      name: "Pro",
      price: "$9",
      period: "/mo",
      features: [
        "Advanced AI Formatting",
        "Premium Themes",
        "Custom Domain Support",
        "Remove Watermark",
        "Priority Support",
        "Unlimited Revisions",
      ],
      cta: "Get Pro",
      ctaLink: "/signup",
      highlighted: true,
    },
  };

  return (
    <div className="min-h-screen bg-[#030712] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/15 blur-[180px] rounded-full pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Announcement Badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-white/[0.06] text-sm text-slate-400 mb-8 backdrop-blur-sm"
            >
              <FiZap className="text-emerald-400 animate-pulse" />
              <span>
                <span className="text-emerald-400 font-medium">GitFolio 2.0</span> is now live
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-50 tracking-tight mb-6 leading-[1.1]"
            >
              Turn Your GitHub Into a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500">
                Stunning Portfolio
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              GitFolio uses advanced AI to transform your GitHub profile into a professional
              portfolio website and resume in seconds. Connect your account, select your best
              projects, and let our AI craft compelling content that showcases your unique
              developer journey.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/signup"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-900 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started for Free
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-300 bg-slate-900/50 hover:bg-slate-800/50 border border-white/[0.06] hover:border-white/[0.12] rounded-xl transition-all duration-300 backdrop-blur-sm">
                <FiZap className="text-emerald-400" />
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Floating Terminal Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative max-w-3xl mx-auto mt-16"
          >
            <div className="bg-slate-900/80 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900/50 border-b border-white/[0.06]">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-4 text-sm text-slate-500 font-mono">portfolio.gitfolio.dev</span>
              </div>
              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-emerald-400">$</span>
                  <span>gitfolio generate --from github</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiCheckCircle className="text-emerald-400" />
                    <span>Connected to GitHub successfully</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiCheckCircle className="text-emerald-400" />
                    <span>Analyzing 42 repositories...</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiCheckCircle className="text-emerald-400" />
                    <span>Generating portfolio content with AI...</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FiZap className="animate-pulse" />
                    <span className="font-medium">Portfolio ready!</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-2xl rounded-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Three simple steps to transform your GitHub presence into a professional portfolio
              that stands out.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting dashed line */}
            <div className="hidden lg:block absolute top-20 left-[16.67%] right-[16.67%] h-[2px]">
              <div className="w-full h-full border-t-2 border-dashed border-white/[0.06]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerItem}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center p-8"
                >
                  {/* Step number circle */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-slate-900/50 border border-white/[0.06] flex items-center justify-center backdrop-blur-sm">
                      <step.icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-slate-900">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-50 mb-3">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
              Features Built for Developers
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to create a stunning portfolio and professional resume, all in
              one powerful platform.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="group p-8 rounded-2xl bg-slate-900/50 border border-white/[0.06] hover:border-emerald-500/30 hover:bg-slate-900/30 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-50 mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Start for free and upgrade when you need more features. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Hobby Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="p-8 rounded-2xl bg-slate-900/50 border border-white/[0.06] backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-50 mb-2">{pricing.hobby.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-50">
                    {pricing.hobby.price}
                  </span>
                  <span className="text-slate-500">{pricing.hobby.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {pricing.hobby.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={pricing.hobby.ctaLink}
                className="block w-full py-3.5 px-6 text-center rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/[0.06] text-slate-300 font-semibold transition-all duration-300"
              >
                {pricing.hobby.cta}
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ delay: 0.1 }}
              className="relative p-8 rounded-2xl bg-slate-900/50 border border-emerald-500/30 backdrop-blur-sm shadow-lg shadow-emerald-500/10 md:-translate-y-4"
            >
              {/* Recommended Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                  <FiStar className="w-4 h-4" />
                  Recommended
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-emerald-400 mb-2">{pricing.pro.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-50">
                    {pricing.pro.price}
                  </span>
                  <span className="text-slate-500">{pricing.pro.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {pricing.pro.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={pricing.pro.ctaLink}
                className="block w-full py-3.5 px-6 text-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300"
              >
                {pricing.pro.cta}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FAQs --- */}
      <section id="faqs" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg">
              Got questions? We have got answers. If you cannot find what you are looking for,
              reach out to our support team.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="rounded-2xl bg-slate-900/50 border border-white/[0.06] overflow-hidden backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-lg font-semibold text-slate-50 pr-4">{faq.question}</span>
                  <FiChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-emerald-900/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-50 mb-6">
            Ready to stand out?
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Join thousands of developers who have transformed their GitHub profiles into stunning
            portfolios. Your dream job is just a few clicks away.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-slate-900 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Create Your Portfolio Now
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-50 mb-4">About GitFolio</h2>
            <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed">
              GitFolio was built by developers, for developers. We understand the challenge of
              showcasing your work effectively while job hunting or building your personal brand.
              Our mission is to eliminate the friction between your GitHub contributions and a
              professional online presence. Using cutting-edge AI technology, we analyze your code,
              extract meaningful insights, and present your skills in the most compelling way
              possible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { number: "10K+", label: "Portfolios Created" },
              { number: "500K+", label: "Repos Analyzed" },
              { number: "98%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center p-8 rounded-2xl bg-slate-900/30 border border-white/[0.06]"
              >
                <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
