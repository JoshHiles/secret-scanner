import ResultHelper from '../../src/helpers/Result.Helper';
import Baseline, { Results } from '../../src/types/Baseline';

describe('Result Helper', () => {
    test('RemoveNonSecretResultsMatchedInBaseline', () => {
        const resultArray: Results = {
            'test1.js': [
                {
                    hashed_secret: 'hash1',
                    line_number: 1,
                    type: 'type1',
                    is_secret: false,
                },
                {
                    hashed_secret: 'hash2',
                    line_number: 1,
                    type: 'type2',
                    is_secret: true,
                },
            ],
            'test2.js': [
                {
                    hashed_secret: 'hash3',
                    line_number: 1,
                    type: 'type3',
                },
            ],
        };

        const expectedResults: Results = {
            'test1.js': [
                {
                    hashed_secret: 'hash2',
                    line_number: 1,
                    type: 'type2',
                    is_secret: true,
                },
            ],
            'test2.js': [
                {
                    hashed_secret: 'hash3',
                    line_number: 1,
                    type: 'type3',
                },
            ],
        };

        const baseline: Baseline = {
            filters: [],
            generated_at: 'gen',
            plugins: [],
            results: {
                'test1.js': [
                    {
                        hashed_secret: 'hash1',
                        line_number: 1,
                        type: 'type1',
                        is_secret: false,
                    },
                ],
            },
        };

        const result = new ResultHelper().RemoveNonSecretResultsMatchedInBaseline(resultArray, baseline);

        expect(result).toEqual(expectedResults);
    });
});
