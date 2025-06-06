import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["node_modules", "src"],
  transform: {
    "^.+.ts$": ["ts-jest", {}],
  },
};

export default config;
