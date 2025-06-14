import { Protocol } from "sablier";
import type { Indexer } from "../types";

export const envioRecords: Record<Indexer.Protocol, Indexer.EnvioDeployment> = {
  airdrops: {
    createdOn: 1_712_673_343, // April 8, 2024
    endpoint: {
      id: "508d217",
      get url() {
        return `https://indexer.hyperindex.xyz/${this.id}/v1/graphql`;
      },
    },
    explorerURL: "https://envio.dev/app/sablier-labs/airdrop-envio",
    isLatest: true,
    protocol: Protocol.Airdrops,
  },
  flow: {
    createdOn: 1_731_318_958, // November 1, 2024
    endpoint: {
      id: "3b4ea6b",
      get url() {
        return `https://indexer.hyperindex.xyz/${this.id}/v1/graphql`;
      },
    },
    explorerURL: "https://envio.dev/app/sablier-labs/flow-envio",
    isLatest: true,
    protocol: Protocol.Flow,
  },
  lockup: {
    createdOn: 1_712_673_343, // April 8, 2024
    endpoint: {
      id: "53b7e25",
      get url() {
        return `https://indexer.hyperindex.xyz/${this.id}/v1/graphql`;
      },
    },
    explorerURL: "https://envio.dev/app/sablier-labs/lockup-envio",
    isLatest: true,
    protocol: Protocol.Lockup,
  },
};
