import Configuration from '../interfaces/Configuration';
import { FileType } from '../interfaces/FileType.enum';
export default class FileHelper {
    defaultIgnoreFiles: string[];
    GetFiles(filesAndDirectories: string[], configuration: Configuration): string[];
    GetSecret(file: string, lineNumber: number): Promise<string | undefined>;
    DetermineFileType(file: string): FileType;
}
