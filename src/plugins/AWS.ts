import Plugin from '../types/Plugin';

export default class AWS implements Plugin {
    Name = 'AWS';
    // Access key (AKIAxxxxxxxxxxxxxxxx)
    Regexes = [new RegExp('AKIA[0-9A-Z]{16}', 'g')];
    ExampleMatches = ['AKIAIOSFODNN7EXAMPLE'];
}
