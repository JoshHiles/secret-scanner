"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
chalk_1.default.level = 3;
class Scan {
    constructor(loggingHelper, configurationHelper, baselineHelper, pluginHelper, fileHelper, runner) {
        this.LoggingHelper = loggingHelper;
        this.ConfigurationHelper = configurationHelper;
        this.BaselineHelper = baselineHelper;
        this.PluginHelper = pluginHelper;
        this.FileHelper = fileHelper;
        this.Runner = runner;
    }
    async Scan(directory) {
        this.LoggingHelper.LogBeginScan(directory);
        const configuration = this.ConfigurationHelper.LoadConfiguration();
        let baseline = this.BaselineHelper.LoadBaseline();
        // const plugins = await this.PluginHelper.LoadPlugins(configuration);
        const plugins = await this.PluginHelper.LoadPlugins(configuration);
        const files = this.FileHelper.GetFiles([directory], configuration);
        baseline.results = await this.Runner.Run(files, configuration, plugins);
        baseline = this.BaselineHelper.SetGeneratedAt(baseline);
        const pluginsNormalised = [];
        plugins.forEach((plugin) => {
            pluginsNormalised.push(plugin.Name);
        });
        baseline.plugins = pluginsNormalised;
        this.BaselineHelper.SaveBaselineToFile(baseline);
        return baseline;
    }
}
exports.default = Scan;
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
