import Plugin from '../types/Plugin';

export default class Twilio implements Plugin {
    Name = 'Twilio';
    // Account SID (ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
    // Auth token (SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
    Regexes = [new RegExp('AC[a-z0-9]{32}', 'g'), new RegExp('SK[a-z0-9]{32}', 'g')];
    ExampleMatches = ['AC12132312131231231231231312312312', 'SK12123123131241231213123123123121'];
}
