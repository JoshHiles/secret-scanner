import { createHash } from 'crypto';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

import Configuration from './Configuration';
import IPlugin from './models/IPlugin';
import Baseline from './Baseline';
import Result from './models/Result';
import PluginHelper from './helpers/Plugin.helper';
import Results from './models/Results';

export default class Runner {
    Configuration: Configuration;
    Baseline: Baseline;
    Plugins: string[];

    constructor(configuration: Configuration, baseline: Baseline, plugins: string[]) {
        this.Configuration = configuration;
        this.Baseline = baseline;
        this.Plugins = plugins;
    }

    async Run(files: string[]): Promise<Results> {
        const results: Results = {};
        for await (const file of files) {
            const filePath = file.replace(/\\/g, '/');
            const rl = createInterface({
                input: createReadStream(file),
                crlfDelay: Infinity,
            });

            let lineResults: Result[] = [];
            let linenumber = 1;
            for await (const line of rl) {
                if (!this.LineIsExcluded(line)) {
                    for (const plugin of this.Plugins) {
                        const pluginClass = await PluginHelper.LoadPlugin(plugin, file);
                        const runnerResults = this.RunLine(pluginClass, line, linenumber);
                        if (runnerResults.length > 0) {
                            lineResults = lineResults.concat(runnerResults);
                        }
                    }
                }

                linenumber++;
            }
            if (lineResults.length > 0) {
                results[filePath] = lineResults;
            }
        }
        return results;
    }

    private LineIsExcluded(line: string): boolean {
        let needsIgnoring = false;
        this.Configuration.exclude.lines.forEach((lineExcludeRegex: string) => {
            const lineToExcludeMatches = line.matchAll(new RegExp(lineExcludeRegex, 'g'));
            for (const lineToExcludeMatch of lineToExcludeMatches) {
                if (lineToExcludeMatch.length === 0) {
                    needsIgnoring = true;
                }
            }
        });
        return needsIgnoring;
    }

    private RunLine(plugin: IPlugin, line: string, lineNumber: number): Result[] {
        const matches: RegExpMatchArray[] = [];
        plugin.Regexes.forEach((regex) => {
            const lineMatches = line.matchAll(regex);
            for (const lineMatch of lineMatches) {
                matches.push(lineMatch);
            }
        });

        const results = new Array<Result>();
        matches.forEach((match) => {
            const type = plugin.Name;
            const hashedSecret = createHash('sha256').update(match[0]).digest('base64');
            const result = new Result(type, hashedSecret, lineNumber);
            results.push(result);
        });
        return results;
    }
}
