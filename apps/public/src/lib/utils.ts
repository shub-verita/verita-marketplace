export function formatPayRange(min: number, max: number): string {
  return `$${min} - $${max}/hr`;
}

export function isNew(date: Date | string | null): boolean {
  if (!date) return false;
  const publishedDate = new Date(date);
  const now = new Date();
  const diffInDays = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 7;
}
