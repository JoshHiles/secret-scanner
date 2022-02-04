"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const cosmiconfig_1 = require("cosmiconfig");
class ConfigurationHelper {
    LoadConfiguration() {
        const explorerSync = (0, cosmiconfig_1.cosmiconfigSync)('secret-scanner');
        const comsiConfig = explorerSync.search();
        const configuration = {
            plugins: [],
            disable_plugins: [],
            exclude: {
                lines: [],
                files: [],
                secrets: [],
            },
        };
        if (comsiConfig != undefined) {
            configuration.plugins = comsiConfig.config.plugins;
            configuration.disable_plugins = comsiConfig.config.disable_plugins;
            configuration.exclude = {
                lines: comsiConfig.config.exclude.lines,
                files: comsiConfig.config.exclude.files,
                secrets: comsiConfig.config.exclude.secrets,
            };
        }
        return configuration;
    }
}
exports.default = ConfigurationHelper;
