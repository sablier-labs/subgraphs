import type { Manifest } from "../../types";

export function getCommon(name: string, chainId: number, chainName: string) {
  return {
    kind: "ethereum/contract",
    name,
    network: chainName,
    context: {
      chainId: {
        data: chainId,
        type: "BigInt",
      },
    } as Manifest.Context,
    mapping: {
      apiVersion: "0.0.7",
      kind: "ethereum/events",
      language: "wasm/assemblyscript",
    },
  };
}
