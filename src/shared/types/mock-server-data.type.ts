import { OfferCity, OfferGood } from '../modules/offer/offer.constant.js';
import { UserType } from '../modules/user/user.constant.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  offerImages: string[];
  users: string[];
  emails: string[];
  avatars: string[];
  cities: OfferCity[];
  goods: OfferGood[];
  userTypes: UserType[];
};
