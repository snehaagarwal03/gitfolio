export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Git<span className="text-emerald-500">Folio</span> -- AI-Powered Portfolio Generator
          </p>
          <p className="text-sm text-gray-600">
            Built for developers, by developers
          </p>
        </div>
      </div>
    </footer>
  );
}
