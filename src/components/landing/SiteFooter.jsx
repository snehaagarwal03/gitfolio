import { Link } from "react-router-dom";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">GitHub</span>
            <FaGithub className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            <span className="sr-only">Twitter</span>
            <FaTwitter className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} GitFolio. Built for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
