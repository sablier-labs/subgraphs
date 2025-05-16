import type { Sablier } from "@sablier/deployments";

/**
 * @see https://docs.envio.dev/docs/HyperIndex/configuration-file#interactive-schema-explorer
 */
export namespace EnvioConfig {
  export interface Event {
    event: string;
  }

  export interface Contract {
    name: string;
    abi_file_path: string;
    handler: string;
    events: Event[];
  }

  export interface HypersyncConfig {
    url: string;
  }

  export interface NetworkContract {
    name: string;
    address: Sablier.Address | Sablier.Address[];
  }

  export interface Network {
    id: number;
    start_block: number;
    hypersync_config?: HypersyncConfig;
    contracts: NetworkContract[];
  }

  export interface FieldSelection {
    transaction_fields: string[];
  }

  /**
   * This will be inlined. There will not be a `topSection` key in the manifest.
   */
  export interface TopSection {
    name: string;
    unordered_multichain_mode: boolean;
    rollback_on_reorg: boolean;
    field_selection: FieldSelection;
    contracts: Contract[];
    networks: Network[];
  }
}
