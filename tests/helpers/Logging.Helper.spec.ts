import chalk from 'chalk';
import LoggingHelper from '../../src/helpers/Logging.Helper';
import { Results } from '../../src/interfaces/Baseline';

describe('Logging Helper', () => {
    test('LogNoSecretsFound', () => {
        console.info = jest.fn();

        new LoggingHelper().LogNoSecretsFound();

        expect(console.info).toHaveBeenCalledWith(chalk.green(`\nNo secrets found`));
    });

    test('LogSecretsFound', () => {
        console.error = jest.fn();
        const resultsArray: Results = {
            'file1.md': [
                { hashed_secret: 'hash', line_number: 1, type: 'type', is_secret: false },
                { hashed_secret: 'hash', line_number: 2, type: 'type', is_secret: true },
            ],
            'file2.txt': [
                {
                    hashed_secret: 'hash',
                    line_number: 1,
                    type: 'type',
                },
            ],
        };

        new LoggingHelper().LogSecretsFound(resultsArray);

        for (const resultKey in resultsArray) {
            const results = resultsArray[resultKey];
            results.forEach((result) => {
                expect(console.error).toHaveBeenCalledWith(chalk`Secret found {red.bold ${resultKey}}`);
                expect(console.error).toHaveBeenCalledWith(chalk`\tSecret Type: {red.bold ${result.type}}`);
                expect(console.error).toHaveBeenCalledWith(
                    chalk`\tSecret Line number: {red.bold ${result.line_number}}`,
                );
                expect(console.error).toHaveBeenCalledWith(chalk`\tSecret Hash: {red.bold ${result.hashed_secret}}\n`);
            });
        }
    });

    test('LogBeginScan', () => {
        console.info = jest.fn();
        new LoggingHelper().LogBeginScan('location');

        expect(console.info).toHaveBeenCalledWith(`\nBeginning scan on:`);
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`\tlocation`));
    });
});
