import IPlugin from '../models/IPlugin';

export default class AWS implements IPlugin {
    Name = 'AWS';
    // Access key (AKIAxxxxxxxxxxxxxxxx)
    Regexes = [new RegExp('AKIA[0-9A-Z]{16}', 'g')];
    ExampleMatches = ['AKIAIOSFODNN7EXAMPLE'];
}
