import { describe, test, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import Baseline from "./Baseline.js";
import chalk from "chalk";
import { container } from "tsyringe";

describe("Baseline", () => {
	vi.mock("node:fs");

	const testBaseline = {
		Filters: [],
		GeneratedAt: "",
		Plugins: [],
		Results: {},
	};
	const testBaselineString = JSON.stringify(testBaseline);

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("OpenFromFile", () => {
		vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(testBaselineString));

		const baseline = container.resolve(Baseline);

		expect(baseline).toEqual(testBaseline);
	});

	test("OpenFromFile - Throws an Error when baseline needs upgrading", () => {
		const oldBaseline = {
			generated_at: "",
			plugins: [],
			results: {},
			filters: [],
		};
		vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(JSON.stringify(oldBaseline)));

		expect(() => container.resolve(Baseline)).toThrowError("Baseline file needs to be upgraded. See readme.");
	});

	test("SaveToFile", () => {
		vi.mocked(fs.writeFileSync).mockImplementation(() => {});
		const infoSpy = vi.spyOn(console, "info");
		container.resolve(Baseline).SaveToFile();
		expect(infoSpy).toHaveBeenCalledWith(
			`\nSaved baseline: ${chalk.green("D:\\Code\\secret-scanner/secret-scanner.baseline.json")}`,
		);
	});

	test("SaveToFile - Throws error", () => {
		vi.mocked(fs.writeFileSync).mockImplementation(() => {
			throw new Error("an error");
		});

		expect(() => container.resolve(Baseline).SaveToFile()).toThrowError("an error");
	});
});
