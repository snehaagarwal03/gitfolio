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


export default function LetterAvatar({ name = "U", size = "md", customClass = "" }) {
  const letter = name.charAt(0).toUpperCase();
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-bold text-primary-foreground bg-primary ${sizeClass} ${customClass}`}
    >
      {letter}
    </div>
  );
}
