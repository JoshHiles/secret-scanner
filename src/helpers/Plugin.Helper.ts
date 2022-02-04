import chalk from 'chalk';
import { readdirSync } from 'fs';
import path, { parse } from 'path';
import { tsImport } from 'ts-import';

import Configuration from '../interfaces/Configuration';
import Plugin from '../interfaces/Plugin';

import FileHelper from './File.Helper';

export default class PluginHelper {
    FileHelper: FileHelper;
    constructor(fileHelper: FileHelper) {
        this.FileHelper = fileHelper;
    }

    async LoadPlugins(configuration: Configuration): Promise<Plugin[]> {
        let plugins = readdirSync(path.resolve(__dirname, '../', 'plugins'));

        if (configuration.plugins.length > 0) {
            for (const userPlugin of configuration.plugins) {
                plugins.push(path.resolve(userPlugin));
            }
        }

        if (configuration.disable_plugins.length > 0) {
            plugins = plugins.filter(function (plugin) {
                return !configuration.disable_plugins.includes(parse(plugin).name);
            });
        }

        const pluginClasses: Plugin[] = [];
        for (const plugin of plugins) {
            const initialisedPlugin = await this.InitialisePlugin(plugin);
            pluginClasses.push(initialisedPlugin);
        }

        console.info(`Plugins loaded:`);
        pluginClasses.forEach((plugin) => {
            console.info(chalk.blue.bold(`      ${plugin.Name}`));
        });

        return pluginClasses;
    }

    /* istanbul ignore next */
    async InitialisePlugin(pluginPath: string): Promise<Plugin> {
        const pluginName = parse(pluginPath).name;
        const pluginExt = parse(pluginPath).ext;

        let pluginClass;
        // default plugins come through as 'AWS.ts' for example
        // where as user defined plugins come through as 'D:\\whatever\\custom-plugin.ts'
        // seems hacky to use includes('\\') but it works
        if (pluginPath.includes('\\')) {
            if (pluginExt === '.js') {
                pluginClass = await import(pluginPath);
            } else if (pluginExt === '.ts') {
                pluginClass = await tsImport.compile(pluginPath);
            } else {
                console.error(chalk.red(`${pluginName} HAS to be either .js or .ts`));
            }
        } else {
            pluginClass = await import(path.resolve(__dirname, '../', 'plugins', pluginName));
        }

        return new pluginClass.default();
    }
}
