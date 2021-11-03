"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = (0, tslib_1.__importDefault)(require("util"));
const child_process_1 = require("child_process");
class GitHelper {
    async GetStagedChanges() {
        const execProm = util_1.default.promisify(child_process_1.exec);
        let files = [];
        try {
            const filesString = await execProm('git diff --name-only --staged');
            files = filesString.stdout.split('\n');
            files.pop();
        }
        catch (ex) {
            console.log(ex);
        }
        return files;
    }
}
exports.default = GitHelper;
