import type { Sablier } from "sablier";

/**
 * @see https://docs.envio.dev/docs/HyperIndex/configuration-file#interactive-schema-explorer
 */
export namespace EnvioConfig {
  export type Event = {
    event: string;
  };

  export type Contract = {
    name: string;
    abi_file_path: string;
    handler: string;
    events: Event[];
  };

  export type HypersyncConfig = {
    url: string;
  };

  export type NetworkContract = {
    name: string;
    address?: Sablier.Address | Sablier.Address[];
  };

  export type NetworkRPC = {
    url: string;
    for: "fallback";
    interval_ceiling?: number;
  };

  export type Network = {
    id: number;
    start_block: number;
    hypersync_config?: HypersyncConfig;
    rpc?: NetworkRPC[];
    contracts: NetworkContract[];
  };

  export type FieldSelection = {
    transaction_fields: string[];
  };

  /**
   * This will be inlined. There will not be a `topSection` key in the manifest.
   */
  export type TopSection = {
    name: string;
    ecosystem: "evm";
    output: string;
    schema: string;
    unordered_multichain_mode: boolean;
    field_selection: FieldSelection;
    contracts: Contract[];
    networks: Network[];
  };
}
