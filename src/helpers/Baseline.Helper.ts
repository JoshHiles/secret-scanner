import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { DateTime } from 'luxon';
import Baseline from '../types/Baseline';

chalk.level = 3;

export default class BaselineHelper {
    baselineFile = 'secret-scanner.baseline.json';

    LoadBaseline(): Baseline {
        try {
            const baselineRAW = readFileSync(`${process.cwd()}/${this.baselineFile}`);
            const baseline: Baseline = JSON.parse(baselineRAW.toString());
            return baseline;
        } catch (error) {
            console.info(chalk.red(`${this.baselineFile} not found in ${process.cwd()}`));
            return this.CreateBaselineFile();
        }
    }

    private CreateBaselineFile(): Baseline {
        const baseline: Baseline = {
            generated_at: DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ'),
            plugins: [],
            filters: [],
            results: {},
        };
        writeFileSync(`${process.cwd()}/${this.baselineFile}`, JSON.stringify(baseline, null, 2));
        console.info(chalk.green(`Created ${this.baselineFile}`));
        return baseline;
    }

    SaveBaselineToFile(baseline: Baseline) {
        try {
            writeFileSync(`${process.cwd()}/${this.baselineFile}`, JSON.stringify(baseline, null, 2));
            console.info(chalk`\nSaved baseline: {green ${process.cwd()}/${this.baselineFile}}`);
        } catch (error) {
            console.error(chalk.red(`Failed to save baseline file`));
            console.error(chalk.red(error));
        }
    }

    SetGeneratedAt(baseline: Baseline): Baseline {
        baseline.generated_at = DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
        return baseline;
    }
}
