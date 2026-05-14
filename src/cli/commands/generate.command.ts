import got from 'got';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async load(url: string) {
    try {
      const response = await got.get(url).json<MockServerData | { api: MockServerData }>();
      this.initialData = 'api' in response ? response.api : response;
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    try {
      for (let i = 0; i < offerCount; i++) {
        await tsvFileWriter.write(tsvOfferGenerator.generate());
      }
    } finally {
      await tsvFileWriter.close();
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    if (!count || !filepath || !url) {
      console.error('Usage: --generate <n> <filepath> <url>');
      return;
    }

    if (!Number.isInteger(offerCount) || offerCount <= 0) {
      console.error('The <n> argument for --generate must be a positive integer');
      return;
    }

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
