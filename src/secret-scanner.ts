#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { GetStagedChanges } from './helpers/Git.Helper';

import { Audit } from './Audit';
import { Scan } from './Scan';
import { Hook } from './Hook';

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
                if (argv.debug) {
                    process.env.DEBUG = '1';
                }
                if (argv.hook) {
                    GetStagedChanges().then(async (files) => {
                        await Hook(files);
                    });
                } else {
                    await Scan(argv.location);
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
                Audit();
            },
        )
        .strict()
        .version('0.0.0')
        .help('help')
        .parseAsync();
}
run();
