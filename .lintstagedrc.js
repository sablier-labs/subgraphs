/**
 * @type {import("lint-staged").Configuration}
 */
module.exports = {
  "*.{graphql,js,json,jsonc,ts}": "pnpm biome check --write",
  "*.{js,ts}": "pnpm biome lint --write --only correctness/noUnusedImports",
  "*.{md,yaml,yml}": "pnpm prettier --cache --write",
};
