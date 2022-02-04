# Making a custom plugin

## Typescript

Example:

```TypeScript
import Plugin from 'secret-scanner/types/interfaces/plugin';

export default class MyCustomPlugin implements Plugin {
    Name = 'MyCustomPlugin';
    Regexes = [
        new RegExp('my custom regex', 'g'),
        new RegExp('my 2nd custom regex', 'g')
    ];
    ExampleMatches = [
        'the first regex will match this string',
        'my second regex will match this string'
    ];
}
```

## Javascript

Example:

```JavaScript
Object.defineProperty(exports, "__esModule", { value: true });

class MyJavascriptCustomPlugin {
    constructor() {
        this.Name = 'MyJavascriptCustomPlugin';
        this.Regexes = [
            new RegExp('my custom regex', 'g'),
            new RegExp('my 2nd custom regex', 'g')
        ];
        this.ExampleMatches = [
            'the first regex will match this string',
            'my second regex will match this string'
        ];
    }
}
exports.default = MyJavascriptCustomPlugin;
```

## Adding your custom plugin

In your `.secret-scannerrc.json` file add the path to your plugin, for example:

```JSON
{
    "plugins": [
        "./secret-scanner-plugins/MyCustomPlugin.ts",
        "./secret-scanner-plugins/MyJavascriptCustomPlugin.js"
    ],
    "disable_plugins": [],
    "exclude": {
        "lines": [],
        "files": [],
        "secrets": []
    }
}
```

## Disabling your custom plugin

To stop your plugin from running during a scan add the name of your plugin to your `.secret-scannerrc.json` file:

```JSON
{
    "plugins": [
        "./secret-scanner-plugins/MyCustomPlugin.ts",
        "./secret-scanner-plugins/MyJavascriptCustomPlugin.js"
    ],
    "disable_plugins": [
        "MyJavascriptCustomPlugin"
    ],
    "exclude": {
        "lines": [],
        "files": [],
        "secrets": []
    }
}
```
