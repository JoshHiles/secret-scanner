"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fast_glob_1 = (0, tslib_1.__importDefault)(require("fast-glob"));
const fs_1 = require("fs");
const readline_1 = require("readline");
const path_1 = require("path");
const FileType_enum_1 = require("../interfaces/FileType.enum");
class FileHelper {
    constructor() {
        this.defaultIgnoreFiles = [
            '**/node_modules',
            '**/package-lock.json',
            '**/yarn.lock',
            '**/detect-secret-baseline.json',
            '**/.secret-scannerrc',
            '**/.nyc_output',
            '**/.git',
            '**/.yarn',
            '**/.pnp.cjs',
        ];
    }
    GetFiles(filesAndDirectories, configuration) {
        const arrayOfFiles = fast_glob_1.default.sync(filesAndDirectories, {
            ignore: this.defaultIgnoreFiles.concat(configuration.exclude.files),
            dot: true,
            followSymbolicLinks: false,
        });
        return arrayOfFiles;
    }
    async GetSecret(file, lineNumber) {
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
    DetermineFileType(file) {
        const fileExtension = (0, path_1.extname)(file);
        switch (fileExtension) {
            case '.cls':
                return FileType_enum_1.FileType.CLS;
            case '.example':
                return FileType_enum_1.FileType.EXAMPLE;
            case '.eyaml':
                return FileType_enum_1.FileType.YAML;
            case '.go':
                return FileType_enum_1.FileType.GO;
            case '.java':
                return FileType_enum_1.FileType.JAVA;
            case '.js':
                return FileType_enum_1.FileType.JAVASCRIPT;
            case '.m':
                return FileType_enum_1.FileType.OBJECTIVE_C;
            case '.php':
                return FileType_enum_1.FileType.PHP;
            case '.py':
                return FileType_enum_1.FileType.PYTHON;
            case '.pyi':
                return FileType_enum_1.FileType.PYTHON;
            case '.swift':
                return FileType_enum_1.FileType.SWIFT;
            case '.tf':
                return FileType_enum_1.FileType.TERRAFORM;
            case '.yaml':
                return FileType_enum_1.FileType.YAML;
            case '.yml':
                return FileType_enum_1.FileType.YAML;
            case '.cs':
                return FileType_enum_1.FileType.C_SHARP;
            case '.c':
                return FileType_enum_1.FileType.C;
            case '.cpp':
                return FileType_enum_1.FileType.C_PLUS_PLUS;
            case '.cnf':
                return FileType_enum_1.FileType.CONFIG;
            case '.conf':
                return FileType_enum_1.FileType.CONFIG;
            case '.cfg':
                return FileType_enum_1.FileType.CONFIG;
            case '.cf':
                return FileType_enum_1.FileType.CONFIG;
            case '.ini':
                return FileType_enum_1.FileType.INI;
            case '.properties':
                return FileType_enum_1.FileType.PROPERTIES;
            case '.toml':
                return FileType_enum_1.FileType.TOML;
            default:
                return FileType_enum_1.FileType.OTHER;
        }
    }
}
exports.default = FileHelper;
