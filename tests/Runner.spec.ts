import Configuration from '../src/interfaces/Configuration';

import Runner from '../src/Runner';
import MockHelper from './MockHelper';

import path from 'path';
import fs, { createReadStream } from 'fs';
import readline, { createInterface } from 'readline';
import { Result } from '../src/interfaces/Baseline';
import Plugin from '../src/interfaces/Plugin';

describe('Runner', () => {
    test('Run', async () => {
        const testFileStream = createReadStream(path.resolve(__dirname, 'test.txt'));
        const testFileInterface = createInterface({
            input: testFileStream,
            crlfDelay: Infinity,
        });

        jest.spyOn(fs, 'createReadStream').mockReturnValue(testFileStream);
        jest.spyOn(readline, 'createInterface').mockReturnValue(testFileInterface);

        const configuration: Configuration = {
            plugins: [],
            disable_plugins: [],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockPluginHelper = mockHelper.SetupMockPluginHelper();
        const mockFileHelper = mockHelper.SetupMockFileHelper();

        const runner = new Runner(mockPluginHelper, mockFileHelper);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn<any, any>(runner, 'LineIsExcluded').mockReturnValue(false);

        const testResults: Result[] = [
            {
                hashed_secret: 'hash',
                line_number: 1,
                type: 'type',
            },
        ];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn<any, any>(runner, 'RunLine').mockReturnValue(testResults);

        const testPlugin: Plugin = {
            Name: 'test',
            Regexes: [new RegExp('hello', 'g')],
            ExampleMatches: ['example_match'],
        };
        const testPlugin2: Plugin = {
            Name: 'test2',
            Regexes: [new RegExp('test', 'g')],
            ExampleMatches: ['test'],
            Initialise: () => {
                return;
            },
        };
        const testPlugins: Plugin[] = [testPlugin, testPlugin2];

        const result = await runner.Run(['file1.txt'], configuration, testPlugins);

        expect(result).toEqual({
            'file1.txt': [
                {
                    hashed_secret: 'hash',
                    line_number: 1,
                    type: 'type',
                },
                {
                    hashed_secret: 'hash',
                    line_number: 1,
                    type: 'type',
                },
                {
                    hashed_secret: 'hash',
                    line_number: 1,
                    type: 'type',
                },
                {
                    hashed_secret: 'hash',
                    line_number: 1,
                    type: 'type',
                },
            ],
        });
    });

    describe('LineIsExcluded', () => {
        test('true', () => {
            const configuration: Configuration = {
                plugins: [],
                disable_plugins: [],
                exclude: {
                    files: [],
                    lines: ['line1', 'line\\d'],
                    secrets: [],
                },
            };

            const mockHelper = new MockHelper();
            const mockPluginHelper = mockHelper.SetupMockPluginHelper();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = new Runner(mockPluginHelper).LineIsExcluded('line1', configuration);

            expect(result).toBeTruthy;
        });

        test('false', () => {
            const configuration: Configuration = {
                plugins: [],
                disable_plugins: [],
                exclude: {
                    files: [],
                    lines: [],
                    secrets: [],
                },
            };

            const mockHelper = new MockHelper();
            const mockPluginHelper = mockHelper.SetupMockPluginHelper();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = new Runner(mockPluginHelper).LineIsExcluded('line1', configuration);

            expect(result).toBeFalsy;
        });
    });

    test('RunLine', () => {
        const mockHelper = new MockHelper();
        const mockPluginHelper = mockHelper.SetupMockPluginHelper();

        const testPlugin: Plugin = {
            Name: 'test',
            Regexes: [new RegExp('line\\d', 'g')],
            ExampleMatches: ['example'],
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const result = new Runner(mockPluginHelper).RunLine(testPlugin, 'line1', 1);

        expect(result).toEqual([
            {
                type: 'test',
                hashed_secret: 'gVdQpFh7m2EBLq4k57b4XFU9yiGiQNrfp5BOxzmGDps=',
                line_number: 1,
            },
        ]);
    });
});
