import { FileType } from './FileType.enum';

export default interface Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: ExampleMatchType | string[];
    Initialise?(fileType: FileType): void;
}

export type ExampleMatchType = {
    [key in FileType]: string[];
};
