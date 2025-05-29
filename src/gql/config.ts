/**
 * @file See https://the-guild.dev/graphql/codegen/docs/config-reference/multiproject-config
 */

import type { CodegenConfig } from "@graphql-codegen/cli";
import paths from "@src/paths";
import type { Indexed } from "@src/types";

function get(vendor: Indexed.Vendor, protocol: Indexed.Protocol): CodegenConfig {
  return {
    documents: [paths.gql.documents("common"), paths.gql.documents(protocol)],
    generates: {
      [paths.out.gql(vendor, protocol)]: {
        preset: "client",
        presetConfig: {
          fragmentMasking: false,
          gqlTagName: "gql",
        },
      },
    },
    schema: [paths.schema(vendor, protocol)],
  };
}

const config: {
  [vendor in Indexed.Vendor]: {
    [protocol in Indexed.Protocol]: CodegenConfig;
  };
} = {
  envio: {
    airdrops: get("envio", "airdrops"),
    flow: get("envio", "flow"),
    lockup: get("envio", "lockup"),
  },
  graph: {
    airdrops: get("graph", "airdrops"),
    flow: get("graph", "flow"),
    lockup: get("graph", "lockup"),
  },
};

export default config;
