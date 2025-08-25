export function toggleStyle(
  selected: string[],
  id: string,
  limit = 2
): { next: string[]; limitHit: boolean } {
  const exists = selected.includes(id);
  if (exists) {
    return { next: selected.filter((s) => s !== id), limitHit: false };
  }
  if (selected.length >= limit) {
    return { next: selected, limitHit: true };
  }
  return { next: [...selected, id], limitHit: false };
}
