export const IMAGE_SLOTS = {
  "hero.bg": {
    label: "Hero background",
    fallback: "/hero.jpg",
  },
  "brand.logo": {
    label: "Brand logo",
    // Use existing raster logo in public/
    fallback: "/logo.png",
  },
} as const;

export type SlotId = keyof typeof IMAGE_SLOTS;

export function getFallbackForSlot(slotId: string): string | null {
  return (IMAGE_SLOTS as any)[slotId]?.fallback ?? null;
}

export const ALL_SLOTS: { id: string; label: string; fallback: string }[] =
  Object.entries(IMAGE_SLOTS).map(([id, v]) => ({ id, ...(v as any) }));
