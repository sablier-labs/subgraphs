/**
 * @field Multi-project config for GraphQL Code Generator
 * @see https://the-guild.dev/graphql/codegen/docs/config-reference/multiproject-config
 * @see https://github.com/dotansimha/graphql-code-generator/discussions/10365
 */
function get(vendor, protocol) {
  const outPath = resolveOutPath(vendor, protocol);
  /** @type {import("@graphql-codegen/cli").CodegenConfig } */
  const codegen = {
    generates: {
      [outPath]: {
        preset: "client",
        presetConfig: {
          fragmentMasking: false,
          gqlTagName: "gql",
        },
      },
    },
  };
  return {
    documents: resolveDocumentsPaths(vendor, protocol),
    extensions: {
      codegen,
    },
    schema: [resolveSchema(vendor, protocol)],
  };
}

function resolveDocumentsPaths(vendor, protocol) {
  const common = [
    "./src/exports/fragments/common/asset.ts",
    `./src/exports/fragments/${protocol}/both.ts`,
    `./src/exports/fragments/${protocol}/${vendor}.ts`,
  ];
  switch (protocol) {
    case "airdrops":
      return common;
    case "flow":
    case "lockup":
      return [...common, "./src/exports/fragments/common/action.ts", "./src/exports/fragments/common/batch.ts"];
  }
  throw new Error(`Unknown protocol: ${protocol}`);
}

function resolveOutPath(vendor, protocol) {
  return `./src/exports/gql/${vendor}/${protocol}/`;
}

function resolveSchema(vendor, protocol) {
  switch (vendor) {
    case "envio":
      switch (protocol) {
        case "airdrops":
          return "https://indexer.hyperindex.xyz/2a39303/v1/graphql";
        case "flow":
          return "https://indexer.hyperindex.xyz/f0e44e8/v1/graphql";
        case "lockup":
          return "https://indexer.hyperindex.xyz/f612ce0/v1/graphql";
      }
      throw new Error(`Unknown protocol: ${protocol}`);
    case "graph":
      switch (protocol) {
        case "airdrops":
          return "https://api.studio.thegraph.com/query/112500/sablier-airdrops-experimental/version/latest";
        case "flow":
          return "https://api.studio.thegraph.com/query/112500/sablier-flow-experimental/version/latest";
        case "lockup":
          return "https://api.studio.thegraph.com/query/112500/sablier-lockup-experimental/version/latest";
      }
      throw new Error(`Unknown protocol: ${protocol}`);
  }
  throw new Error(`Unknown vendor: ${vendor}`);
}

/** @type {import("graphql-config").IGraphQLConfig } */
module.exports = {
  projects: {
    envioAirdrops: get("envio", "airdrops"),
    envioFlow: get("envio", "flow"),
    envioLockup: get("envio", "lockup"),
    graphAirdrops: get("graph", "airdrops"),
    graphFlow: get("graph", "flow"),
    graphLockup: get("graph", "lockup"),
  },
};
