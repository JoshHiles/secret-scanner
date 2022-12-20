import { parse } from "path";
import chalk from "chalk";
import { StopWatch } from "stopwatch-node";
import { Duration } from "luxon";

import Baseline from "./interfaces/Baseline.js";

import ConfigurationHelper from "./helpers/Configuration.Helper.js";
import BaselineHelper from "./helpers/Baseline.Helper.js";
import PluginHelper from "./helpers/Plugin.Helper.js";
import FileHelper from "./helpers/File.Helper.js";
import LoggingHelper from "./helpers/Logging.Helper.js";

import Runner from "./Runner.js";

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
		// const plugins = await this.PluginHelper.LoadPlugins(configuration);
		const plugins = await this.PluginHelper.LoadPlugins(configuration);

		const files = this.FileHelper.GetFiles([directory], configuration);

		baseline.results = await this.Runner.Run(files, configuration, plugins);

		baseline = this.BaselineHelper.SetGeneratedAt(baseline);

		const pluginsNormalised: string[] = [];
		plugins.forEach((plugin) => {
			pluginsNormalised.push(plugin.Name);
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
