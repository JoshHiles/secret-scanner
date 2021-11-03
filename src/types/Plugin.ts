import { FileType } from './FileType.enum';

export default interface Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: ExampleMatchType | string[];
}

export type ExampleMatchType = {
    [key in FileType]: string[];
};
