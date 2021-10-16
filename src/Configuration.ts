import { cosmiconfigSync } from 'cosmiconfig';

export default class Configuration {
    disable_plugins: string[];
    exclude: {
        lines: string[];
        files: string[];
        secrets: string[];
    };

    constructor() {
        const explorerSync = cosmiconfigSync('secret-scanner');
        const searchedFor = explorerSync.search();

        this.disable_plugins = [];
        this.exclude = {
            lines: [],
            files: [],
            secrets: [],
        };

        if (searchedFor != undefined) {
            this.disable_plugins = searchedFor.config.disable_plugins;
            this.exclude = {
                lines: searchedFor.config.exclude.lines,
                files: searchedFor.config.exclude.files,
                secrets: searchedFor.config.exclude.secrets,
            };
        }
    }
}
