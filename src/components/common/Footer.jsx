import { FaGithub, FaHeart } from "react-icons/fa";
import { APP_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-surface-700 bg-surface-900 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-sm text-text-muted">
          Made with <FaHeart className="text-error" /> using React & Firebase
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted transition-colors hover:text-text-primary"
        >
          <FaGithub size={20} />
        </a>
      </div>
    </footer>
  );
}
