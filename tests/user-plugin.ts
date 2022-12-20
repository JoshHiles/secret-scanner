import Plugin from '../dist/interfaces/Plugin';

export default class UserPlugin implements Plugin {
    Name = 'user-plugin';
    Regexes = [new RegExp('hello_custom', 'g')];
    ExampleMatches = ['hello_custom'];
}
