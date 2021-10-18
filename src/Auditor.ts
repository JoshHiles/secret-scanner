import chalk from 'chalk';
import { prompt } from 'inquirer';
import clear from 'clear';
import Baseline from './Baseline';
import FileHelper from './helpers/File.helper';

chalk.level = 3;

export default class Auditor {
    private baseline: Baseline;
    constructor() {
        this.baseline = new Baseline();
    }

    async Audit(baseline?: Baseline): Promise<void> {
        if (baseline) {
            this.baseline = baseline;
        }
        for (const resultPath in this.baseline.results) {
            const results = this.baseline.results[resultPath];
            console.info(chalk.green(`Auditing file: ${resultPath}`));

            for (const result of results) {
                console.info(chalk.yellow(`Line number: ${result.line_number}`));
                console.info(
                    chalk.red(`Secret to audit: ${await FileHelper.GetSecret(resultPath, result.line_number)}`),
                );
                const userInput = await prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Should this secret be committed to this repository?',
                    },
                ]);
                console.info(userInput);
                result.is_secret = !userInput.confirm;
                clear();
            }
        }

        Baseline.SaveBaselineToFile(this.baseline);
        return;
    }
}
