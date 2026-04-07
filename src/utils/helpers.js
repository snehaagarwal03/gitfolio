export function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
