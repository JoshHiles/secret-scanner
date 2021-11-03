import util from 'util';
import { exec } from 'child_process';

export default class GitHelper {
    async GetStagedChanges(): Promise<string[]> {
        const execProm = util.promisify(exec);

        let files: string[] = [];
        try {
            const filesString = await execProm('git diff --name-only --staged');
            files = (filesString.stdout as string).split('\n');
            files.pop();
        } catch (ex) {
            console.log(ex);
        }

        return files;
    }
}
