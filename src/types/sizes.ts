export type UnitSystem = "metric" | "imperial";
export type Fit = "tight" | "regular" | "relaxed" | "oversized";
export type PantsCut = "straight" | "slim" | "wide" | "flare";

export interface SizeProfile {
  unit: UnitSystem;
  top_size_ru?: number;
  bottom_size_ru?: number;
  jeans_waist_in?: number;
  jeans_inseam?: number; // stored in cm
  bust_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  top_fit?: Fit;
  pants_cut?: PantsCut;
  autopick: boolean;
}
