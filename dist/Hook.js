"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hook {
    constructor(loggingHelper, configurationHelper, baselineHelper, pluginHelper, fileHelper, resultHelper, runner) {
        this.LoggingHelper = loggingHelper;
        this.ConfigurationHelper = configurationHelper;
        this.BaselineHelper = baselineHelper;
        this.PluginHelper = pluginHelper;
        this.FileHelper = fileHelper;
        this.ResultHelper = resultHelper;
        this.Runner = runner;
    }
    async Hook(files) {
        const configuration = this.ConfigurationHelper.LoadConfiguration();
        const baseline = this.BaselineHelper.LoadBaseline();
        const plugins = await this.PluginHelper.LoadPlugins(configuration);
        files = this.FileHelper.GetFiles(files, configuration);
        let resultsArray = await this.Runner.Run(files, configuration, plugins);
        if (Object.keys(resultsArray).length === 0) {
            this.LoggingHelper.LogNoSecretsFound();
            process.exitCode = 0;
            return;
        }
        else {
            resultsArray = this.ResultHelper.RemoveNonSecretResultsMatchedInBaseline(resultsArray, baseline);
            if (Object.keys(resultsArray).length === 0) {
                this.LoggingHelper.LogNoSecretsFound();
                process.exitCode = 0;
                return;
            }
            else {
                this.LoggingHelper.LogSecretsFound(resultsArray);
                process.exitCode = 1;
                return;
            }
        }
    }
}
exports.default = Hook;
