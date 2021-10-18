"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const stopwatch_node_1 = require("stopwatch-node");
const Baseline_1 = (0, tslib_1.__importDefault)(require("./Baseline"));
const File_helper_1 = (0, tslib_1.__importDefault)(require("./helpers/File.helper"));
const Configuration_1 = (0, tslib_1.__importDefault)(require("./Configuration"));
const Plugin_helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Plugin.helper"));
const Runner_1 = (0, tslib_1.__importDefault)(require("./Runner"));
const luxon_1 = require("luxon");
chalk_1.default.level = 3;
class Scanner {
    constructor() {
        this.Configuration = new Configuration_1.default();
        this.PluginHelper = new Plugin_helper_1.default(this.Configuration);
        this.FileHelper = new File_helper_1.default(this.Configuration);
        this.Baseline = new Baseline_1.default();
        this.Plugins = this.PluginHelper.LoadPlugins();
        this.Stopwatch = new stopwatch_node_1.StopWatch('Scanner');
        this.Runner = new Runner_1.default(this.Configuration, this.Baseline, this.Plugins);
    }
    async Scan(directory) {
        this.Stopwatch.start('Get Files');
        const files = this.FileHelper.GetFiles([directory]);
        this.Stopwatch.stop();
        this.Stopwatch.start('Scan Files');
        this.Baseline.results = await this.Runner.Run(files);
        this.Stopwatch.stop();
        const totalTime = this.Stopwatch.getTotalTime();
        const timeTaken = luxon_1.Duration.fromMillis(totalTime).toFormat("mm' minutes' ss' seconds' SSS' milliseconds'");
        console.info((0, chalk_1.default) `\nTook: {blue.bold ${timeTaken}}`);
        if (process.env.DEBUG == '1') {
            console.log();
            this.Stopwatch.prettyPrint();
        }
        this.Baseline = Baseline_1.default.SetGeneratedAt(this.Baseline);
        const pluginsNormalised = [];
        this.Plugins.forEach((plugin) => {
            pluginsNormalised.push((0, path_1.parse)(plugin).name);
        });
        this.Baseline.plugins = pluginsNormalised;
        Baseline_1.default.SaveBaselineToFile(this.Baseline);
        return this.Baseline;
    }
    async Hook(files) {
        this.Stopwatch.start('Scan Files');
        this.FileHelper.GetFiles(files);
        const resultsArray = await this.Runner.Run(files);
        this.Stopwatch.stop();
        const totalTime = this.Stopwatch.getTotalTime();
        const timeTaken = luxon_1.Duration.fromMillis(totalTime).toFormat("mm' minutes' ss' seconds' SSS' milliseconds'");
        console.info((0, chalk_1.default) `\nTook: {blue.bold ${timeTaken}`);
        if (process.env.DEBUG == '1') {
            console.log();
            this.Stopwatch.prettyPrint();
        }
        if (Object.keys(resultsArray).length === 0) {
            console.info(chalk_1.default.green(`\nNo secrets found`));
            process.exitCode = 0;
        }
        else {
            for (const resultKey in resultsArray) {
                const resultArray = resultsArray[resultKey];
                if (resultKey in this.Baseline.results) {
                    const foundInBaseline = this.Baseline.results[resultKey];
                    for (const result of resultArray) {
                        for (const baselineResult of foundInBaseline) {
                            const typeMatch = baselineResult.type === result.type;
                            const lineMatch = baselineResult.line_number === result.line_number;
                            const hashMatch = baselineResult.hashed_secret === result.hashed_secret;
                            if (typeMatch && lineMatch && hashMatch) {
                                if (!baselineResult.is_secret) {
                                    delete resultsArray[resultKey];
                                }
                            }
                        }
                    }
                }
            }
            if (Object.keys(resultsArray).length === 0) {
                console.info(chalk_1.default.green(`\nNo secrets found`));
                process.exitCode = 0;
            }
            else {
                process.exitCode = 1;
                console.log();
                for (const resultKey in resultsArray) {
                    const results = resultsArray[resultKey];
                    results.forEach((result) => {
                        console.error((0, chalk_1.default) `Secret found {red.bold ${resultKey}}`);
                        console.error((0, chalk_1.default) `      Secret Type: {red.bold ${result.type}}`);
                        console.error((0, chalk_1.default) `      Secret Line number: {red.bold ${result.line_number}}`);
                        console.error((0, chalk_1.default) `      Secret Hash: {red.bold ${result.hashed_secret}}\n`);
                    });
                }
            }
        }
    }
}
exports.default = Scanner;
