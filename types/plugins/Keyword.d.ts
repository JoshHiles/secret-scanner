import { FileType } from '../interfaces/FileType.enum';
import Plugin, { ExampleMatchType } from '../interfaces/Plugin';
export default class Keyword implements Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: ExampleMatchType;
    Initialise(fileType: FileType): void;
}
