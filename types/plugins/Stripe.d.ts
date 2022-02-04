import Plugin from '../interfaces/Plugin';
export default class Stripe implements Plugin {
    Name: string;
    Regexes: RegExp[];
    ExampleMatches: string[];
}
