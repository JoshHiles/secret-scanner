import { parse } from 'path';
import chalk from 'chalk';
import { StopWatch } from 'stopwatch-node';
import { Duration } from 'luxon';

import Baseline from './Baseline';
import FileHelper from './helpers/File.helper';
import Configuration from './Configuration';
import PluginHelper from './helpers/Plugin.helper';
import Runner from './Runner';
import Results from './models/Results';

chalk.level = 3;

export default class Scanner {
    async Scan(directory: string): Promise<Baseline> {
        const configuration = new Configuration();
        let baseline = new Baseline();
        const plugins = new PluginHelper(configuration).LoadPlugins();

        const files = new FileHelper(configuration).GetFiles([directory]);

        baseline.results = await new Runner(configuration, baseline, plugins).Run(files);

        baseline = Baseline.SetGeneratedAt(baseline);

        const pluginsNormalised: string[] = [];
        plugins.forEach((plugin) => {
            pluginsNormalised.push(parse(plugin).name);
        });

        baseline.plugins = pluginsNormalised;
        Baseline.SaveBaselineToFile(baseline);
        return baseline;
    }

    async Hook(files: string[]): Promise<void> {
        const configuration = new Configuration();
        const baseline = new Baseline();
        const plugins = new PluginHelper(configuration).LoadPlugins();
        console.log(plugins);

        files = new FileHelper(configuration).GetFiles(files);
        let resultsArray = await new Runner(configuration, baseline, plugins).Run(files);

        if (Object.keys(resultsArray).length === 0) {
            this.NoSecretsFound();
            return;
        } else {
            resultsArray = this.DeleteResultsWhichAreNotSecretsInBaseline(resultsArray, baseline);

            if (Object.keys(resultsArray).length === 0) {
                this.NoSecretsFound();
                return;
            } else {
                this.SecretsFound(resultsArray);
                return;
            }
        }
    }

    private NoSecretsFound(): void {
        console.info(chalk.green(`\nNo secrets found`));
        process.exitCode = 0;
    }

    private SecretsFound(resultsArray: Results): void {
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

    private DeleteResultsWhichAreNotSecretsInBaseline(resultsArray: Results, baseline: Baseline): Results {
        for (const resultKey in resultsArray) {
            const resultArray = resultsArray[resultKey];

            if (resultKey in baseline.results) {
                const foundInBaseline = baseline.results[resultKey];

                for (const result of resultArray) {
                    for (const baselineResult of foundInBaseline) {
                        const typeMatch = baselineResult.type === result.type;
                        const lineMatch = baselineResult.line_number === result.line_number;
                        const hashMatch = baselineResult.hashed_secret === result.hashed_secret;
                        if (typeMatch && lineMatch && hashMatch) {
                            if (!baselineResult.is_secret) {
                                const index = resultsArray[resultKey].indexOf(result, 0);
                                if (index > -1) {
                                    resultsArray[resultKey].splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

        return resultsArray;
    }
}

// const stopwatch = new StopWatch('Scanner');
// stopwatch.start('Get Files');
// stopwatch.stop();
// const totalTime = stopwatch.getTotalTime();
// const timeTaken = Duration.fromMillis(totalTime).toFormat("mm' minutes' ss' seconds' SSS' milliseconds'");
// console.info(`\nTook:`);
// console.info(chalk.blue.bold(`${timeTaken}`));

// if (process.env.DEBUG == '1') {
//     console.log();
//     stopwatch.prettyPrint();
// }
