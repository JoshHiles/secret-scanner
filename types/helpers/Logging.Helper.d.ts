import { Results } from '../interfaces/Baseline';
export default class LoggingHelper {
    LogNoSecretsFound(): void;
    LogSecretsFound(resultsArray: Results): void;
    LogBeginScan(location: string): void;
}
