import Plugin from '../types/Plugin';

export default class Slack implements Plugin {
    Name = 'Slack';
    // Access Token (xoxp-XXXXXXXXXXX-XXXXXXXXXXXXX)
    // Access Token (xoxp-XXXXXXXX-XXXXXXXX-XXXXX)
    // Bot access token (xoxb-XXXXXXXXXXXX-TTTTTTTTTTTTTT)
    // Webhooks (https://hooks.slack.com/{services}/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX)
    Regexes = [
        new RegExp('xox(?:a|b|p|o|s|r)-(?:\\d+-)(?:\\d+|\\w+)(?:-\\d+)?', 'ig'),
        new RegExp('https://hooks\\.slack\\.com/(?:|\\w+/)*T[a-zA-Z0-9_]+/B[a-zA-Z0-9_]+/[a-zA-Z0-9_]+', 'ig'),
    ];
    ExampleMatches = [
        'xoxp-12312323233-1231231232333',
        'xoxp-12312331-12312332-12312',
        'xoxb-121312312311-ASDASASDASDADD',
        'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    ];
}
