import BaselineHelper from './helpers/Baseline.Helper';
import FileHelper from './helpers/File.Helper';
export default class Audit {
    BaselineHelper: BaselineHelper;
    FileHelper: FileHelper;
    constructor(baselineHelper: BaselineHelper, fileHelper: FileHelper);
    Audit(): Promise<void>;
}
