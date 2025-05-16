import { chains as generator } from "./_generated/original/bundles/flow-envio";

export const chains = generator();

export function configuration(chainId: number | string | bigint) {
  const configuration = chains.find((c) => String(c.id) === chainId.toString());

  if (!configuration) {
    throw new Error("Missing chain configuration");
  }

  return {
    ...configuration,
    contracts: [...configuration["v1.0"].flow, ...configuration["v1.1"].flow],
  };
}
