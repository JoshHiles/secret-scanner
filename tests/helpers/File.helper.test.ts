/* eslint-disable @typescript-eslint/ban-ts-comment */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import mock from 'mock-fs';

const expect = chai.expect;
chai.use(sinonChai);

import { CosmiconfigResult } from 'cosmiconfig/dist/types';
import Configuration from '../../src/Configuration';
import FileHelper from '../../src/helpers/File.helper';
import { FileType } from '../../src/models/filetype.enum';

describe('File helper', async () => {
    let sandbox;
    let fileHelper: FileHelper;
    before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(Configuration, 'LoadCosmiConfig').returns({
            config: {
                disable_plugins: ['disabled plugin'],
                exclude: {
                    lines: ['excluded line'],
                    files: ['excluded file'],
                    secrets: ['excluded secret'],
                },
            },
            filepath: '',
        } as CosmiconfigResult);
        const config = new Configuration();
        fileHelper = new FileHelper(config);
    });
    beforeEach(() => {
        sandbox.restore();
    });

    afterEach(() => {
        mock.restore();
    });

    it('constructs', () => {
        // @ts-ignore
        expect(fileHelper.Configuration.disable_plugins).to.deep.equal(['disabled plugin']);
        // @ts-ignore
        expect(fileHelper.Configuration.exclude.lines).to.deep.equal(['excluded line']);
        // @ts-ignore
        expect(fileHelper.Configuration.exclude.files).to.deep.equal(['excluded file']);
        // @ts-ignore
        expect(fileHelper.Configuration.exclude.secrets).to.deep.equal(['excluded secret']);
    });

    describe('GetFiles()', () => {
        it('should get all files for single single dir & not a default ignore', () => {
            mock({
                'path/to/fake/dir': {
                    'some-file.txt': '',
                    'nested-dir': {
                        'another-file.md': '',
                    },
                    node_modules: {
                        test: '',
                    },
                },
            });

            const result = fileHelper.GetFiles(['path/to/fake/dir/**']);

            expect(result).to.deep.equal([
                'path/to/fake/dir/some-file.txt',
                'path/to/fake/dir/nested-dir/another-file.md',
            ]);
        });

        it('should get multiple files', () => {
            mock({
                'path/to/fake/dir': {
                    'some-file.txt': '',
                    'nested-dir': {
                        'another-file.md': '',
                    },
                },
            });

            const result = fileHelper.GetFiles([
                'path/to/fake/dir/some-file.txt',
                'path/to/fake/dir/nested-dir/another-file.md',
            ]);

            expect(result).to.deep.equal([
                'path/to/fake/dir/some-file.txt',
                'path/to/fake/dir/nested-dir/another-file.md',
            ]);
        });
    });

    describe('DetermineFileType()', () => {
        const tests = [
            { file: 'test.cls', type: FileType.CLS },
            { file: 'test.example', type: FileType.EXAMPLE },
            { file: 'test.eyaml', type: FileType.YAML },
            { file: 'test.go', type: FileType.GO },
            { file: 'test.java', type: FileType.JAVA },
            { file: 'test.js', type: FileType.JAVASCRIPT },
            { file: 'test.m', type: FileType.OBJECTIVE_C },
            { file: 'test.php', type: FileType.PHP },
            { file: 'test.py', type: FileType.PYTHON },
            { file: 'test.pyi', type: FileType.PYTHON },
            { file: 'test.swift', type: FileType.SWIFT },
            { file: 'test.tf', type: FileType.TERRAFORM },
            { file: 'test.yaml', type: FileType.YAML },
            { file: 'test.yml', type: FileType.YAML },
            { file: 'test.cs', type: FileType.C_SHARP },
            { file: 'test.c', type: FileType.C },
            { file: 'test.cpp', type: FileType.C_PLUS_PLUS },
            { file: 'test.cnf', type: FileType.CONFIG },
            { file: 'test.conf', type: FileType.CONFIG },
            { file: 'test.cfg', type: FileType.CONFIG },
            { file: 'test.cf', type: FileType.CONFIG },
            { file: 'test.ini', type: FileType.INI },
            { file: 'test.properties', type: FileType.PROPERTIES },
            { file: 'test.toml', type: FileType.TOML },
            { file: 'test.razor', type: FileType.OTHER },
        ];

        tests.forEach(({ file, type }) => {
            it(`determines ${FileType[type]} for ${file}`, () => {
                const result = FileHelper.DetermineFileType(file);

                expect(result).to.equal(type);
            });
        });
    });

    describe('GetSecret()', async () => {
        it('should get secret', async () => {
            mock({
                'path/to/fake/dir': {
                    'some-file.txt': 'a secret value\nanother secret value',
                },
            });
            const result = await FileHelper.GetSecret('path/to/fake/dir/some-file.txt', 2);
            expect(result).to.equal('another secret value');
        });
        it('should return undefined if secret not found', async () => {
            mock({
                'path/to/fake/dir': {
                    'some-file.txt': '',
                },
            });
            const result = await FileHelper.GetSecret('path/to/fake/dir/some-file.txt', 2);
            expect(result).to.be.undefined;
        });
    });
});
