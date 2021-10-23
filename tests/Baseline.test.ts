/* eslint-disable @typescript-eslint/ban-ts-comment */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import mock from 'mock-fs';
import fs from 'fs';

const expect = chai.expect;
chai.use(sinonChai);

import Baseline from '../src/Baseline';
import { DateTime } from 'luxon';
import chalk from 'chalk';

describe('Baseline', async () => {
    let sandbox;
    const testBaseline = {
        generated_at: 'generated',
        plugins: ['plugin'],
        filters: ['filter'],
        results: {
            hello: [{ type: 'type', hashed_secret: 'hash', line_number: 2 }],
        },
    } as Baseline;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        sandbox.restore();
    });

    afterEach(() => {
        mock.restore();
    });

    it('should construct', () => {
        sandbox.stub(Baseline, 'GetBaselineFile').returns(testBaseline);

        const result = new Baseline();

        expect(result).to.deep.equal(testBaseline);
    });

    describe('GetBaselineFile()', () => {
        it('should get baseline file', () => {
            mock({
                'secret-scanner.baseline.json': JSON.stringify(testBaseline),
            });

            const result = new Baseline();

            expect(result).to.deep.equal(testBaseline);
        });

        it('should call create baseline file it baseline file doesnt exist', () => {
            sandbox.stub(fs, 'readFileSync').throws(new Error('hee'));
            sandbox.stub(Baseline, 'CreateBaselineFile').returns(testBaseline);
            const infoSpy = sandbox.spy(console, 'info');

            const result = new Baseline();

            expect(
                infoSpy.firstCall.calledWith(chalk.red(`secret-scanner.baseline.json not found in ${process.cwd()}`)),
            ).to.be.true;
            expect(result).to.deep.equal(testBaseline);
        });
    });

    it('should CreateBaselineFile()', () => {
        sandbox.stub(fs, 'readFileSync').throws(new Error('hee'));
        sandbox.stub(fs, 'writeFileSync').returns();
        const infoSpy = sandbox.spy(console, 'info');

        const result = new Baseline();

        expect(infoSpy.firstCall.calledWith(chalk.red(`secret-scanner.baseline.json not found in ${process.cwd()}`))).to
            .be.true;
        expect(infoSpy.secondCall.calledWith(chalk.green(`Created secret-scanner.baseline.json`))).to.be.true;
        expect(result).to.deep.equal({
            generated_at: DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ'),
            plugins: [],
            filters: [],
            results: {},
        } as Baseline);
    });

    describe('SaveBaselineToFile()', () => {
        it('should save baseline to file', () => {
            sandbox.stub(fs, 'writeFileSync').returns();
            const infoSpy = sandbox.spy(console, 'info');

            Baseline.SaveBaselineToFile(testBaseline);

            expect(
                infoSpy.firstCall.calledWith(
                    chalk`\nSaved baseline: {green ${process.cwd()}/secret-scanner.baseline.json}`,
                ),
            ).to.be.true;
        });

        it('should error if it cant save baseline to file', () => {
            sandbox.stub(fs, 'writeFileSync').throws(new Error("Couldn't save file"));
            const errorSpy = sandbox.spy(console, 'error');

            Baseline.SaveBaselineToFile(testBaseline);

            expect(errorSpy.firstCall.calledWith(chalk.red(`Failed to save baseline file`))).to.be.true;
            expect(errorSpy.secondCall.calledWith(chalk.red("Error: Couldn't save file"))).to.be.true;
        });
    });

    it('should SetGeneratedAt()', () => {
        const result = Baseline.SetGeneratedAt(testBaseline);

        expect(result.generated_at).to.equal(DateTime.now().toFormat('dd/LL/yyyy hh:mm a ZZZZ'));
    });
});
