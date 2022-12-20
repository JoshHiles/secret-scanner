import { defineConfig } from "vitest/config";
// import "@abraham/reflection";
import "reflect-metadata";

export default defineConfig({
	test: {
		include: ["./src/**/*.test.ts"],
	},
});
