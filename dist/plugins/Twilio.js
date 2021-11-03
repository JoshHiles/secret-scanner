"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Twilio {
    constructor() {
        this.Name = 'Twilio';
        // Account SID (ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
        // Auth token (SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
        this.Regexes = [new RegExp('AC[a-z0-9]{32}', 'g'), new RegExp('SK[a-z0-9]{32}', 'g')];
        this.ExampleMatches = ['AC12132312131231231231231312312312', 'SK12123123131241231213123123123121'];
    }
}
exports.default = Twilio;
