import chalk from "chalk";
import { prompt } from "inquirer";
import clear from "clear";
import BaselineHelper from "./helpers/Baseline.Helper.js";
import FileHelper from "./helpers/File.Helper.js";

chalk.level = 3;

export default class Audit {
	BaselineHelper: BaselineHelper;
	FileHelper: FileHelper;

	constructor(baselineHelper: BaselineHelper, fileHelper: FileHelper) {
		this.BaselineHelper = baselineHelper;
		this.FileHelper = fileHelper;
	}

	async Audit() {
		const baseline = this.BaselineHelper.LoadBaseline();
		if (baseline.results !== {}) {
			for (const resultPath in baseline.results) {
				const results = baseline.results[resultPath];
				console.info(chalk.green(`Auditing file: ${resultPath}`));

				for (const result of results) {
					console.info(chalk.yellow(`Line number: ${result.line_number}`));
					console.info(
						chalk.red(`Secret to audit: ${await this.FileHelper.GetSecret(resultPath, result.line_number)}`),
					);
					const userInput = await prompt([
						{
							type: "confirm",
							name: "confirm",
							message: "Should this secret be committed to this repository?",
						},
					]);
					console.info(userInput);
					result.is_secret = !userInput.confirm;
					clear();
				}
			}

			this.BaselineHelper.SaveBaselineToFile(baseline);
		}
	}
}
