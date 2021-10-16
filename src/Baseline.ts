import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';
import { DateTime } from 'luxon';
import Results from './models/Results';

chalk.level = 3;

export default class Baseline {
    generated_at: string;
    plugins: string[];
    filters: string[];
    results: Results;

    private static baselineFile = 'secret-scanner.baseline.json';

    constructor() {
        const baseline = Baseline.GetBaselineFile();
        this.generated_at = baseline.generated_at;
        this.plugins = baseline.plugins;
        this.filters = baseline.filters;
        this.results = baseline.results;
    }

    private static GetBaselineFile(): Baseline {
        try {
            const baselineRAW = readFileSync(`${process.cwd()}/${this.baselineFile}`);
            const baseline: Baseline = JSON.parse(baselineRAW.toString());
            return baseline;
        } catch (error) {
            console.info(chalk.red(`${this.baselineFile} not found in ${process.cwd()}`));
            return this.CreateBaselineFile();
        }
    }

    private static CreateBaselineFile(): Baseline {
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

    static SaveBaselineToFile(baseline: Baseline): void {
        try {
            writeFileSync(`${process.cwd()}/${Baseline.baselineFile}`, JSON.stringify(baseline, null, 2));
            console.info(chalk`\nSaved baseline: {green ${process.cwd()}/${Baseline.baselineFile}}`);
        } catch (error) {
            console.error(chalk.red(`Failed to save baseline file`));
            console.error(chalk.red(error));
        }
    }

    static SetGeneratedAt(baseline: Baseline): Baseline {
        baseline.generated_at = DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
        return baseline;
    }
}
