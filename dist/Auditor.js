"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const inquirer_1 = require("inquirer");
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
const Baseline_1 = (0, tslib_1.__importDefault)(require("./Baseline"));
const File_helper_1 = (0, tslib_1.__importDefault)(require("./helpers/File.helper"));
chalk_1.default.level = 3;
class Auditor {
    constructor() {
        this.baseline = new Baseline_1.default();
    }
    async Audit(baseline) {
        if (baseline) {
            this.baseline = baseline;
        }
        for (const resultPath in this.baseline.results) {
            const results = this.baseline.results[resultPath];
            console.info(chalk_1.default.green(`Auditing file: ${resultPath}`));
            for (const result of results) {
                console.info(chalk_1.default.yellow(`Line number: ${result.line_number}`));
                console.info(chalk_1.default.red(`Secret to audit: ${await File_helper_1.default.GetSecret(resultPath, result.line_number)}`));
                const userInput = await (0, inquirer_1.prompt)([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Should this secret be committed to this repository?',
                    },
                ]);
                console.info(userInput);
                result.is_secret = userInput.confirm;
                (0, clear_1.default)();
            }
        }
        Baseline_1.default.SaveBaselineToFile(this.baseline);
        return;
    }
}
exports.default = Auditor;
