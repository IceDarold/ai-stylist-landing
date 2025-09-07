type SlotDef = { label: string; fallback: string };

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
} as const satisfies Record<string, SlotDef>;

export type SlotId = keyof typeof IMAGE_SLOTS;

export function isSlotId(value: string): value is SlotId {
  return value in IMAGE_SLOTS;
}

export function getFallbackForSlot(slotId: string): string | null {
  return isSlotId(slotId)
    ? IMAGE_SLOTS[slotId].fallback
    : null;
}

export const ALL_SLOTS: { id: string; label: string; fallback: string }[] = (
  Object.entries(IMAGE_SLOTS) as [SlotId, (typeof IMAGE_SLOTS)[SlotId]][]
).map(([id, v]) => ({ id, label: v.label, fallback: v.fallback }));
