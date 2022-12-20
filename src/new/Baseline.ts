import chalk from "chalk";
import { readFileSync, writeFileSync } from "node:fs";
import "reflect-metadata";

export default class Baseline {
	GeneratedAt!: string;
	Plugins: string[] = [];
	Filters: string[] = [];
	Results: Results = {};

	constructor(file = "secret-scanner.baseline.json") {
		this.OpenFromFile(file);
	}

	private OpenFromFile(file: string) {
		const baselineFileBuffer = readFileSync(`${process.cwd()}/${file}`);
		const baseline = JSON.parse(baselineFileBuffer.toString());
		if (baseline.generated_at || baseline.plugins || baseline.filters || baseline.results) {
			throw new Error("Baseline file needs to be upgraded. See readme.");
		}
		this.GeneratedAt = baseline.GeneratedAt;
		this.Plugins = baseline.Plugins;
		this.Filters = baseline.Filters;
		this.Results = baseline.Results;
	}

	SaveToFile(file = "secret-scanner.baseline.json") {
		this.GeneratedAt = new Date().toUTCString();

		try {
			writeFileSync(`${process.cwd()}/${file}`, JSON.stringify(this, null, 2));
			console.info(`\nSaved baseline: ${chalk.green(`${process.cwd()}/${file}`)}`);
		} catch (error: any) {
			throw new Error(error);
		}
	}
}

interface Results {
	[path: string]: Result[];
}

interface Result {
	type: string;
	hashed_secret: string;
	line_number: number;
	is_secret?: boolean;
}
