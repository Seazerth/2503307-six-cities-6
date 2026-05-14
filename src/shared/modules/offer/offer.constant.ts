export const DEFAULT_OFFER_COUNT = 60;
export const PREMIUM_OFFER_COUNT = 3;
export const COMMENT_LIST_LIMIT = 50;

export const OFFER_CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export const OFFER_GOODS = [
  'Breakfast',
  'Air conditioning',
  'Laptop friendly workspace',
  'Baby seat',
  'Washer',
  'Towels',
  'Fridge',
] as const;

export type OfferCity = typeof OFFER_CITIES[number];
export type OfferGood = typeof OFFER_GOODS[number];

export const CITY_COORDINATES: Record<OfferCity, { latitude: number; longitude: number }> = {
  Paris: { latitude: 48.85661, longitude: 2.351499 },
  Cologne: { latitude: 50.938361, longitude: 6.959974 },
  Brussels: { latitude: 50.846557, longitude: 4.351697 },
  Amsterdam: { latitude: 52.370216, longitude: 4.895168 },
  Hamburg: { latitude: 53.550341, longitude: 10.000654 },
  Dusseldorf: { latitude: 51.225402, longitude: 6.776314 },
};
