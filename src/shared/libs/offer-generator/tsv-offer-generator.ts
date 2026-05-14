import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, OfferType } from '../../types/index.js';
import { generateRandomValue, getRandomItem } from '../../helpers/index.js';
import { CITY_COORDINATES, OfferCity } from '../../modules/offer/offer.constant.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const previewImage = getRandomItem<string>(this.mockData.offerImages);
    const images = Array.from({ length: 6 }, () => getRandomItem<string>(this.mockData.offerImages));
    const type = getRandomItem([OfferType.Apartment, OfferType.House, OfferType.Room, OfferType.Hotel]);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const city = getRandomItem(this.mockData.cities);
    const goods = this.pickGoods();
    const userType = getRandomItem(this.mockData.userTypes);
    const password = `pass${generateRandomValue(100, 999)}`;
    const coordinates = CITY_COORDINATES[city as OfferCity];
    const isPremium = String(Math.random() >= 0.5);
    const isFavorite = String(Math.random() >= 0.5);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images.join(';'),
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      goods.join(';'),
      name,
      email,
      avatar,
      password,
      userType,
      this.randomCoordinate(coordinates.latitude).toString(),
      this.randomCoordinate(coordinates.longitude).toString(),
    ].join('\t');
  }

  private pickGoods(): string[] {
    const items = new Set<string>();
    const targetCount = generateRandomValue(1, this.mockData.goods.length);

    while (items.size < targetCount) {
      items.add(getRandomItem(this.mockData.goods));
    }

    return Array.from(items);
  }

  private randomCoordinate(value: number): number {
    return Number((value + (Math.random() - 0.5) * 0.1).toFixed(6));
  }
}
