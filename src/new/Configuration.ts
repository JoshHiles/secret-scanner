import { readFileSync } from "node:fs";
import { singleton } from "tsyringe";
import "reflect-metadata";

@singleton()
export default class Configuration {
	Plugins: string[] = [];
	DisablePlugins: string[] = [];
	Exclude: {
		Lines: string[];
		Files: string[];
		Secrets: string[];
	} = { Lines: [], Files: [], Secrets: [] };

	constructor(file = "secret-scanner.config.json") {
		this.Load(file);
	}

	private Load(file: string) {
		const configFileBuffer = readFileSync(`${process.cwd()}/${file}`);
		const config = JSON.parse(configFileBuffer.toString());

		if (config.plugins || config.disable_plugins || config.exclude) {
			throw new Error("Configuration File file needs to be upgraded. See readme.");
		}
		this.Plugins = config.Plugins;
		this.DisablePlugins = config.DisablePlugins;
		this.Exclude = {
			Lines: config.Exclude.Lines,
			Files: config.Exclude.Files,
			Secrets: config.Exclude.Secrets,
		};
	}
}
