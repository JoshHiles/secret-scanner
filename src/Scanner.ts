import { parse } from 'path';
import chalk from 'chalk';
import { StopWatch } from 'stopwatch-node';

import Baseline from './Baseline';
import FileHelper from './helpers/File.helper';
import Configuration from './Configuration';
import PluginHelper from './helpers/Plugin.helper';
import Runner from './Runner';
import { Duration } from 'luxon';

chalk.level = 3;

export default class Scanner {
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;
    Configuration: Configuration;
    Baseline: Baseline;
    Plugins: string[];
    Stopwatch: StopWatch;
    Runner: Runner;

    constructor() {
        this.Configuration = new Configuration();
        this.PluginHelper = new PluginHelper(this.Configuration);
        this.FileHelper = new FileHelper(this.Configuration);

        this.Baseline = new Baseline();
        this.Plugins = this.PluginHelper.LoadPlugins();
        this.Stopwatch = new StopWatch('Scanner');
        this.Runner = new Runner(this.Configuration, this.Baseline, this.Plugins);
    }

    async Scan(directory: string): Promise<Baseline> {
        this.Stopwatch.start('Get Files');
        const files = this.FileHelper.GetFiles([directory]);
        this.Stopwatch.stop();

        this.Stopwatch.start('Scan Files');
        this.Baseline.results = await this.Runner.Run(files);
        this.Stopwatch.stop();

        const totalTime = this.Stopwatch.getTotalTime();
        const timeTaken = Duration.fromMillis(totalTime).toFormat("mm' minutes' ss' seconds' SSS' milliseconds'");
        console.info(chalk`\nTook: {blue.bold ${timeTaken}}`);

        if (process.env.DEBUG == '1') {
            console.log();
            this.Stopwatch.prettyPrint();
        }

        this.Baseline = Baseline.SetGeneratedAt(this.Baseline);

        const pluginsNormalised: string[] = [];
        this.Plugins.forEach((plugin) => {
            pluginsNormalised.push(parse(plugin).name);
        });

        this.Baseline.plugins = pluginsNormalised;
        Baseline.SaveBaselineToFile(this.Baseline);
        return this.Baseline;
    }

    async Hook(files: string[]): Promise<void> {
        this.Stopwatch.start('Scan Files');
        this.FileHelper.GetFiles(files);
        const resultsArray = await this.Runner.Run(files);
        this.Stopwatch.stop();

        const totalTime = this.Stopwatch.getTotalTime();
        const timeTaken = Duration.fromMillis(totalTime).toFormat("mm' minutes' ss' seconds' SSS' milliseconds'");
        console.info(chalk`\nTook: {blue.bold ${timeTaken}`);

        if (process.env.DEBUG == '1') {
            console.log();

            this.Stopwatch.prettyPrint();
        }

        if (Object.keys(resultsArray).length === 0) {
            console.info(chalk.green(`\nNo secrets found`));
            process.exitCode = 0;
        } else {
            for (const resultKey in resultsArray) {
                const resultArray = resultsArray[resultKey];

                if (resultKey in this.Baseline.results) {
                    const foundInBaseline = this.Baseline.results[resultKey];
                    for (const result of resultArray) {
                        for (const baselineResult of foundInBaseline) {
                            const typeMatch = baselineResult.type === result.type;
                            const lineMatch = baselineResult.line_number === result.line_number;
                            const hashMatch = baselineResult.hashed_secret === result.hashed_secret;
                            if (typeMatch && lineMatch && hashMatch) {
                                if (!baselineResult.is_secret) {
                                    delete resultsArray[resultKey];
                                }
                            }
                        }
                    }
                }
            }
            if (Object.keys(resultsArray).length === 0) {
                console.info(chalk.green(`\nNo secrets found`));
                process.exitCode = 0;
            } else {
                process.exitCode = 1;
                console.log();
                for (const resultKey in resultsArray) {
                    const results = resultsArray[resultKey];
                    results.forEach((result) => {
                        console.error(chalk`Secret found {red.bold ${resultKey}}`);
                        console.error(chalk`      Secret Type: {red.bold ${result.type}}`);
                        console.error(chalk`      Secret Line number: {red.bold ${result.line_number}}`);
                        console.error(chalk`      Secret Hash: {red.bold ${result.hashed_secret}}\n`);
                    });
                }
            }
        }
    }
}
