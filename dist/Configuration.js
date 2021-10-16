"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
class Configuration {
    constructor() {
        const explorerSync = (0, cosmiconfig_1.cosmiconfigSync)('secret-scanner');
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
exports.default = Configuration;
