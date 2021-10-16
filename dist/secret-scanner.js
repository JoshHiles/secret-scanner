#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
const helpers_1 = require("yargs/helpers");
const Auditor_1 = (0, tslib_1.__importDefault)(require("./Auditor"));
const Scanner_1 = require("./Scanner");
const Git_helper_1 = (0, tslib_1.__importDefault)(require("./helpers/Git.helper"));
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function run() {
    (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
        .command('scan', 'Scans directories / scans committed files', (yargs) => {
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
        const scanner = new Scanner_1.Scanner();
        if (argv.debug) {
            process.env.DEBUG = '1';
        }
        if (argv.hook) {
            Git_helper_1.default.getStagedChanges().then(async (files) => {
                await scanner.Hook(files);
            });
        }
        else {
            console.info(`\nBeginning scan on:`);
            console.info(chalk_1.default.blue.bold(`        ${argv.location}`));
            await scanner.Scan(argv.location);
        }
    })
        .command('audit', 'Audit the baseline file', (yargs) => {
        return yargs;
    }, (argv) => {
        new Auditor_1.default().Audit();
    })
        .strict()
        .version('0.0.0')
        .help('help')
        .parseAsync();
}
exports.run = run;
run();
