import Scan from '../src/Scan';
import Baseline, { Results } from '../src/types/Basline';
import Configuration from '../src/types/Configuration';

import { DateTime } from 'luxon';
import MockHelper from './MockHelper';

describe('Scan', () => {
    const testConfiguration: Configuration = {
        disable_plugins: [],
        exclude: {
            files: [],
            lines: [],
            secrets: [],
        },
    };

    const testBaseline: Baseline = {
        filters: [],
        generated_at: '',
        plugins: [],
        results: {},
    };

    const testResults: Results = { 'test.js': [{ hashed_secret: 'asd', line_number: 2, type: 'asd' }] };

    const testBaselineWithResults = testBaseline;
    testBaselineWithResults.results = testResults;

    test('Scan', async () => {
        const mockHelper = new MockHelper();

        const mockLoggingHelper = mockHelper.SetupMockLoggingHelper();
        const mockConfigurationHelper = mockHelper.SetupMockConfigurationHelper(testConfiguration);
        const mockBaselineHelper = mockHelper.SetupMockBaselineHelper(testBaseline, testBaselineWithResults);
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);
        const mockFileHelper = mockHelper.SetupMockFileHelper();
        const mockRunner = mockHelper.SetupMockRunner(testResults);

        const result = await new Scan(
            mockLoggingHelper.instance,
            mockConfigurationHelper,
            mockBaselineHelper,
            mockPluginHelper,
            mockFileHelper,
            mockRunner,
        ).Scan('/dir');

        const expected = testBaselineWithResults;
        expected.generated_at = DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
        expect(result).toEqual(expected);
    });
});

// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import chai from 'chai';
// import sinonChai from 'sinon-chai';
// import sinon from 'sinon';
// import mock from 'mock-fs';
// // import sinon, { stubConstructor } from 'ts-sinon';

// const expect = chai.expect;
// chai.use(sinonChai);

// import Scanner from '../src/Scanner';
// import FileHelper from '../src/helpers/File.helper';
// import Runner from '../src/Runner';
// import Results from '../src/models/Results';
// import Baseline from '../src/Baseline';
// import PluginHelper from '../src/helpers/Plugin.helper';
// import Configuration from '../src/Configuration';
// import path from 'path';
// import { CosmiconfigResult } from 'cosmiconfig/dist/types';
// import chalk from 'chalk';

// describe.only('Scanner', async () => {
//     let sandbox;

//     before(() => {
//         sandbox = sinon.createSandbox();
//     });

//     beforeEach(() => {
//         sandbox.restore();
//     });

//     afterEach(() => {
//         mock.restore();
//     });

//     describe('Scan()', async () => {
//         // it('should scan', async () => {});
//         // it('should scan', async () => {
//         //     const testStub = stubConstructor(Scanner);
//         //     testStub.Configuration = {
//         //         disable_plugins: ['disabled plugin'],
//         //         exclude: {
//         //             lines: ['excluded line'],
//         //             files: ['excluded file'],
//         //             secrets: ['excluded secret'],
//         //         },
//         //     } as Configuration;
//         //     testStub.Baseline = {
//         //         generated_at: 'generated',
//         //         plugins: ['plugin'],
//         //         filters: ['filter'],
//         //         results: {
//         //             hello: [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
//         //         },
//         //     } as Baseline;
//         //     testStub.PluginHelper;
//         //     console.log(testStub);
//         //     // sandbox.stub(Baseline.prototype, 'constructor').returns();
//         //     // sandbox.stub(Scanner.prototype, 'constructor').returns();
//         //     // const scannerStub = sandbox.stub(Scanner);
//         //     // // const fileStub = sandbox.stub(FileHelper.prototype, 'constructor').returns();
//         //     // // scannerStub.FileHelper = fileStub;
//         //     // // console.log(scannerStub.FileHelper);
//         //     // sandbox
//         //     //     .stub(FileHelper.prototype, 'GetFiles')
//         //     //     .returns(['directory/some-file.txt', 'directory/another-file.txt']);
//         //     // const runnerResults: Results = {
//         //     //     'directory/some-file.txt': [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
//         //     // };
//         //     // sandbox.stub(Runner.prototype, 'Run').returns(runnerResults);
//         //     // sandbox.stub(Baseline, 'SetGeneratedAt').returns(runnerResults);
//         //     // sandbox.stub(Baseline, 'SaveBaselineToFile').returns();
//         //     // const result = await new scannerStub().Scan('directory');
//         //     // expect(result).to.deep.equal({
//         //     //     generated_at: 'generated',
//         //     //     plugins: ['plugin'],
//         //     //     filters: ['filter'],
//         //     //     results: {
//         //     //         hello: [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
//         //     //     },
//         //     // });
//         // });
//         // it('should scan', async () => {
//         //     mock({
//         //         directory: {
//         //             'some-file.txt': '',
//         //             'another-file.txt': '',
//         //         },
//         //     });
//         //     const configuration: Configuration = {
//         //         disable_plugins: ['disabled plugin'],
//         //         exclude: {
//         //             lines: ['excluded line'],
//         //             files: ['excluded file'],
//         //             secrets: ['excluded secret'],
//         //         },
//         //     };
//         //     sandbox.stub(Configuration.prototype, 'constructor').returns(configuration);
//         //     pluginHelper = new PluginHelper(configuration);
//         //     sandbox.stub(pluginHelper, 'LoadPlugins').returns(['plugin1.ts']);
//         //     fileHelper = new FileHelper(configuration);
//         //     sandbox.stub(fileHelper, 'GetFiles').returns(['directory/some-file.txt', 'directory/another-file.txt']);
//         //     const testBaseline: Baseline = {
//         //         generated_at: 'generated',
//         //         plugins: ['plugin'],
//         //         filters: ['filter'],
//         //         results: {
//         //             hello: [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
//         //         },
//         //     };
//         //     sandbox.stub(Baseline.prototype, 'constructor').returns(testBaseline);
//         //     scanner = new Scanner();
//         // });
//     });

