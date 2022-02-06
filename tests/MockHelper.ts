/* istanbul ignore file */
import { instance, mock, when } from 'ts-mockito';
import BaselineHelper from '../src/helpers/Baseline.Helper';
import ConfigurationHelper from '../src/helpers/Configuration.Helper';
import PluginHelper from '../src/helpers/Plugin.Helper';
import Configuration from '../src/interfaces/Configuration';
import Runner from '../src/Runner';
import Baseline, { Results } from '../src/interfaces/Baseline';
import LoggingHelper from '../src/helpers/Logging.Helper';
import FileHelper from '../src/helpers/File.Helper';
import ResultHelper from '../src/helpers/Result.Helper';
import { FileType } from '../src/interfaces/FileType.enum';
import Plugin from '../src/interfaces/Plugin';

export default class MockHelper {
    SetupMockLoggingHelper(): { instance: LoggingHelper; mock: LoggingHelper } {
        const mocked: LoggingHelper = mock(LoggingHelper);
        when(mocked.LogBeginScan).thenReturn(() => {
            return;
        });
        when(mocked.LogNoSecretsFound).thenReturn(() => {
            return;
        });
        when(mocked.LogSecretsFound).thenReturn(() => {
            return;
        });
        return {
            instance: instance(mocked),
            mock: mocked,
        };
    }

    SetupMockConfigurationHelper(testConfiguration: Configuration): ConfigurationHelper {
        const mocked: ConfigurationHelper = mock(ConfigurationHelper);
        when(mocked.LoadConfiguration()).thenReturn(testConfiguration);
        return instance(mocked);
    }

    SetupMockBaselineHelper(testBaseline: Baseline, testBaselineWithResults: Baseline): BaselineHelper {
        const mocked: BaselineHelper = mock(BaselineHelper);
        when(mocked.LoadBaseline()).thenReturn(testBaseline);
        when(mocked.SaveBaselineToFile).thenReturn(() => {
            return;
        });
        when(mocked.SetGeneratedAt).thenReturn(() => testBaselineWithResults);
        return instance(mocked);
    }

    SetupMockPluginHelper(): PluginHelper {
        const mocked: PluginHelper = mock(PluginHelper);

        const testPlugin: Plugin = {
            Name: 'test',
            Regexes: [new RegExp('hello', 'g')],
            ExampleMatches: ['example_match'],
        };
        const testPlugins: Plugin[] = [testPlugin];

        when(mocked.LoadPlugins).thenReturn(() => Promise.resolve(testPlugins));

        return instance(mocked);
    }

    SetupMockFileHelper(): FileHelper {
        const mocked: FileHelper = mock(FileHelper);
        when(mocked.GetFiles).thenReturn(() => ['file1.md']);
        when(mocked.DetermineFileType).thenReturn(() => FileType.JAVASCRIPT);
        return instance(mocked);
    }

    SetupResultHelper(testResults: Results): { instance: ResultHelper; mock: ResultHelper } {
        const mocked: ResultHelper = mock(ResultHelper);
        when(mocked.RemoveNonSecretResultsMatchedInBaseline).thenReturn(() => testResults);
        return { instance: instance(mocked), mock: mocked };
    }

    SetupMockRunner(testResults: Results): Runner {
        const mocked: Runner = mock(Runner);
        when(mocked.Run).thenReturn(() => Promise.resolve(testResults));
        return instance(mocked);
    }
}
