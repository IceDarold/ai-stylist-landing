export type MarketplaceId =
  | "wb"
  | "ozon"
  | "ym"
  | "lamoda"
  | "brandstores"
  | "showroom";

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
};

export type MarketplacesAnswer = {
  any_ok: boolean; // "Любой"
  preferred: MarketplaceId[]; // where we want
  excluded: MarketplaceId[]; // where we do not want
  delivery?: DeliveryPref; // delivery options
  payment?: PaymentPref; // payment options
  tryon?: boolean; // need try-on
  loyalty?: LoyaltyPref; // subscriptions/points
};
