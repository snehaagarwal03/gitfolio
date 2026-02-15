/**
 * LetterAvatar - Displays the first letter of a user's name in a colored circle.
 * Used as the default avatar before GitHub avatar integration.
 */

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

// Deterministic color based on the name string
const COLORS = [
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];

function getColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function LetterAvatar({ name = "U", size = "md" }) {
  const letter = name.charAt(0).toUpperCase();
  const colorClass = getColorFromName(name);
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold text-white ${colorClass} ${sizeClass}`}
    >
      {letter}
    </div>
  );
}
