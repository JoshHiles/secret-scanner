import mock from 'mock-fs';

import FileHelper from '../../src/helpers/File.Helper';
import Configuration from '../../src/interfaces/Configuration';
import { FileType } from '../../src/interfaces/FileType.enum';

describe('File Helper', () => {
    afterEach(() => {
        mock.restore();
    });

    test('GetFiles', () => {
        mock({
            dir: {
                'file1.md': '',
                another: {
                    'file2.txt': '',
                },
            },
        });

        const testConfig: Configuration = {
            plugins: [],
            disable_plugins: [],
            exclude: { files: [], lines: [], secrets: [] },
        };

        const result = new FileHelper().GetFiles([`${process.cwd().replace(/\\/g, '/')}/dir/**`], testConfig);

        expect(result).toEqual([
            `${process.cwd().replace(/\\/g, '/')}/dir/file1.md`,
            `${process.cwd().replace(/\\/g, '/')}/dir/another/file2.txt`,
        ]);
    });

    test('GetSecret', async () => {
        mock({
            dir: {
                'file1.md': 'const hello = "hello";\nconst secret = "a secret";',
            },
        });

        const result = await new FileHelper().GetSecret(`${process.cwd().replace(/\\/g, '/')}/dir/file1.md`, 2);

        expect(result).toEqual('const secret = "a secret";');
    });

    test('GetSecret undefined', async () => {
        mock({
            dir: {
                'file1.md': 'const hello = "hello";\nconst secret = "a secret";',
            },
        });

        const result = await new FileHelper().GetSecret(`${process.cwd().replace(/\\/g, '/')}/dir/file1.md`, 4);

        expect(result).toBeUndefined;
    });

    describe('DetermineFileType', () => {
        test.each`
            file                 | expected
            ${'file.cls'}        | ${FileType.CLS}
            ${'file.example'}    | ${FileType.EXAMPLE}
            ${'file.eyaml'}      | ${FileType.YAML}
            ${'file.go'}         | ${FileType.GO}
            ${'file.java'}       | ${FileType.JAVA}
            ${'file.js'}         | ${FileType.JAVASCRIPT}
            ${'file.m'}          | ${FileType.OBJECTIVE_C}
            ${'file.php'}        | ${FileType.PHP}
            ${'file.py'}         | ${FileType.PYTHON}
            ${'file.pyi'}        | ${FileType.PYTHON}
            ${'file.swift'}      | ${FileType.SWIFT}
            ${'file.tf'}         | ${FileType.TERRAFORM}
            ${'file.yaml'}       | ${FileType.YAML}
            ${'file.yml'}        | ${FileType.YAML}
            ${'file.cs'}         | ${FileType.C_SHARP}
            ${'file.c'}          | ${FileType.C}
            ${'file.cpp'}        | ${FileType.C_PLUS_PLUS}
            ${'file.cnf'}        | ${FileType.CONFIG}
            ${'file.conf'}       | ${FileType.CONFIG}
            ${'file.cfg'}        | ${FileType.CONFIG}
            ${'file.cf'}         | ${FileType.CONFIG}
            ${'file.ini'}        | ${FileType.INI}
            ${'file.properties'} | ${FileType.PROPERTIES}
            ${'file.toml'}       | ${FileType.TOML}
            ${'file.macro'}      | ${FileType.OTHER}
        `('DetermineFileType returns $expected for $file', ({ file, expected }) => {
            expect(new FileHelper().DetermineFileType(file)).toEqual(expected);
        });
    });
});
