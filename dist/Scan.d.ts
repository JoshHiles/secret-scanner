import Baseline from './interfaces/Baseline';
import ConfigurationHelper from './helpers/Configuration.Helper';
import BaselineHelper from './helpers/Baseline.Helper';
import PluginHelper from './helpers/Plugin.Helper';
import FileHelper from './helpers/File.Helper';
import LoggingHelper from './helpers/Logging.Helper';
import Runner from './Runner';
export default class Scan {
    LoggingHelper: LoggingHelper;
    ConfigurationHelper: ConfigurationHelper;
    BaselineHelper: BaselineHelper;
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;
    Runner: Runner;
    constructor(loggingHelper: LoggingHelper, configurationHelper: ConfigurationHelper, baselineHelper: BaselineHelper, pluginHelper: PluginHelper, fileHelper: FileHelper, runner: Runner);
    Scan(directory: string): Promise<Baseline>;
}
