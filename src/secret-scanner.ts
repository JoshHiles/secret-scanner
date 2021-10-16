#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

import Auditor from './Auditor';
import { Scanner } from './Scanner';
import GitHelper from './helpers/Git.helper';
import chalk from 'chalk';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function run() {
    yargs(hideBin(process.argv))
        .command(
            'scan',
            'Scans directories / scans committed files',
            (yargs: Argv) => {
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
            },
            async (argv) => {
                const scanner = new Scanner();
                if (argv.debug) {
                    process.env.DEBUG = '1';
                }
                if (argv.hook) {
                    GitHelper.getStagedChanges().then(async (files) => {
                        await scanner.Hook(files);
                    });
                } else {
                    console.info(`\nBeginning scan on:`);
                    console.info(chalk.blue.bold(`        ${argv.location}`));
                    await scanner.Scan(argv.location);
                }
            },
        )
        .command(
            'audit',
            'Audit the baseline file',
            (yargs: Argv) => {
                return yargs;
            },
            (argv) => {
                new Auditor().Audit();
            },
        )
        .strict()
        .version('0.0.0')
        .help('help')
        .parseAsync();
}
run();
