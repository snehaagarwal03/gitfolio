import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGithub, FiZap, FiLayout, FiFileText, FiCheckCircle, FiChevronRight } from "react-icons/fi";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#02040a] selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-sm text-emerald-400 mb-8"
          >
            <FiZap className="animate-pulse" />
            <span>GitFolio 2.0 is now live</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight"
          >
            Turn Your GitHub Into a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Stunning Portfolio
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            GitFolio uses AI to transform your GitHub profile into a professional portfolio website and resume in seconds. Sign in, select your best projects, and let AI do the rest.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-900 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started for Free <FiChevronRight />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-300 bg-gray-900/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-900 bg-gradient-to-b from-[#02040a] to-[#0a0f1c]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to your new professional developer presence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 z-0" />

            {[
              {
                step: "01",
                title: "Connect GitHub",
                desc: "Authenticate securely and let GitFolio fetch your repositories, bio, and stats automatically.",
                icon: <FiGithub size={24} />,
              },
              {
                step: "02",
                title: "AI Generation",
                desc: "Our AI analyzes your code to write compelling project summaries and highlight your best skills.",
                icon: <FiZap size={24} />,
              },
              {
                step: "03",
                title: "Customize & Export",
                desc: "Tweak the design, switch themes, edit your resume, and export to PDF instantly.",
                icon: <FiLayout size={24} />,
              },
            ].map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={item.step}
                className="relative z-10 flex flex-col items-center text-center p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-emerald-400 font-bold text-xl mb-6 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-900">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Features Designed for Devs</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to showcase your talent in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Generation",
                desc: "AI analyzes your GitHub profile to write tailored content, project descriptions, and summaries.",
              },
              {
                title: "One-Click Portfolio",
                desc: "Select your best repos and instantly generate a fully responsive, dark-mode ready portfolio.",
              },
              {
                title: "Resume Builder",
                desc: "Generate a clean, professional A4 resume from the exact same data source.",
              },
              {
                title: "Theme Customization",
                desc: "Switch between modern color themes to make your portfolio match your personal brand.",
              },
              {
                title: "Editable Sections",
                desc: "Easily add manual sections like experience, education, or achievements with our rich editor.",
              },
              {
                title: "PDF Export",
                desc: "Download your customized resume as a clean, ATS-friendly PDF ready for job applications.",
              },
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                key={feature.title}
                className="p-8 rounded-2xl bg-[#0a0f1c] border border-gray-800 hover:border-emerald-500/40 hover:bg-gray-900/80 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <FiCheckCircle className="text-emerald-400 text-xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-900 bg-gradient-to-b from-[#0a0f1c] to-[#02040a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-12">Start for free, upgrade when you need more power.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 text-left hover:border-gray-600 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">Hobby</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Basic AI Generation</li>
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Standard Theme</li>
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> 1 Portfolio Link</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 text-center rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors">
                Start for Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-gray-900 to-gray-900 border border-emerald-500/50 text-left relative shadow-[0_0_40px_rgba(16,185,129,0.1)] transform md:-translate-y-4">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-emerald-500 text-gray-900 text-xs font-bold rounded-full uppercase tracking-wider">
                Recommended
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-white mb-6">$9<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Advanced AI Formatting</li>
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Premium Themes</li>
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Custom Domain Support</li>
                <li className="flex items-center gap-3 text-gray-300"><FiCheckCircle className="text-emerald-500" /> Remove Watermark</li>
              </ul>
              <Link to="/signup" className="block w-full py-3 px-4 text-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-colors">
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQs --- */}
      <section id="faqs" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "Do I need to know how to code to use this?", a: "Not at all! GitFolio automatically pulls your data from GitHub and generates the website for you." },
              { q: "Can I edit the generated content?", a: "Yes, you have full control. You can edit text, add new sections, and change themes anytime in the dashboard." },
              { q: "Is the resume ATS friendly?", a: "Yes, our resume templates are designed specifically to be clean, parseable, and ATS-friendly." },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-900/30 border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-[#02040a]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-extrabold text-white mb-6">Ready to stand out?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of developers building their professional brand with GitFolio.</p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 text-lg font-bold text-gray-900 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all transform hover:scale-105"
          >
            Create Your Portfolio Now
          </Link>
        </div>
      </section>
    </div>
  );
}
