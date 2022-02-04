#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const helpers_1 = require("yargs/helpers");
const Git_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Git.Helper"));
const Audit_1 = (0, tslib_1.__importDefault)(require("./Audit"));
const Scan_1 = (0, tslib_1.__importDefault)(require("./Scan"));
const Hook_1 = (0, tslib_1.__importDefault)(require("./Hook"));
const Logging_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Logging.Helper"));
const Configuration_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Configuration.Helper"));
const Baseline_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Baseline.Helper"));
const Plugin_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Plugin.Helper"));
const File_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/File.Helper"));
const Result_Helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Result.Helper"));
const Runner_1 = (0, tslib_1.__importDefault)(require("./Runner"));
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function run() {
    const loggingHelper = new Logging_Helper_1.default();
    const configurationHelper = new Configuration_Helper_1.default();
    const baselineHelper = new Baseline_Helper_1.default();
    const fileHelper = new File_Helper_1.default();
    const pluginHelper = new Plugin_Helper_1.default(fileHelper);
    const resultHelper = new Result_Helper_1.default();
    const runner = new Runner_1.default(pluginHelper, fileHelper);
    (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .command('scan', 'Scans directories / committed files', (yargs) => {
        return yargs
            .option('hook', {
            alias: 'h',
            describe: 'Used for pre-hooks',
        })
            .option('location', {
            alias: 'l',
            describe: 'Location to scan using glob pattern, default is current working dir',
            default: `${process.cwd().replace(/\\/g, '/')}/**`,
        })
            .option('debug', {
            alias: 'd',
        });
    }, async (argv) => {
        if (argv.debug) {
            process.env.DEBUG = '1';
        }
        if (argv.hook) {
            const files = await new Git_Helper_1.default().GetStagedChanges();
            new Hook_1.default(loggingHelper, configurationHelper, baselineHelper, pluginHelper, fileHelper, resultHelper, runner).Hook(files);
        }
        else {
            await new Scan_1.default(loggingHelper, configurationHelper, baselineHelper, pluginHelper, fileHelper, runner).Scan(argv.location);
        }
    })
        .command('audit', 'Audit the baseline file', (yargs) => {
        return yargs;
    }, () => {
        new Audit_1.default(baselineHelper, fileHelper).Audit();
    })
        .strict()
        .version('0.0.0')
        .help('help')
        .parseAsync();
}
exports.run = run;
run();
