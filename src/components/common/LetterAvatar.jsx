/**
 * LetterAvatar - Displays the first letter of a user's name in a colored circle.
 * Colors are selected to be harmonious with the darkmatter theme.
 */

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-sm",
  md: "h-12 w-12 text-lg",
  lg: "h-16 w-16 text-2xl",
  xl: "h-24 w-24 text-4xl",
};

// Darkmatter-compatible muted palette (no bright pink/red)
const COLORS = [
  "bg-primary/80",
  "bg-amber-600",
  "bg-emerald-600",
  "bg-cyan-600",
  "bg-violet-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-orange-600",
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
