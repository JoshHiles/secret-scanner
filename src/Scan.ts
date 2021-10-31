import { parse } from 'path';
import chalk from 'chalk';
import { StopWatch } from 'stopwatch-node';
import { Duration } from 'luxon';

import Baseline from './types/Basline';

import ConfigurationHelper from './helpers/Configuration.Helper';
import BaselineHelper from './helpers/Baseline.Helper';
import PluginHelper from './helpers/Plugin.Helper';
import FileHelper from './helpers/File.Helper';
import LoggingHelper from './helpers/Logging.Helper';

import Runner from './Runner';

chalk.level = 3;
export default class Scan {
    LoggingHelper: LoggingHelper;
    ConfigurationHelper: ConfigurationHelper;
    BaselineHelper: BaselineHelper;
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;

    Runner: Runner;

    constructor(
        loggingHelper: LoggingHelper,
        configurationHelper: ConfigurationHelper,
        baselineHelper: BaselineHelper,
        pluginHelper: PluginHelper,
        fileHelper: FileHelper,
        runner: Runner,
    ) {
        this.LoggingHelper = loggingHelper;
        this.ConfigurationHelper = configurationHelper;
        this.BaselineHelper = baselineHelper;
        this.PluginHelper = pluginHelper;
        this.FileHelper = fileHelper;

        this.Runner = runner;
    }

    async Scan(directory: string): Promise<Baseline> {
        this.LoggingHelper.LogBeginScan(directory);
        const configuration = this.ConfigurationHelper.LoadConfiguration();
        let baseline = this.BaselineHelper.LoadBaseline();
        const plugins = this.PluginHelper.LoadPlugins(configuration);

        const files = this.FileHelper.GetFiles([directory], configuration);

        baseline.results = await this.Runner.Run(files, configuration, plugins);

        baseline = this.BaselineHelper.SetGeneratedAt(baseline);

        const pluginsNormalised: string[] = [];
        plugins.forEach((plugin) => {
            pluginsNormalised.push(parse(plugin).name);
        });

        baseline.plugins = pluginsNormalised;
        this.BaselineHelper.SaveBaselineToFile(baseline);
        return baseline;
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
