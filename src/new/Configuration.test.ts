import { describe, test, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import Configuration from "./Configuration.js";
import { container } from "tsyringe";

describe("Configuration", () => {
	vi.mock("node:fs");

	const testConfiguration = {
		Plugins: [],
		DisablePlugins: [],
		Exclude: { Lines: [], Files: [], Secrets: [] },
	};
	const testConfigString = JSON.stringify(testConfiguration);

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("Load", () => {
		vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(testConfigString));

		const configuration = container.resolve(Configuration);

		expect(configuration).toEqual(testConfiguration);
	});

	test("Load - Throws an Error when Configuration needs upgrading", () => {
		const oldConfiguration = {
			plugins: [],
			disable_plugins: [],
			exclude: {},
		};
		vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from(JSON.stringify(oldConfiguration)));

		expect(() => container.resolve(Configuration)).toThrowError(
			"Configuration File file needs to be upgraded. See readme.",
		);
	});
});
