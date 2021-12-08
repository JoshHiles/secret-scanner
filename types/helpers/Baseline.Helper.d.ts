import Baseline from '../interfaces/Baseline';
export default class BaselineHelper {
    baselineFile: string;
    LoadBaseline(): Baseline;
    private CreateBaselineFile;
    SaveBaselineToFile(baseline: Baseline): void;
    SetGeneratedAt(baseline: Baseline): Baseline;
}