//     describe.only('Hook()', () => {
//         it('should call NoSecretsFound()', () => {
//             sandbox.stub(Configuration);
//             sandbox.stub(Baseline);
//             sandbox.stub(PluginHelper, 'LoadPlugins').returns(['asda']);
//         });

//         // it('should call NoSecretsFound() when DeleteResultsWhichAreNotSecretsInBaseline()', () => {});

//         // it('should call SecretsFound() ', () => {});
//     });

//     it('should do NoSecretsFound()', () => {
//         const infoSpy = sandbox.spy(console, 'info');

//         // @ts-ignore
//         new Scanner().NoSecretsFound();

//         expect(infoSpy.firstCall.calledWith(chalk.green(`\nNo secrets found`))).to.be.true;
//     });

//     it('should do SecretsFound()', () => {
//         const errorSpy = sandbox.spy(console, 'error');
//         const resultsArray: Results = {
//             'file1.js': [
//                 {
//                     type: 'type',
//                     hashed_secret: 'hash',
//                     line_number: 1,
//                 },
//                 {
//                     type: 'type2',
//                     hashed_secret: 'hash2',
//                     line_number: 2,
//                 },
//             ],
//             'file2.js': [
//                 {
//                     type: 'type',
//                     hashed_secret: 'hash',
//                     line_number: 1,
//                 },
//             ],
//         };

//         // @ts-ignore
//         new Scanner().SecretsFound(resultsArray);

//         expect(errorSpy.getCall(0).calledWith(chalk`Secret found {red.bold file1.js}`)).to.be.true;
//         expect(errorSpy.getCall(1).calledWith(chalk`      Secret Type: {red.bold type}`)).to.be.true;
//         expect(errorSpy.getCall(2).calledWith(chalk`      Secret Line number: {red.bold 1}`)).to.be.true;
//         expect(errorSpy.getCall(3).calledWith(chalk`      Secret Hash: {red.bold hash}\n`)).to.be.true;

//         expect(errorSpy.getCall(4).calledWith(chalk`Secret found {red.bold file1.js}`)).to.be.true;
//         expect(errorSpy.getCall(5).calledWith(chalk`      Secret Type: {red.bold type2}`)).to.be.true;
//         expect(errorSpy.getCall(6).calledWith(chalk`      Secret Line number: {red.bold 2}`)).to.be.true;
//         expect(errorSpy.getCall(7).calledWith(chalk`      Secret Hash: {red.bold hash2}\n`)).to.be.true;

//         expect(errorSpy.getCall(8).calledWith(chalk`Secret found {red.bold file2.js}`)).to.be.true;
//         expect(errorSpy.getCall(9).calledWith(chalk`      Secret Type: {red.bold type}`)).to.be.true;
//         expect(errorSpy.getCall(10).calledWith(chalk`      Secret Line number: {red.bold 1}`)).to.be.true;
//         expect(errorSpy.getCall(11).calledWith(chalk`      Secret Hash: {red.bold hash}\n`)).to.be.true;
//     });

//     it('should DeleteResultsWhichAreNotSecretsInBaseline()', () => {
//         const baseline: Baseline = {
//             filters: [],
//             generated_at: '',
//             plugins: [],
//             results: {
//                 'file1.js': [
//                     {
//                         type: 'type',
//                         hashed_secret: 'hash',
//                         line_number: 1,
//                         is_secret: false,
//                     },
//                     {
//                         type: 'type2',
//                         hashed_secret: 'hash2',
//                         line_number: 2,
//                         is_secret: true,
//                     },
//                 ],
//             },
//         };

//         const resultsArray: Results = {
//             'file1.js': [
//                 {
//                     type: 'type',
//                     hashed_secret: 'hash',
//                     line_number: 1,
//                 },
//                 {
//                     type: 'type2',
//                     hashed_secret: 'hash2',
//                     line_number: 2,
//                 },
//             ],
//             'file2.js': [
//                 {
//                     type: 'type',
//                     hashed_secret: 'hash',
//                     line_number: 1,
//                 },
//             ],
//         };

//         const expectedResultsArray: Results = {
//             'file1.js': [
//                 {
//                     type: 'type2',
//                     hashed_secret: 'hash2',
//                     line_number: 2,
//                 },
//             ],
//             'file2.js': [
//                 {
//                     type: 'type',
//                     hashed_secret: 'hash',
//                     line_number: 1,
//                 },
//             ],
//         };

//         // @ts-ignore
//         const result = new Scanner().DeleteResultsWhichAreNotSecretsInBaseline(resultsArray, baseline);

//         expect(result).to.deep.equal(expectedResultsArray);
//     });
// });
