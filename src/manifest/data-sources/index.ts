import { type Sablier, flowByVersion, queries } from "@sablier/deployments";
import type { Manifest } from "../../types";
import { getFlow } from "./flow";

export function getDataSources(protocol: Sablier.Protocol, chainId: number, chainName: string): Manifest.DataSource[] {
  switch (protocol) {
    case "flow": {
      const flowV1_0 = {
        contract: queries.contracts.getByReleaseAndChainAndName(flowByVersion["v1.0"], chainId, "SablierFlow"),
        get dataSource() {
          return getFlow("v1.0", this.contract, chainId, chainName);
        },
      };

      const flowV1_1 = {
        contract: queries.contracts.getByReleaseAndChainAndName(flowByVersion["v1.1"], chainId, "SablierFlow"),
        get dataSource() {
          return getFlow("v1.1", this.contract, chainId, chainName);
        },
      };

      return [flowV1_0.dataSource, flowV1_1.dataSource];
    }
    default:
      throw new Error(`Unknown protocol: ${protocol}`);
  }
}
