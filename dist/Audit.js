"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const inquirer_1 = require("inquirer");
const clear_1 = (0, tslib_1.__importDefault)(require("clear"));
chalk_1.default.level = 3;
class Audit {
    constructor(baselineHelper, fileHelper) {
        this.BaselineHelper = baselineHelper;
        this.FileHelper = fileHelper;
    }
    async Audit() {
        const baseline = this.BaselineHelper.LoadBaseline();
        if (baseline.results !== {}) {
            for (const resultPath in baseline.results) {
                const results = baseline.results[resultPath];
                console.info(chalk_1.default.green(`Auditing file: ${resultPath}`));
                for (const result of results) {
                    console.info(chalk_1.default.yellow(`Line number: ${result.line_number}`));
                    console.info(chalk_1.default.red(`Secret to audit: ${await this.FileHelper.GetSecret(resultPath, result.line_number)}`));
                    const userInput = await (0, inquirer_1.prompt)([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: 'Should this secret be committed to this repository?',
                        },
                    ]);
                    console.info(userInput);
                    result.is_secret = !userInput.confirm;
                    (0, clear_1.default)();
                }
            }
            this.BaselineHelper.SaveBaselineToFile(baseline);
        }
    }
}
exports.default = Audit;
