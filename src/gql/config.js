/**
 * @file See https://the-guild.dev/graphql/codegen/docs/config-reference/multiproject-config
 */

function get(vendor, protocol) {
  const outPath = resolveOutPath(vendor, protocol);
  const schemaPath = resolveSchemaPath(vendor, protocol);
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
    documents: [resolveDocumentsPath("common"), resolveDocumentsPath(protocol)],
    extensions: {
      codegen,
    },
    schema: [schemaPath],
  };
}

function resolveDocumentsPath(protocol) {
  return `./${protocol}/**/*`;
}

function resolveOutPath(vendor, protocol) {
  return `../out/gql/${vendor}/${protocol}/`;
}

function resolveSchemaPath(vendor, protocol) {
  return `../${vendor}/${protocol}/schema.graphql`;
}

/** @type {import("graphql-config").IGraphQLConfig } */
module.exports = {
  projects: {
    envio_airdrops: get("envio", "airdrops"),
    envio_flow: get("envio", "flow"),
    envio_lockup: get("envio", "lockup"),
    graph_airdrops: get("graph", "airdrops"),
    graph_flow: get("graph", "flow"),
    graph_lockup: get("graph", "lockup"),
  },
};
