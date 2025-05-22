/**
 * @type {import("lint-staged").Configuration}
 */
module.exports = {
  "*.{graphql,js,json,jsonc,ts}": "bun biome check --write",
  "*.{js,ts}": "bun biome lint --write --only correctness/noUnusedImports",
  "*.{md,yaml,yml}": "bun prettier --cache --write",
};
