import { APP_NAME } from "../../utils/constants";

/**
 * Loader - Full-screen loading spinner shown during auth state resolution
 * and async operations. Uses the same dark background as the app shell.
 */
export default function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-surface-600 border-t-primary" />
        </div>
        <p className="text-sm font-medium tracking-wide text-text-muted">
          {APP_NAME}
        </p>
      </div>
    </div>
  );
}
