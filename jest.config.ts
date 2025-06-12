import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>/tests"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["node_modules", "src"],
  transform: {
    "^.+.ts$": [
      "ts-jest",
      {
        // See https://github.com/kulshekhar/ts-jest/issues/4198
        tsconfig: {
          isolatedModules: true,
        },
      },
    ],
  },
};

export default config;
