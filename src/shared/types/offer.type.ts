import { OfferType } from './offer-type.enum.js';
import { User } from './user.type.js';
import { OfferCity } from '../modules/offer/offer.constant.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: OfferCity;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  goods: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  user: User;
}
