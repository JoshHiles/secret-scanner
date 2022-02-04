"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_1 = require("fs");
const path_1 = (0, tslib_1.__importStar)(require("path"));
const ts_import_1 = require("ts-import");
class PluginHelper {
    constructor(fileHelper) {
        this.FileHelper = fileHelper;
    }
    async LoadPlugins(configuration) {
        let plugins = (0, fs_1.readdirSync)(path_1.default.resolve(__dirname, '../', 'plugins'));
        if (configuration.plugins.length > 0) {
            for (const userPlugin of configuration.plugins) {
                plugins.push(path_1.default.resolve(userPlugin));
            }
        }
        if (configuration.disable_plugins.length > 0) {
            plugins = plugins.filter(function (plugin) {
                return !configuration.disable_plugins.includes((0, path_1.parse)(plugin).name);
            });
        }
        const pluginClasses = [];
        for (const plugin of plugins) {
            const initialisedPlugin = await this.InitialisePlugin(plugin);
            pluginClasses.push(initialisedPlugin);
        }
        console.info(`Plugins loaded:`);
        pluginClasses.forEach((plugin) => {
            console.info(chalk_1.default.blue.bold(`      ${plugin.Name}`));
        });
        return pluginClasses;
    }
    /* istanbul ignore next */
    async InitialisePlugin(pluginPath) {
        const pluginName = (0, path_1.parse)(pluginPath).name;
        const pluginExt = (0, path_1.parse)(pluginPath).ext;
        let pluginClass;
        // default plugins come through as 'AWS.ts' for example
        // where as user defined plugins come through as 'D:\\whatever\\custom-plugin.ts'
        // seems hacky to use includes('\\') but it works
        if (pluginPath.includes('\\')) {
            if (pluginExt === '.js') {
                pluginClass = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(pluginPath)));
            }
            else if (pluginExt === '.ts') {
                pluginClass = await ts_import_1.tsImport.compile(pluginPath);
            }
            else {
                console.error(chalk_1.default.red(`${pluginName} HAS to be either .js or .ts`));
            }
        }
        else {
            pluginClass = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require(path_1.default.resolve(__dirname, '../', 'plugins', pluginName))));
        }
        return new pluginClass.default();
    }
}
exports.default = PluginHelper;
