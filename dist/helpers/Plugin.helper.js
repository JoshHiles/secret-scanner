"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_1 = require("fs");
const path_1 = (0, tslib_1.__importStar)(require("path"));
const File_helper_1 = (0, tslib_1.__importDefault)(require("./File.helper"));
class PluginHelper {
    constructor(configuration) {
        this.Configuration = configuration;
    }
    LoadPlugins() {
        let plugins = (0, fs_1.readdirSync)(path_1.default.resolve(__dirname, '../', 'plugins'));
        const configuration = this.Configuration;
        /* istanbul ignore else */
        if (configuration.disable_plugins.length > 0) {
            plugins = plugins.filter(function (plugin) {
                return !configuration.disable_plugins.includes((0, path_1.parse)(plugin).name);
            });
        }
        console.info(`Plugins loaded:`);
        plugins.forEach((plugin) => {
            console.info(chalk_1.default.blue.bold(`        ${(0, path_1.parse)(plugin).name}`));
        });
        return plugins;
    }
    static async LoadPlugin(pluginName, file) {
        pluginName = (0, path_1.parse)(pluginName).name;
        const pluginImport = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(path_1.default.resolve(__dirname, '../', 'plugins', pluginName))));
        return new pluginImport.default(File_helper_1.default.DetermineFileType(file));
    }
}
exports.default = PluginHelper;
