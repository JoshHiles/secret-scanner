import BaselineHelper from "./helpers/Baseline.Helper.js";
import ConfigurationHelper from "./helpers/Configuration.Helper.js";
import FileHelper from "./helpers/File.Helper.js";
import LoggingHelper from "./helpers/Logging.Helper.js";
import PluginHelper from "./helpers/Plugin.Helper.js";
import ResultHelper from "./helpers/Result.Helper.js";
import Runner from "./Runner.js";

export default class Hook {
	LoggingHelper: LoggingHelper;
	ConfigurationHelper: ConfigurationHelper;
	BaselineHelper: BaselineHelper;
	PluginHelper: PluginHelper;
	FileHelper: FileHelper;
	ResultHelper: ResultHelper;

	Runner: Runner;

	constructor(
		loggingHelper: LoggingHelper,
		configurationHelper: ConfigurationHelper,
		baselineHelper: BaselineHelper,
		pluginHelper: PluginHelper,
		fileHelper: FileHelper,
		resultHelper: ResultHelper,
		runner: Runner,
	) {
		this.LoggingHelper = loggingHelper;
		this.ConfigurationHelper = configurationHelper;
		this.BaselineHelper = baselineHelper;
		this.PluginHelper = pluginHelper;
		this.FileHelper = fileHelper;
		this.ResultHelper = resultHelper;
		this.Runner = runner;
	}

	async Hook(files: string[]): Promise<void> {
		const configuration = this.ConfigurationHelper.LoadConfiguration();
		const baseline = this.BaselineHelper.LoadBaseline();
		const plugins = await this.PluginHelper.LoadPlugins(configuration);

		files = this.FileHelper.GetFiles(files, configuration);
		let resultsArray = await this.Runner.Run(files, configuration, plugins);

		if (Object.keys(resultsArray).length === 0) {
			this.LoggingHelper.LogNoSecretsFound();
			process.exitCode = 0;
			return;
		} else {
			resultsArray = this.ResultHelper.RemoveNonSecretResultsMatchedInBaseline(resultsArray, baseline);

			if (Object.keys(resultsArray).length === 0) {
				this.LoggingHelper.LogNoSecretsFound();
				process.exitCode = 0;
				return;
			} else {
				this.LoggingHelper.LogSecretsFound(resultsArray);
				process.exitCode = 1;

				return;
			}
		}
	}
}
