// import { readdirSync } from 'fs';
// import path, { parse } from 'path';
import Configuration from '../src/types/Configuration';

import Runner from '../src/Runner';
import MockHelper from './MockHelper';

import path, { parse } from 'path';
import fs, { createReadStream, readdirSync } from 'fs';
import readline, { createInterface } from 'readline';
import { Result } from '../src/types/Baseline';
import Plugin from '../src/types/Plugin';

// jest.mock('readline');

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
            disable_plugins: [],
            exclude: {
                files: [],
                lines: [],
                secrets: [],
            },
        };

        const mockHelper = new MockHelper();
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);

        const runner = new Runner(mockPluginHelper);

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

        const result = await runner.Run(['file1.txt'], configuration, ['plugin1.ts']);

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
            ],
        });
    });

    describe('LineIsExcluded', () => {
        test('true', () => {
            const configuration: Configuration = {
                disable_plugins: [],
                exclude: {
                    files: [],
                    lines: ['line1', 'line\\d'],
                    secrets: [],
                },
            };

            const mockHelper = new MockHelper();
            const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = new Runner(mockPluginHelper).LineIsExcluded('line1', configuration);

            expect(result).toBeTruthy;
        });

        test('false', () => {
            const configuration: Configuration = {
                disable_plugins: [],
                exclude: {
                    files: [],
                    lines: [],
                    secrets: [],
                },
            };

            const mockHelper = new MockHelper();
            const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = new Runner(mockPluginHelper).LineIsExcluded('line1', configuration);

            expect(result).toBeFalsy;
        });
    });

    test('RunLine', () => {
        const mockHelper = new MockHelper();
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);

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
