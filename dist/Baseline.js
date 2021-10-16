"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const fs_1 = require("fs");
const luxon_1 = require("luxon");
chalk_1.default.level = 3;
class Baseline {
    constructor() {
        const baseline = Baseline.GetBaselineFile();
        this.generated_at = baseline.generated_at;
        this.plugins = baseline.plugins;
        this.filters = baseline.filters;
        this.results = baseline.results;
    }
    static GetBaselineFile() {
        try {
            const baselineRAW = (0, fs_1.readFileSync)(`${process.cwd()}/${this.baselineFile}`);
            const baseline = JSON.parse(baselineRAW.toString());
            return baseline;
        }
        catch (error) {
            console.info(chalk_1.default.red(`${this.baselineFile} not found in ${process.cwd()}`));
            return this.CreateBaselineFile();
        }
    }
    static CreateBaselineFile() {
        const baseline = {
            generated_at: luxon_1.DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ'),
            plugins: [],
            filters: [],
            results: {},
        };
        (0, fs_1.writeFileSync)(`${process.cwd()}/${this.baselineFile}`, JSON.stringify(baseline, null, 2));
        console.info(chalk_1.default.green(`Created ${this.baselineFile}`));
        return baseline;
    }
    static SaveBaselineToFile(baseline) {
        try {
            (0, fs_1.writeFileSync)(`${process.cwd()}/${Baseline.baselineFile}`, JSON.stringify(baseline, null, 2));
            console.info((0, chalk_1.default) `\nSaved baseline: {green ${process.cwd()}/${Baseline.baselineFile}}`);
        }
        catch (error) {
            console.error(chalk_1.default.red(`Failed to save baseline file`));
            console.error(chalk_1.default.red(error));
        }
    }
    static SetGeneratedAt(baseline) {
        baseline.generated_at = luxon_1.DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ');
        return baseline;
    }
}
exports.default = Baseline;
Baseline.baselineFile = 'secret-scanner.baseline.json';
