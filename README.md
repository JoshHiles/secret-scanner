# Secret Scanner

![Coveralls](https://img.shields.io/coveralls/github/JoshHiles/secret-scanner?style=for-the-badge)
![npm](https://img.shields.io/npm/v/secret-scanner?style=for-the-badge)
[![GitHub license](https://img.shields.io/github/license/JoshHiles/secret-scanner?style=for-the-badge)](https://github.com/JoshHiles/secret-scanner/blob/main/LICENSE)

## About

Based off the well established [Yelp detect-secrets](https://github.com/Yelp/detect-secrets) (please go check them out if your using python!), _secret-scanner_ aims to provide a similiar experience within the node realm.

Secret Scanner provides the ability to

-   scan for secrets based off know regexes of potentially sensitive information
-   prevent new secrets from entering the code base
-   provide a way to baseline know secrets with the possibility of moving these off the code base.

### Sections

-   [Issues & proposing features](https://github.com/JoshHiles/secret-scanner/issues)
-   [Discussions](https://github.com/JoshHiles/secret-scanner/discussions)
-   [Recent Changes](CHANGELOG.md)
-   [Installation](#installation)
-   [Quickstart](#quickstart)
-   [Configuration](#configuration)
    -   [Custom Plugins](#custom-plugins)
    -   [Disable Plugins](#disable-plugins)
    -   [Exclude Lines](#exclude-lines)
    -   [Exclude Files](#exclude-files)
    -   [Exclude Secrets](#exclude-secrets)
-   [CLI](#cli)

---

<br/>

## Installation

With NPM

`npm install --save-dev secret-scanner`

or with yarn

`yarn add --dev secret-scanner`

---

<br/>

## Quickstart

1. `secret-scanner scan` to generate baseline file
2. `secret-scanner audit` the baseline file check if secrets should be committed to repo
3. Add `secret-scanner scan -h` to your pre-commit to stop newly added secrets

For example with [husky](https://typicode.github.io/husky/#/) on a NPM repo

1. `npm install husky --save-dev`
2. `npx husky install`
3. `npm set-script prepare "husky install"`
4. `npx husky add .husky/pre-commit "secret-scanner scan -h"`

---

<br/>

## Configuration

To start configuring create a `.secret-scannerrc.json` file in the root of your repo; if this file doesn't suite your needs you can have a look at [cosmiconfig](https://github.com/davidtheclark/cosmiconfig)

An example config

```json
{
    "plugins": ["./path-to/my-custom-plugin.ts"],
    "disable_plugins": ["AWS"],
    "exclude": {
        "lines": ["example line"],
        "files": ["**/fileToIgnore.js"],
        "secrets": ["sample-secret"]
    }
}
```

### Custom Plugins

Please see [Custom Plugins](CUSTOM_PLUGINS.md)

### Disabling Plugins

```json
{
    "disable_plugins": ["AWS", "Keyword", "Slack", "Stripe", "Twilio"]
}
```

### Exclude Lines

Excluding Lines is as easy as writing the line to be excluded or a regex.

> Under the hood it uses regex all the same to match

```json
{
    "exclude": {
        "lines": ["example line", "[a-z0-9]-regex-line"]
    }
}
```

### Exclude Files

secret-scanner uses [fast-glob](https://github.com/mrmlnc/fast-glob) for excluding files

```json
{
    "exclude": {
        "files": [
            "**/fileToIgnore.js", // Ignore any instance of file anywhere
            "directory/fileToIgnore.js" // Ignore file in directory
            "**/*.js" // Ignore any JS file in any directory
        ]
    }
}
```

### Exclude Secrets

Excluding secrets is as easy as writing the secret to be excluded or a regex.

> Under the hood it uses regex all the same to match

```json
{
    "exclude": {
        "secrets": ["sample-secret", "[a-z0-9]-regex-secret"]
    }
}
```

---

<br/>

## CLI

```
secret-scanner.js scan

Scans directories / committed files

Options:
      --version   Show version number                                  [boolean]
      --help      Show help                                            [boolean]
  -h, --hook      Used for pre-hooks
  -l, --location  Location to scan using glob pattern, default is current
                  working dir                     [default: "PATH TO REPO"]
  -d, --debug
```

```
secret-scanner.js audit

Audit the baseline file

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
