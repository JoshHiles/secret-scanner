import { cosmiconfigSync } from 'cosmiconfig';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';

export default class Configuration {
    disable_plugins: string[];
    exclude: {
        lines: string[];
        files: string[];
        secrets: string[];
    };

    constructor() {
        const comsiConfig = Configuration.LoadCosmiConfig();

        this.disable_plugins = [];
        this.exclude = {
            lines: [],
            files: [],
            secrets: [],
        };

        if (comsiConfig != undefined) {
            this.disable_plugins = comsiConfig.config.disable_plugins;
            this.exclude = {
                lines: comsiConfig.config.exclude.lines,
                files: comsiConfig.config.exclude.files,
                secrets: comsiConfig.config.exclude.secrets,
            };
        }
    }

    /* istanbul ignore next */
    private static LoadCosmiConfig(): CosmiconfigResult {
        const explorerSync = cosmiconfigSync('secret-scanner');
        return explorerSync.search();
    }
}
