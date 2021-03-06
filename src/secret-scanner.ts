#!/usr/bin/env node
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';

import GitHelper from './helpers/Git.Helper';
import Audit from './Audit';
import Scan from './Scan';
import Hook from './Hook';
import LoggingHelper from './helpers/Logging.Helper';
import ConfigurationHelper from './helpers/Configuration.Helper';
import BaselineHelper from './helpers/Baseline.Helper';
import PluginHelper from './helpers/Plugin.Helper';
import FileHelper from './helpers/File.Helper';
import ResultHelper from './helpers/Result.Helper';
import Runner from './Runner';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function run() {
    const loggingHelper = new LoggingHelper();
    const configurationHelper = new ConfigurationHelper();
    const baselineHelper = new BaselineHelper();
    const fileHelper = new FileHelper();
    const pluginHelper = new PluginHelper(fileHelper);
    const resultHelper = new ResultHelper();
    const runner = new Runner(pluginHelper);

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
                    // const hook =

                    const files = await new GitHelper().GetStagedChanges();
                    new Hook(
                        loggingHelper,
                        configurationHelper,
                        baselineHelper,
                        pluginHelper,
                        fileHelper,
                        resultHelper,
                        runner,
                    ).Hook(files);
                    console.log(files);
                } else {
                    await new Scan(
                        loggingHelper,
                        configurationHelper,
                        baselineHelper,
                        pluginHelper,
                        fileHelper,
                        runner,
                    ).Scan(argv.location);
                }
            },
        )
        .command(
            'audit',
            'Audit the baseline file',
            (yargs: Argv) => {
                return yargs;
            },
            () => {
                new Audit(baselineHelper, fileHelper).Audit();
            },
        )
        .strict()
        .version('0.0.0')
        .help('help')
        .parseAsync();
}
run();
