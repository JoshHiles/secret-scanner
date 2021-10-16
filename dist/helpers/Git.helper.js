"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodegit_1 = require("nodegit");
class GitHelper {
    static async getStagedChanges() {
        const repo = await nodegit_1.Repository.open(process.cwd());
        const head = await repo.getHeadCommit();
        const tree = await head.getTree();
        if (!head) {
            return [];
        }
        const diff = await nodegit_1.Diff.treeToIndex(repo, tree);
        const patches = await diff.patches();
        const files = patches.map((patch) => patch.newFile().path());
        return files;
    }
}
exports.default = GitHelper;
