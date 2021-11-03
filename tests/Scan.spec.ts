import Scan from '../src/Scan';
import Baseline, { Results } from '../src/types/Baseline';
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
