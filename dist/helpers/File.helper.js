"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const readline_1 = require("readline");
const fast_glob_1 = (0, tslib_1.__importDefault)(require("fast-glob"));
const filetype_enum_1 = require("../models/filetype.enum");
const path_1 = require("path");
class FileHelper {
    constructor(configuration) {
        this.defaultIgnoreFiles = [
            '**/node_modules',
            '**/package-lock.json',
            '**/yarn.lock',
            '**/detect-secret-baseline.json',
            '**/.secret-scannerrc',
            '**/.nyc_output',
            '**/.git',
        ];
        this.Configuration = configuration;
    }
    GetFiles(filesAndDirectories) {
        const arrayOfFiles = fast_glob_1.default.sync(filesAndDirectories, {
            ignore: this.defaultIgnoreFiles.concat(this.Configuration.exclude.files),
            dot: true,
            followSymbolicLinks: false,
        });
        return arrayOfFiles;
    }
    static DetermineFileType(file) {
        const fileExtension = (0, path_1.extname)(file);
        switch (fileExtension) {
            case '.cls':
                return filetype_enum_1.FileType.CLS;
            case '.example':
                return filetype_enum_1.FileType.EXAMPLE;
            case '.eyaml':
                return filetype_enum_1.FileType.YAML;
            case '.go':
                return filetype_enum_1.FileType.GO;
            case '.java':
                return filetype_enum_1.FileType.JAVA;
            case '.js':
                return filetype_enum_1.FileType.JAVASCRIPT;
            case '.m':
                return filetype_enum_1.FileType.OBJECTIVE_C;
            case '.php':
                return filetype_enum_1.FileType.PHP;
            case '.py':
                return filetype_enum_1.FileType.PYTHON;
            case '.pyi':
                return filetype_enum_1.FileType.PYTHON;
            case '.swift':
                return filetype_enum_1.FileType.SWIFT;
            case '.tf':
                return filetype_enum_1.FileType.TERRAFORM;
            case '.yaml':
                return filetype_enum_1.FileType.YAML;
            case '.yml':
                return filetype_enum_1.FileType.YAML;
            case '.cs':
                return filetype_enum_1.FileType.C_SHARP;
            case '.c':
                return filetype_enum_1.FileType.C;
            case '.cpp':
                return filetype_enum_1.FileType.C_PLUS_PLUS;
            case '.cnf':
                return filetype_enum_1.FileType.CONFIG;
            case '.conf':
                return filetype_enum_1.FileType.CONFIG;
            case '.cfg':
                return filetype_enum_1.FileType.CONFIG;
            case '.cf':
                return filetype_enum_1.FileType.CONFIG;
            case '.ini':
                return filetype_enum_1.FileType.INI;
            case '.properties':
                return filetype_enum_1.FileType.PROPERTIES;
            case '.toml':
                return filetype_enum_1.FileType.TOML;
            default:
                return filetype_enum_1.FileType.OTHER;
        }
    }
    static async GetSecret(file, lineNumber) {
        const rl = (0, readline_1.createInterface)({
            input: (0, fs_1.createReadStream)(file),
            crlfDelay: Infinity,
        });
        let lineNumberCount = 1;
        for await (const line of rl) {
            if (lineNumberCount == lineNumber) {
                return line.trim();
            }
            lineNumberCount++;
        }
        return undefined;
    }
}
exports.default = FileHelper;
