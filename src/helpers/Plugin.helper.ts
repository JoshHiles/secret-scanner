import chalk from 'chalk';
import { readdirSync } from 'fs';
import { parse } from 'path';

import Configuration from '../Configuration';
import IPlugin from '../models/IPlugin';
import FileHelper from './File.helper';

export default class PluginHelper {
    Configuration: Configuration;

    constructor(configuration: Configuration) {
        this.Configuration = configuration;
    }

    LoadPlugins(dirName = __dirname): string[] {
        const plugins = readdirSync(`${dirName}\\..\\plugins`);
        const configuration = this.Configuration;

        if (configuration.disable_plugins.length > 0) {
            return plugins.filter(function (plugin) {
                return !configuration.disable_plugins.includes(parse(plugin).name);
            });
        }

        console.info(`Plugins loaded:`);
        plugins.forEach((plugin) => {
            console.info(chalk.blue.bold(`        ${parse(plugin).name}`));
        });

        return plugins;
    }

    static async LoadPlugin(pluginName: string, file: string): Promise<IPlugin> {
        pluginName = parse(pluginName).name;
        const pluginImport = await import(`${__dirname}\\..\\plugins/${pluginName}`);
        return new pluginImport.default(FileHelper.DetermineFileType(file));
    }
}
