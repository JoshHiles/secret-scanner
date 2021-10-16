"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto_1 = require("crypto");
const readline_1 = require("readline");
const fs_1 = require("fs");
const Result_1 = (0, tslib_1.__importDefault)(require("./models/Result"));
const Plugin_helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Plugin.helper"));
class Runner {
    constructor(configuration, baseline, plugins) {
        this.Configuration = configuration;
        this.Baseline = baseline;
        this.Plugins = plugins;
    }
    async Run(files) {
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
                if (!this.LineIsExcluded(line)) {
                    for (const plugin of this.Plugins) {
                        const pluginClass = await Plugin_helper_1.default.LoadPlugin(plugin, file);
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
    LineIsExcluded(line) {
        let needsIgnoring = false;
        this.Configuration.exclude.lines.forEach((lineExcludeRegex) => {
            const lineToExcludeMatches = line.matchAll(new RegExp(lineExcludeRegex, 'g'));
            for (const lineToExcludeMatch of lineToExcludeMatches) {
                if (lineToExcludeMatch.length === 0) {
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
            const result = new Result_1.default(type, hashedSecret, lineNumber);
            results.push(result);
        });
        return results;
    }
}
exports.default = Runner;
