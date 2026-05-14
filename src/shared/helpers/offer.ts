import { Offer, OfferType } from '../types/index.js';
import { OFFER_CITIES } from '../modules/offer/offer.constant.js';

export function createOffer(offerData: string): Offer {
  const fields = offerData.trim().split('\t');

  if (fields.length !== 21) {
    throw new Error(`Invalid TSV row format. Expected 21 fields, got ${fields.length}`);
  }

  const title = fields[0];
  const description = fields[1];
  const postDate = fields[2];
  const city = fields[3];
  const previewImage = fields[4];
  const images = fields[5].split(';');
  const isPremium = fields[6] === 'true';
  const isFavorite = fields[7] === 'true';
  const rating = Number.parseFloat(fields[8]);
  const type = fields[9];
  const rooms = Number.parseInt(fields[10], 10);
  const guests = Number.parseInt(fields[11], 10);
  const price = Number.parseInt(fields[12], 10);
  const goods = fields[13].split(';');
  const name = fields[14];
  const email = fields[15];
  const avatarPath = fields[16];
  const password = fields[17];
  const userType = fields[18];
  const latitude = Number.parseFloat(fields[19]);
  const longitude = Number.parseFloat(fields[20]);

  if (!OFFER_CITIES.includes(city as (typeof OFFER_CITIES)[number])) {
    throw new Error(`Unsupported city value in TSV: ${city}`);
  }

  const user = {
    name,
    email,
    avatarPath,
    password,
    userType: userType as 'ordinary' | 'pro',
  };

  return {
    title,
    description,
    city: city as (typeof OFFER_CITIES)[number],
    previewImage,
    images,
    isPremium,
    isFavorite,
    rating,
    user,
    postDate: new Date(postDate),
    type: type as OfferType,
    rooms,
    guests,
    price,
    goods,
    location: {
      latitude,
      longitude,
    },
  };
}
