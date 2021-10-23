/* eslint-disable @typescript-eslint/ban-ts-comment */

import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import mock from 'mock-fs';

const expect = chai.expect;
chai.use(sinonChai);

import { CosmiconfigResult } from 'cosmiconfig/dist/types';
import Configuration from '../../src/Configuration';
import PluginHelper from '../../src/helpers/Plugin.helper';
import chalk from 'chalk';

describe('Plugin helper', async () => {
    let sandbox;

    let pluginHelper: PluginHelper;

    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(Configuration, 'LoadCosmiConfig').returns({
            config: {
                disable_plugins: ['disabled plugin'],
                exclude: {
                    lines: ['excluded line'],
                    files: ['excluded file'],
                    secrets: ['excluded secret'],
                },
            },
            filepath: '',
        } as CosmiconfigResult);
        const config = new Configuration();
        pluginHelper = new PluginHelper(config);
    });

    beforeEach(() => {
        sandbox.restore();
    });

    afterEach(() => {
        mock.restore();
    });

    it('constructs', () => {
        // @ts-ignore
        expect(pluginHelper.Configuration.disable_plugins).to.deep.equal(['disabled plugin']);
        // @ts-ignore
        expect(pluginHelper.Configuration.exclude.lines).to.deep.equal(['excluded line']);
        // @ts-ignore
        expect(pluginHelper.Configuration.exclude.files).to.deep.equal(['excluded file']);
        // @ts-ignore
        expect(pluginHelper.Configuration.exclude.secrets).to.deep.equal(['excluded secret']);
    });

    describe('LoadPlugins()', () => {
        it('should load plugins', () => {
            const infoSpy = sandbox.spy(console, 'info');

            mock({
                'src/plugins': {
                    'plugin1.ts': '',
                },
            });

            const result = pluginHelper.LoadPlugins();
            expect(infoSpy.firstCall.calledWith('Plugins loaded:')).to.be.true;
            expect(infoSpy.secondCall.calledWith(chalk.blue.bold(`        plugin1`))).to.be.true;

            expect(result).to.deep.equal(['plugin1.ts']);
        });

        it('should load plugins & remove disabled plugins', () => {
            pluginHelper.Configuration.disable_plugins = ['plugin1'];
            const infoSpy = sandbox.spy(console, 'info');

            mock({
                'src/plugins': {
                    'plugin1.ts': '',
                    'plugin2.ts': '',
                },
            });

            const result = pluginHelper.LoadPlugins();
            expect(infoSpy.firstCall.calledWith('Plugins loaded:')).to.be.true;
            expect(infoSpy.secondCall.calledWith(chalk.blue.bold(`        plugin2`))).to.be.true;

            expect(result).to.deep.equal(['plugin2.ts']);
        });
    });

    describe('LoadPlugin', async () => {
        it('should load plugin', async () => {
            const result = await PluginHelper.LoadPlugin('AWS', 'test.md');

            expect(result.Name).to.not.be.empty;
            expect(result.Regexes.length > 0).to.be.true;
            expect(result.ExampleMatches).to.not.be.empty;
        });
    });
});
