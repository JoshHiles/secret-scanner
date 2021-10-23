/* eslint-disable @typescript-eslint/ban-ts-comment */
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import mock from 'mock-fs';

const expect = chai.expect;
chai.use(sinonChai);

import Result from '../../src/models/Result';

describe('Result', async () => {
    let sandbox;

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
        const result = new Result('type', 'hash', 2);

        expect(result.type).to.equal('type');
        expect(result.hashed_secret).to.equal('hash');
        expect(result.line_number).to.equal(2);
        expect(result.is_secret).to.equal(undefined);
    });
});
