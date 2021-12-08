import Plugin from '../interfaces/Plugin';
export default class Twilio implements Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: string[];
}
