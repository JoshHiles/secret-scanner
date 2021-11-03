import { mocked } from 'ts-jest/utils';
// import mock from 'mock-fs';
import MockHelper from '../MockHelper';

jest.mock('fs');
import { readdirSync } from 'fs';

import PluginHelper from '../../src/helpers/Plugin.Helper';
import Configuration from '../../src/types/Configuration';
import chalk from 'chalk';

import path from 'path';

describe('Plugin Helper', () => {
    // afterEach(() => {
    //     mock.restore();
    // });

    test('LoadPlugins', () => {
        const testConfiguration: Configuration = {
            disable_plugins: [],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        mocked(readdirSync as jest.Mock).mockImplementation(() => {
            return ['plugin1.ts', 'plugin2.ts'];
        });
        console.info = jest.fn();

        const result = new PluginHelper(mockFileHelper).LoadPlugins(testConfiguration);

        expect(result).toEqual(['plugin1.ts', 'plugin2.ts']);
        expect(console.info).toHaveBeenCalledWith('Plugins loaded:');
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`        plugin1`));
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`        plugin2`));
    });

    test('LoadPlugins removes disabled plugins', () => {
        const testConfiguration: Configuration = {
            disable_plugins: ['plugin1'],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        mocked(readdirSync as jest.Mock).mockImplementation(() => {
            return ['plugin1.ts', 'plugin2.ts'];
        });
        console.info = jest.fn();

        const result = new PluginHelper(mockFileHelper).LoadPlugins(testConfiguration);

        expect(result).toEqual(['plugin2.ts']);
        expect(console.info).toHaveBeenCalledWith('Plugins loaded:');
        expect(console.info).toHaveBeenCalledWith(chalk.blue.bold(`        plugin2`));
    });

    test('InitialisePlugin', async () => {
        const mockHelper = new MockHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        const result = await new PluginHelper(mockFileHelper).InitialisePlugin('AWS.ts', 'test.js');

        expect(result.Name).toEqual('AWS');
    });
});
