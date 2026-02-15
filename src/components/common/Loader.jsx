/**
 * Loader - Full-screen loading spinner shown during auth state resolution
 * and async operations.
 */
export default function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-600 border-t-primary" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}
