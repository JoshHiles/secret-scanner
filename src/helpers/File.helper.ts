import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import Configuration from '../Configuration';
import fg from 'fast-glob';

import { FileType } from '../models/filetype.enum';
import { extname } from 'path';

export default class FileHelper {
    private Configuration: Configuration;
    private defaultIgnoreFiles = [
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

    constructor(configuration: Configuration) {
        this.Configuration = configuration;
    }

    GetFiles(filesAndDirectories: string[]): string[] {
        const arrayOfFiles = fg.sync(filesAndDirectories, {
            ignore: this.defaultIgnoreFiles.concat(this.Configuration.exclude.files),
            dot: true,
            followSymbolicLinks: false,
        });

        return arrayOfFiles;
    }

    static DetermineFileType(file: string): FileType {
        const fileExtension = extname(file);
        switch (fileExtension) {
            case '.cls':
                return FileType.CLS;
            case '.example':
                return FileType.EXAMPLE;
            case '.eyaml':
                return FileType.YAML;
            case '.go':
                return FileType.GO;
            case '.java':
                return FileType.JAVA;
            case '.js':
                return FileType.JAVASCRIPT;
            case '.m':
                return FileType.OBJECTIVE_C;
            case '.php':
                return FileType.PHP;
            case '.py':
                return FileType.PYTHON;
            case '.pyi':
                return FileType.PYTHON;
            case '.swift':
                return FileType.SWIFT;
            case '.tf':
                return FileType.TERRAFORM;
            case '.yaml':
                return FileType.YAML;
            case '.yml':
                return FileType.YAML;
            case '.cs':
                return FileType.C_SHARP;
            case '.c':
                return FileType.C;
            case '.cpp':
                return FileType.C_PLUS_PLUS;
            case '.cnf':
                return FileType.CONFIG;
            case '.conf':
                return FileType.CONFIG;
            case '.cfg':
                return FileType.CONFIG;
            case '.cf':
                return FileType.CONFIG;
            case '.ini':
                return FileType.INI;
            case '.properties':
                return FileType.PROPERTIES;
            case '.toml':
                return FileType.TOML;
            default:
                return FileType.OTHER;
        }
    }

    static async GetSecret(file: string, lineNumber: number): Promise<string | undefined> {
        const rl = createInterface({
            input: createReadStream(file),
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
