import { Repository, Diff } from 'nodegit';

export default class GitHelper {
    async GetStagedChanges(): Promise<string[]> {
        const repo = await Repository.open(process.cwd());
        const head = await repo.getHeadCommit();
        const tree = await head.getTree();
        if (!head) {
            return [];
        }
        const diff = await Diff.treeToIndex(repo, tree);
        const patches = await diff.patches();
        const files = patches.map((patch) => patch.newFile().path());
        return files;
    }
}
