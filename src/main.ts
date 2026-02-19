import { runCLI } from './cli/cli.js';

const args = process.argv.slice(2);
runCLI(args).catch((error) => {
  console.error('Ошибка:', error);
  process.exit(1);
});

