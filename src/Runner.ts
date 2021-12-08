import { createHash } from 'crypto';
import { createInterface } from 'readline';
import { createReadStream } from 'fs';

import Plugin from './interfaces/Plugin';
import { Result, Results } from './interfaces/Baseline';
import PluginHelper from './helpers/Plugin.Helper';
import Configuration from './interfaces/Configuration';
import FileHelper from './helpers/File.Helper';

export default class Runner {
    PluginHelper: PluginHelper;
    FileHelper: FileHelper;

    constructor(pluginHelper: PluginHelper, fileHelper: FileHelper) {
        this.PluginHelper = pluginHelper;
        this.FileHelper = fileHelper;
    }

    async Run(files: string[], configuration: Configuration, plugins: Plugin[]): Promise<Results> {
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
                if (!this.LineIsExcluded(line, configuration)) {
                    for (const plugin of plugins) {
                        if (typeof plugin.Initialise === 'function') {
                            plugin.Initialise(this.FileHelper.DetermineFileType(file));
                        }
                        const runnerResults = this.RunLine(plugin, line, linenumber);
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

    private LineIsExcluded(line: string, configuration: Configuration): boolean {
        let needsIgnoring = false;
        configuration.exclude.lines.forEach((lineExcludeRegex: string) => {
            const lineToExcludeMatches = line.matchAll(new RegExp(lineExcludeRegex, 'g'));
            for (const lineToExcludeMatch of lineToExcludeMatches) {
                if (lineToExcludeMatch.length > 0) {
                    needsIgnoring = true;
                }
            }
        });
        return needsIgnoring;
    }

    private RunLine(plugin: Plugin, line: string, lineNumber: number): Result[] {
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
            const result: Result = { type: type, hashed_secret: hashedSecret, line_number: lineNumber };
            results.push(result);
        });
        return results;
    }
}
