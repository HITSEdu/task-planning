import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",

  collectCoverage: true,
  coverageReporters: ["text", "lcov"],

  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "./reports/junit",
        outputName: "junit.xml",
      },
    ],
  ],
};

export default createJestConfig(config);
