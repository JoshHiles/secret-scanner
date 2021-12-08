import { FileType } from './FileType.enum';
export default interface Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: ExampleMatchType | string[];
    Initialise?(fileType: FileType): void;
}
export declare type ExampleMatchType = {
    [key in FileType]: string[];
};
