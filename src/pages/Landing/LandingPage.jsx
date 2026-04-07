import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Turn Your GitHub Into a{" "}
            <span className="text-emerald-500">Stunning Portfolio</span>
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
            GitFolio uses AI to transform your GitHub profile into a professional
            portfolio website and resume in seconds. Sign in, select your best
            projects, and let AI do the rest.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 text-base font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3 text-base font-medium text-gray-300 border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign In",
                description:
                  "Authenticate with Google, GitHub OAuth, or email/password to get started.",
              },
              {
                step: "2",
                title: "Generate",
                description:
                  "AI fetches your GitHub data, analyzes your projects, and generates a complete portfolio.",
              },
              {
                step: "3",
                title: "Customize",
                description:
                  "Edit sections, switch themes, add achievements, and generate a resume from the same data.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Generation",
                description:
                  "AI analyzes your GitHub profile and projects to create tailored portfolio content.",
              },
              {
                title: "One-Click Portfolio",
                description:
                  "Select your best repositories and generate a complete portfolio website instantly.",
              },
              {
                title: "Resume Generator",
                description:
                  "Generate and customize a professional resume from the same GitHub data.",
              },
              {
                title: "Theme Customization",
                description:
                  "Switch between light and dark modes and apply different color themes to your portfolio.",
              },
              {
                title: "Editable Sections",
                description:
                  "Add, edit, or remove portfolio sections like achievements, education, and experience.",
              },
              {
                title: "PDF Export",
                description:
                  "Export your customized resume as a clean PDF ready for job applications.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-lg border border-gray-800 hover:border-emerald-500/30 transition-colors"
              >
                <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
