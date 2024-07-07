# Secret Scanner

![Coveralls](https://img.shields.io/coveralls/github/JoshHiles/secret-scanner?style=for-the-badge)
![npm](https://img.shields.io/npm/v/secret-scanner?style=for-the-badge)
[![GitHub license](https://img.shields.io/github/license/JoshHiles/secret-scanner?style=for-the-badge)](https://github.com/JoshHiles/secret-scanner/blob/main/LICENSE)

## About

Based off the well established [Yelp detect-secrets](https://github.com/Yelp/detect-secrets) (please go check them out if your using python!), _secret-scanner_ aims to provide a similiar experience within the node realm.

-   [Issues](https://github.com/JoshHiles/secret-scanner/issues)
-   [Discussions](https://github.com/JoshHiles/secret-scanner/discussions)
-   [Recent Changes](CHANGELOG.md)
<!-- -   [Contributing]() -->

### Sections

- [Secret Scanner](#secret-scanner)
  - [About](#about)
    - [Sections](#sections)
  - [Installation](#installation)
  - [Quickstart](#quickstart)
  - [Configuration](#configuration)
    - [Disable Plugins](#disable-plugins)
    - [Exclude Lines](#exclude-lines)
    - [Exclude Files](#exclude-files)
    - [Exclude Secrets](#exclude-secrets)
  - [CLI](#cli)

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

To include the following configurations, you'll need to create a new secret-scanner configuration file and add the configurations there. To do so, follow the conventions outlined in the [Cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) repository.

> By default, Cosmiconfig will check the current directory for the following:
>
> * a package.json property
> * a JSON or YAML, extensionless "rc file"
> * an "rc file" with the extensions .json, .yaml, .yml, .js, .ts, .mjs, or .cjs
> * any of the above two inside a .config subdirectory
> * a .config.js, .config.ts, .config.mjs, or .config.cjs file

For example: create a new file in the project root directory entitled `.secret-scannerrc`.

### Disable Plugins

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

Scans directories / scans committed files

Options:
      --version   Show version number                                  [boolean]
      --help      Show help                                            [boolean]
  -h, --hook      Used for pre-hooks
  -l, --location  Location to scan using glob pattern, default is current
                  working dir                     [default: "D:\Code\tester/**"]
  -d, --debug
```

```
secret-scanner.js audit

Audit the baseline file

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```
