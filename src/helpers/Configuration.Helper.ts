/* istanbul ignore file */
import { cosmiconfigSync } from 'cosmiconfig';
import Configuration from '../types/Configuration';

export default class ConfigurationHelper {
    LoadConfiguration(): Configuration {
        const explorerSync = cosmiconfigSync('secret-scanner');
        const comsiConfig = explorerSync.search();

        const configuration: Configuration = {
            disable_plugins: [],
            exclude: {
                lines: [],
                files: [],
                secrets: [],
            },
        };

        if (comsiConfig != undefined) {
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
