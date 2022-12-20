import MockHelper from '../MockHelper';
import mock from 'mock-fs';

import PluginHelper from '../../src/helpers/Plugin.Helper';
import Configuration from '../../src/interfaces/Configuration';
import Plugin from '../../src/interfaces/Plugin';
import chalk from 'chalk';

describe('Plugin Helper', () => {
    afterEach(() => {
        mock.restore();
    });

    test('LoadPlugins', async () => {
        const testConfiguration: Configuration = {
            plugins: [],
            disable_plugins: [],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        mock({
            'src/plugins': {
                'plugin1.ts': '',
                'plugin2.ts': '',
            },
        });
        const pluginHelper = new PluginHelper(mockFileHelper);
        const testPlugin: Plugin = { Name: 'plugin1', Regexes: [], ExampleMatches: [] };
        const testPlugin2: Plugin = { Name: 'plugin2', Regexes: [], ExampleMatches: [] };
        jest.spyOn(pluginHelper, 'InitialisePlugin')
            .mockResolvedValueOnce(testPlugin)
            .mockResolvedValueOnce(testPlugin2);

        console.info = jest.fn();

        const result = await pluginHelper.LoadPlugins(testConfiguration);

        expect(result).toEqual([testPlugin, testPlugin2]);
        expect(console.info).toHaveBeenCalledWith('Plugins loaded:');
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      plugin1`));
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      plugin2`));
    });

    test.only('LoadPlugins with user plugins', async () => {
        const testConfiguration: Configuration = {
            plugins: ['./user-plugin.ts'],
            disable_plugins: [],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        mock({
            'src/plugins': {
                'plugin1.ts': '',
                'plugin2.ts': '',
            },
        });
        const pluginHelper = new PluginHelper(mockFileHelper);
        const testPlugin: Plugin = { Name: 'plugin1', Regexes: [], ExampleMatches: [] };
        const testPlugin2: Plugin = { Name: 'plugin2', Regexes: [], ExampleMatches: [] };
        const userPlugin: Plugin = { Name: 'user-plugin', Regexes: [], ExampleMatches: [] };

        jest.spyOn(pluginHelper, 'InitialisePlugin')
            .mockResolvedValueOnce(testPlugin)
            .mockResolvedValueOnce(testPlugin2)
            .mockResolvedValueOnce(userPlugin);

        console.info = jest.fn();

        const result = await pluginHelper.LoadPlugins(testConfiguration);

        expect(result).toEqual([testPlugin, testPlugin2, userPlugin]);
        expect(console.info).toHaveBeenCalledWith('Plugins loaded:');
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      plugin1`));
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      plugin2`));
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      user-plugin`));
    });

    test('LoadPlugins should disable user-plugin & plugin2', async () => {
        const testConfiguration: Configuration = {
            plugins: ['./user-plugin.ts'],
            disable_plugins: ['user-plugin', 'plugin2'],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        mock({
            'src/plugins': {
                'plugin1.ts': '',
                'plugin2.ts': '',
            },
        });

        const pluginHelper = new PluginHelper(mockFileHelper);
        const testPlugin: Plugin = { Name: 'plugin1', Regexes: [], ExampleMatches: [] };
        jest.spyOn(pluginHelper, 'InitialisePlugin').mockResolvedValueOnce(testPlugin);

        console.info = jest.fn();

        const result = await pluginHelper.LoadPlugins(testConfiguration);

        expect(result).toEqual([testPlugin]);
        expect(console.info).toHaveBeenCalledWith('Plugins loaded:');
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`      plugin1`));
    });
});
