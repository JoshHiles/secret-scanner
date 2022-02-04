import Plugin from './interfaces/Plugin';
import { Results } from './interfaces/Baseline';
import PluginHelper from './helpers/Plugin.Helper';
import Configuration from './interfaces/Configuration';
import FileHelper from './helpers/File.Helper';
export default class Runner {
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;
    constructor(pluginHelper: PluginHelper, fileHelper: FileHelper);
    Run(files: string[], configuration: Configuration, plugins: Plugin[]): Promise<Results>;
    private LineIsExcluded;
    private RunLine;
}
