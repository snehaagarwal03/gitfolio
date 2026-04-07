import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[80px] bg-emerald-500/[0.07] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Git<span className="text-emerald-400">Folio</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Turn your GitHub profile into a stunning, AI-powered professional portfolio and resume. Built for developers.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <FiGithub size={16} />, href: "#" },
                { icon: <FiTwitter size={16} />, href: "#" },
                { icon: <FiLinkedin size={16} />, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Product</h3>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "#features" },
                { name: "How it Works", href: "#how-it-works" },
                { name: "Pricing", href: "#pricing" },
                { name: "FAQs", href: "#faqs" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Contact", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-slate-500 hover:text-emerald-400 transition-colors duration-200">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} GitFolio. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Built with <span className="text-red-500">&#9829;</span> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
