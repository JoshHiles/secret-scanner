"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const readline_1 = require("readline");
const fs_1 = require("fs");
class Runner {
    constructor(pluginHelper) {
        this.PluginHelper = pluginHelper;
    }
    async Run(files, configuration, plugins) {
        const results = {};
        for await (const file of files) {
            const filePath = file.replace(/\\/g, '/');
            const rl = (0, readline_1.createInterface)({
                input: (0, fs_1.createReadStream)(file),
                crlfDelay: Infinity,
            });
            let lineResults = [];
            let linenumber = 1;
            for await (const line of rl) {
                if (!this.LineIsExcluded(line, configuration)) {
                    for (const plugin of plugins) {
                        const pluginClass = await this.PluginHelper.InitialisePlugin(plugin, file);
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
    LineIsExcluded(line, configuration) {
        let needsIgnoring = false;
        configuration.exclude.lines.forEach((lineExcludeRegex) => {
            const lineToExcludeMatches = line.matchAll(new RegExp(lineExcludeRegex, 'g'));
            for (const lineToExcludeMatch of lineToExcludeMatches) {
                if (lineToExcludeMatch.length > 0) {
                    needsIgnoring = true;
                }
            }
        });
        return needsIgnoring;
    }
    RunLine(plugin, line, lineNumber) {
        const matches = [];
        plugin.Regexes.forEach((regex) => {
            const lineMatches = line.matchAll(regex);
            for (const lineMatch of lineMatches) {
                matches.push(lineMatch);
            }
        });
        const results = new Array();
        matches.forEach((match) => {
            const type = plugin.Name;
            const hashedSecret = (0, crypto_1.createHash)('sha256').update(match[0]).digest('base64');
            const result = { type: type, hashed_secret: hashedSecret, line_number: lineNumber };
            results.push(result);
        });
        return results;
    }
}
exports.default = Runner;
