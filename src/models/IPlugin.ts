import { FileType } from './filetype.enum';

export default interface IPlugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: ExampleMatchType | string[];
}

export type ExampleMatchType = {
    [key in FileType]: string[];
};
