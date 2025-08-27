export type MarketplaceId =
  | "wb"
  | "ozon"
  | "ym"
  | "lamoda"
  | "brandstores"
  | "showroom"
  | "sbermega"
  | "kazanexpress";

export type DeliveryPref = {
  pickup?: boolean;
  courier?: boolean;
  locker?: boolean;
};

export type PaymentPref = {
  card?: boolean;
  split?: boolean;
};

export type LoyaltyPref = {
  wb?: boolean;
  ozon?: boolean;
  ym?: boolean;
  lamoda?: boolean;
  brandstores?: boolean;
  showroom?: boolean;
  sbermega?: boolean;
  kazanexpress?: boolean;
};

export interface MarketplacesAnswer {
  any_ok: boolean;
  preferred: MarketplaceId[];
  excluded: MarketplaceId[];
  delivery?: DeliveryPref;
  payment?: PaymentPref;
  tryon?: boolean;
  loyalty?: LoyaltyPref;
}
