import chalk from 'chalk';
import { readdirSync } from 'fs';
import path, { parse } from 'path';

import Configuration from '../types/Configuration';
import Plugin from '../types/Plugin';

import FileHelper from './File.Helper';

export default class PluginHelper {
    FileHelper: FileHelper;
    constructor(fileHelper: FileHelper) {
        this.FileHelper = fileHelper;
    }

    LoadPlugins(configuration: Configuration): string[] {
        let plugins = readdirSync(path.resolve(__dirname, '../', 'plugins'));

        if (configuration.disable_plugins.length > 0) {
            plugins = plugins.filter(function (plugin) {
                return !configuration.disable_plugins.includes(parse(plugin).name);
            });
        }

        console.info(`Plugins loaded:`);
        plugins.forEach((plugin) => {
            console.info(chalk.blue.bold(`        ${parse(plugin).name}`));
        });

        return plugins;
    }

    async InitialisePlugin(pluginName: string, file: string): Promise<Plugin> {
        pluginName = parse(pluginName).name;

        const pluginImport = await import(path.resolve(__dirname, '../', 'plugins', pluginName));
        return new pluginImport.default(this.FileHelper.DetermineFileType(file));
    }
}
