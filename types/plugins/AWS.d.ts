import Plugin from '../interfaces/Plugin';
export default class AWS implements Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: string[];
}
