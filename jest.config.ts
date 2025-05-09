import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts?(x)"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};

export default config;
