import 'dotenv/config.js';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/index.js';
import { CreateOfferDto } from '../../shared/modules/offer/dto/create-offer.dto.js';
import { DefaultFavoriteService, FavoriteModel, FavoriteService } from '../../shared/modules/favorite/index.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private favoriteService: FavoriteService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.favoriteService = new DefaultFavoriteService(this.logger, FavoriteModel, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      email: offer.user.email,
      name: offer.user.name,
      avatarPath: offer.user.avatarPath,
      password: offer.user.password ?? 'import12',
      userType: offer.user.userType,
    }, this.salt);

    const createdOffer = await this.offerService.create({
      authorId: user.id,
      title: offer.title,
      description: offer.description,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      postDate: offer.postDate,
      price: offer.price,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      goods: offer.goods,
      location: offer.location,
    } as CreateOfferDto & { authorId: string });

    if (offer.isFavorite) {
      await this.favoriteService.addToFavorites(user.id, createdOffer.id);
    }
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string): Promise<void> {
    if (!filename) {
      console.error('Usage: --import <filepath>');
      return;
    }

    const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'SALT'] as const;
    const missingKeys = requiredEnv.filter((key) => !process.env[key]);

    if (missingKeys.length > 0) {
      console.error(`Missing required env variables for import: ${missingKeys.join(', ')}`);
      return;
    }

    const {
      DB_USER,
      DB_PASSWORD,
      DB_HOST,
      DB_PORT,
      DB_NAME,
      SALT,
    } = process.env as Record<(typeof requiredEnv)[number], string>;

    const uri = getMongoURI(DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME);
    this.salt = SALT;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);

    try {
      const importedCount = await fileReader.read();
      console.info(`${importedCount} rows imported.`);
      await this.databaseClient.disconnect();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));

      if (this.databaseClient.isConnectedToDatabase()) {
        await this.databaseClient.disconnect();
      }
    }
  }
}
