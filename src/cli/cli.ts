import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import { OfferGenerator } from '../services/offer-generator.js';
import { MockDataFetcher } from '../services/mock-data-fetcher.js';
import { TSVWriter } from '../services/tsv-writer.js';
import { ImportCommand } from './commands/import.command.js';

export const runCLI = async (args: string[]): Promise<void> => {

  const showHelp = () => {
    console.log(chalk.blue(`
Доступные команды:

--help                                        Показать список команд
--version                                     Показать версию приложения
--import <file> <dblogin> <dbpassword>        Импортировать данные из TSV файла
<dbhost> <dbname> <salt>
--generate <n> <filepath> <url>               Сгенерировать тестовые данные
    `));
  };

  const showVersion = () => {
    const packageJSON = JSON.parse(
      fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
    );

    console.log(chalk.green(`Версия: ${packageJSON.version}`));
  };

  const importData = async (filePath?: string, dbLogin?: string, dbPassword?: string, dbHost?: string, dbName?: string, salt?: string): Promise<void> => {
    if (!filePath || !dbLogin || !dbPassword || !dbHost || !dbName || !salt) {
      console.error(chalk.red('Использование: --import <file> <dblogin> <dbpassword> <dbhost> <dbname> <salt>'));
      return;
    }

    try {
      const command = new ImportCommand();
      await command.execute(filePath, dbLogin, dbPassword, dbHost, dbName, salt);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Ошибка импорта: ${errorMessage}`));
      throw error;
    }
  };

  const generateData = async (count?: string, filePath?: string, url?: string): Promise<void> => {
    try {
      // Validate arguments
      if (!count || !filePath || !url) {
        console.error(
          chalk.red('Использование: --generate <n: число> <filepath: строка> <url: строка>')
        );
        return;
      }

      const numOffers = parseInt(count, 10);
      if (isNaN(numOffers) || numOffers <= 0) {
        console.error(chalk.red('Количество должно быть положительным числом'));
        return;
      }

      console.log(chalk.yellow(`Получение данных с сервера ${url}...`));

      // Fetch mock data
      const fetcher = new MockDataFetcher(url);
      const mockOffers = await fetcher.fetchOffers();

      if (mockOffers.length === 0) {
        console.error(chalk.red('На сервере не найдено данных'));
        return;
      }

      console.log(chalk.cyan(`Получено ${mockOffers.length} шаблонов данных`));
      console.log(chalk.yellow(`Генерация ${numOffers} предложений...`));

      // Generate offers
      const generator = new OfferGenerator();
      const offers = generator.generateOffers(mockOffers, numOffers);

      // Write to file
      const resolvedPath = path.resolve(filePath);
      await TSVWriter.writeToFile(resolvedPath, offers);

      console.log(chalk.green(`✓ Файл успешно создан: ${resolvedPath}`));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Ошибка генерации: ${errorMessage}`));
    }
  };

  try {
    switch (args[0]) {
      case '--help':
        showHelp();
        break;
      case '--version':
        showVersion();
        break;
      case '--import':
        await importData(args[1], args[2], args[3], args[4], args[5], args[6]);
        break;
      case '--generate':
        await generateData(args[1], args[2], args[3]);
        break;
      default:
        showHelp();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Критическая ошибка: ${errorMessage}`));
    throw new Error(errorMessage);
  }
};

