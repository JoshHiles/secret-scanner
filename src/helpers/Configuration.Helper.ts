/* istanbul ignore file */
import { cosmiconfigSync } from 'cosmiconfig';
import Configuration from '../interfaces/Configuration';

export default class ConfigurationHelper {
    LoadConfiguration(): Configuration {
        const explorerSync = cosmiconfigSync('secret-scanner');
        const comsiConfig = explorerSync.search();

        const configuration: Configuration = {
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
