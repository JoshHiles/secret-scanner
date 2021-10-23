/* eslint-disable @typescript-eslint/ban-ts-comment */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import mock from 'mock-fs';

const expect = chai.expect;
chai.use(sinonChai);

import Configuration from '../src/Configuration';
import Baseline from '../src/Baseline';
import Runner from '../src/Runner';
import path from 'path';
import PluginHelper from '../src/helpers/Plugin.helper';

describe.skip('Runner', async () => {
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.restore();
    });

    afterEach(() => {
        mock.restore();
    });

    describe('Run()', async () => {
        // it('should exclude line', async () => {
        //     const config: Configuration = {
        //         disable_plugins: [],
        //         exclude: {
        //             lines: [],
        //             files: [],
        //             secrets: [],
        //         },
        //     };
        //     const baseline: Baseline = {
        //         filters: [],
        //         generated_at: 'gen at',
        //         plugins: [],
        //         results: {
        //             hello: [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
        //         },
        //     };
        //     const plugins = ['AWS.ts'];
        //     mock({
        //         'file.js': 'asdas',
        //     });
        //     console.log(path.resolve(__dirname, '../', 'src/plugins', 'AWS.ts'));
        //     sandbox
        //         .stub(PluginHelper, 'LoadPlugin')
        //         .resolves(new pluginImport.default(FileHelper.DetermineFileType(file)));
        //     const result = await new Runner(config, baseline, plugins).Run(['file.js']);
        //     console.log(result);
        // });
    });
});
