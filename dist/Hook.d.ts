import BaselineHelper from './helpers/Baseline.Helper';
import ConfigurationHelper from './helpers/Configuration.Helper';
import FileHelper from './helpers/File.Helper';
import LoggingHelper from './helpers/Logging.Helper';
import PluginHelper from './helpers/Plugin.Helper';
import ResultHelper from './helpers/Result.Helper';
import Runner from './Runner';
export default class Hook {
    LoggingHelper: LoggingHelper;
    ConfigurationHelper: ConfigurationHelper;
    BaselineHelper: BaselineHelper;
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;
    ResultHelper: ResultHelper;
    Runner: Runner;
    constructor(loggingHelper: LoggingHelper, configurationHelper: ConfigurationHelper, baselineHelper: BaselineHelper, pluginHelper: PluginHelper, fileHelper: FileHelper, resultHelper: ResultHelper, runner: Runner);
    Hook(files: string[]): Promise<void>;
}
