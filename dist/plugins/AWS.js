"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AWS {
    constructor() {
        this.Name = 'AWS';
        // Access key (AKIAxxxxxxxxxxxxxxxx)
        this.Regexes = [new RegExp('AKIA[0-9A-Z]{16}', 'g')];
        this.ExampleMatches = ['AKIAIOSFODNN7EXAMPLE'];
    }
}
exports.default = AWS;
