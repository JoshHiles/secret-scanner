import Plugin from '../interfaces/Plugin';
export default class Slack implements Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: string[];
}
