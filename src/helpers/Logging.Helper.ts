import chalk from 'chalk';
import { Results } from '../interfaces/Baseline';

export default class LoggingHelper {
    LogNoSecretsFound() {
        console.info(chalk.green(`\nNo secrets found`));
    }

    LogSecretsFound(resultsArray: Results) {
        for (const resultKey in resultsArray) {
            const results = resultsArray[resultKey];
            results.forEach((result) => {
                console.error(chalk`Secret found {red.bold ${resultKey}}`);
                console.error(chalk`\tSecret Type: {red.bold ${result.type}}`);
                console.error(chalk`\tSecret Line number: {red.bold ${result.line_number}}`);
                console.error(chalk`\tSecret Hash: {red.bold ${result.hashed_secret}}\n`);
            });
        }
    }

    LogBeginScan(location: string) {
        console.info(`\nBeginning scan on:`);
        console.info(chalk.blue.bold(`\t${location}`));
    }
}
