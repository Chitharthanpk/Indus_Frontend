export function sanitizeText(raw?: string | null): string {
  if (!raw && raw !== "") return "";

  let s = String(raw);

  // Remove words "Descriptive" / "Prescriptive" (case-insensitive)
  s = s.replace(/\b(Descriptive|Prescriptive)\b/gi, " ");

  // Remove unwanted characters
  s = s.replace(/[`~#\!\^\*:]/g, " ");

  // Keep only letters, numbers, spaces, and common punctuation
  s = s.replace(/[^A-Za-z0-9 \n\.\,\:\;\!\?\'\"\(\)\-\%\/]/g, " ");

  // Collapse multiple spaces
  s = s.replace(/\s{2,}/g, " ").trim();

  return s;
}