"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
class LoggingHelper {
    LogNoSecretsFound() {
        console.info(chalk_1.default.green(`\nNo secrets found`));
    }
    LogSecretsFound(resultsArray) {
        for (const resultKey in resultsArray) {
            const results = resultsArray[resultKey];
            results.forEach((result) => {
                console.error((0, chalk_1.default) `Secret found {red.bold ${resultKey}}`);
                console.error((0, chalk_1.default) `\tSecret Type: {red.bold ${result.type}}`);
                console.error((0, chalk_1.default) `\tSecret Line number: {red.bold ${result.line_number}}`);
                console.error((0, chalk_1.default) `\tSecret Hash: {red.bold ${result.hashed_secret}}\n`);
            });
        }
    }
    LogBeginScan(location) {
        console.info(`\nBeginning scan on:`);
        console.info(chalk_1.default.blue.bold(`\t${location}`));
    }
}
exports.default = LoggingHelper;
