import chalk from 'chalk';

jest.mock('fs');
import { readFileSync, writeFileSync } from 'fs';

import { DateTime } from 'luxon';

import BaselineHelper from '../../src/helpers/Baseline.Helper';

import Baseline from '../../src/interfaces/Baseline';

describe('Baseline Helper', () => {
    const baselineFile = 'secret-scanner.baseline.json';
    const testBaseline: Baseline = {
        filters: [],
        generated_at: '',
        plugins: [],
        results: {},
    };

    describe('LoadBaseline', () => {
        test('LoadBaseline', () => {
            jest.mocked(readFileSync as jest.Mock).mockImplementation(() => {
                return Buffer.from(JSON.stringify(testBaseline));
            });

            const result = new BaselineHelper().LoadBaseline();

            expect(result).toEqual(testBaseline);
        });

        test('CreateBaselineFile', () => {
            jest.mocked(readFileSync as jest.Mock).mockImplementation(() => {
                throw new Error('no baseline');
            });
            jest.mocked(writeFileSync as jest.Mock).mockImplementation(() => {
                return;
            });
            console.info = jest.fn();

            const result = new BaselineHelper().LoadBaseline();

            testBaseline.generated_at = DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
            expect(result).toEqual(testBaseline);
            expect(console.info).toBeCalledWith(chalk.red(`${baselineFile} not found in ${process.cwd()}`));
            expect(console.info).toBeCalledWith(chalk.green(`Created ${baselineFile}`));
        });
    });

    describe('SaveBaselineToFile', () => {
        test('SaveBaselineToFile', () => {
            jest.mocked(writeFileSync as jest.Mock).mockImplementation(() => {
                return;
            });
            console.info = jest.fn();

            new BaselineHelper().SaveBaselineToFile(testBaseline);

            expect(console.info).toBeCalledWith(chalk`\nSaved baseline: {green ${process.cwd()}/${baselineFile}}`);
        });

        test('SaveBaselineToFile error', () => {
            console.error = jest.fn();
            jest.mocked(writeFileSync as jest.Mock).mockImplementation(() => {
                throw new Error('failed to save');
            });

            new BaselineHelper().SaveBaselineToFile(testBaseline);

            expect(console.error).toBeCalledWith(chalk.red(`Failed to save baseline file`));
            expect(console.error).toBeCalledWith(chalk.red('Error: failed to save'));
        });
    });

    test('SetGeneratedAt', () => {
        const result = new BaselineHelper().SetGeneratedAt(testBaseline);
        testBaseline.generated_at = DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
        expect(result).toEqual(testBaseline);
    });
});
