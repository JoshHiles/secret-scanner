import Configuration from '../interfaces/Configuration';
import Plugin from '../interfaces/Plugin';
import FileHelper from './File.Helper';
export default class PluginHelper {
    FileHelper: FileHelper;
    constructor(fileHelper: FileHelper);
    LoadPlugins(configuration: Configuration): Promise<Plugin[]>;
    InitialisePlugin(pluginPath: string): Promise<Plugin>;
}
