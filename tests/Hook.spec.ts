import Hook from '../src/Hook';
import Baseline, { Results } from '../src/types/Basline';
import Configuration from '../src/types/Configuration';

import { DateTime } from 'luxon';
import MockHelper from './MockHelper';
import { spy, verify } from 'ts-mockito';

describe('Hook', () => {
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

    const testResults: Results = {};

    const testBaselineWithResults = testBaseline;
    testBaselineWithResults.results = testResults;

    test('Hook no secrets', async () => {
        const mockHelper = new MockHelper();

        const mockLoggingHelper = mockHelper.SetupMockLoggingHelper();
        const mockConfigurationHelper = mockHelper.SetupMockConfigurationHelper(testConfiguration);
        const mockBaselineHelper = mockHelper.SetupMockBaselineHelper(testBaseline, testBaselineWithResults);
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);
        const mockFileHelper = mockHelper.SetupMockFileHelper();
        const mockResultHelper = mockHelper.SetupResultHelper(testResults);
        const mockRunner = mockHelper.SetupMockRunner(testResults);

        await new Hook(
            mockLoggingHelper.instance,
            mockConfigurationHelper,
            mockBaselineHelper,
            mockPluginHelper,
            mockFileHelper,
            mockResultHelper.instance,
            mockRunner,
        ).Hook(['file1.md']);

        verify(mockLoggingHelper.mock.LogNoSecretsFound).once();
        verify(mockResultHelper.mock.RemoveNonSecretResultsMatchedInBaseline).never();
    });

    test('Hook no secrets from baseline', async () => {
        const oneTestResult = {
            'file1.md': [{ hashed_secret: 'hash', line_number: 1, type: 'type', is_secret: false }],
        };

        const mockHelper = new MockHelper();

        const mockLoggingHelper = mockHelper.SetupMockLoggingHelper();
        const mockConfigurationHelper = mockHelper.SetupMockConfigurationHelper(testConfiguration);
        const mockBaselineHelper = mockHelper.SetupMockBaselineHelper(testBaseline, testBaselineWithResults);
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);
        const mockFileHelper = mockHelper.SetupMockFileHelper();
        const mockResultHelper = mockHelper.SetupResultHelper(testResults);
        const mockRunner = mockHelper.SetupMockRunner(oneTestResult);

        await new Hook(
            mockLoggingHelper.instance,
            mockConfigurationHelper,
            mockBaselineHelper,
            mockPluginHelper,
            mockFileHelper,
            mockResultHelper.instance,
            mockRunner,
        ).Hook(['file1.md']);

        verify(mockResultHelper.mock.RemoveNonSecretResultsMatchedInBaseline).once();
        verify(mockLoggingHelper.mock.LogNoSecretsFound).once();
    });

    test('Hook secrets found', async () => {
        const oneTestResult = {
            'file1.md': [{ hashed_secret: 'hash', line_number: 1, type: 'type', is_secret: false }],
        };

        const mockHelper = new MockHelper();

        const mockLoggingHelper = mockHelper.SetupMockLoggingHelper();
        const mockConfigurationHelper = mockHelper.SetupMockConfigurationHelper(testConfiguration);
        const mockBaselineHelper = mockHelper.SetupMockBaselineHelper(testBaseline, testBaselineWithResults);
        const mockPluginHelper = mockHelper.SetupMockPluginHelper(['plugin1.ts']);
        const mockFileHelper = mockHelper.SetupMockFileHelper();
        const mockResultHelper = mockHelper.SetupResultHelper(oneTestResult);
        const mockRunner = mockHelper.SetupMockRunner(oneTestResult);

        await new Hook(
            mockLoggingHelper.instance,
            mockConfigurationHelper,
            mockBaselineHelper,
            mockPluginHelper,
            mockFileHelper,
            mockResultHelper.instance,
            mockRunner,
        ).Hook(['file1.md']);

        verify(mockResultHelper.mock.RemoveNonSecretResultsMatchedInBaseline).once();
        verify(mockLoggingHelper.mock.LogSecretsFound).once();
    });
});
