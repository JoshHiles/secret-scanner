import Baseline, { Results } from '../types/Basline';

export default class ResultHelper {
    RemoveNonSecretResultsMatchedInBaseline(resultsArray: Results, baseline: Baseline): Results {
        for (const resultKey in resultsArray) {
            const resultArray = resultsArray[resultKey];

            if (resultKey in baseline.results) {
                const foundInBaseline = baseline.results[resultKey];

                for (const result of resultArray) {
                    for (const baselineResult of foundInBaseline) {
                        const typeMatch = baselineResult.type === result.type;
                        const lineMatch = baselineResult.line_number === result.line_number;
                        const hashMatch = baselineResult.hashed_secret === result.hashed_secret;
                        if (typeMatch && lineMatch && hashMatch) {
                            if (!baselineResult.is_secret) {
                                const index = resultsArray[resultKey].indexOf(result, 0);
                                if (index > -1) {
                                    resultsArray[resultKey].splice(index, 1);
                                }
                            }
                        }
                    }
                }
            }
        }

        return resultsArray;
    }
}
