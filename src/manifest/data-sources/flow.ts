import type { Sablier } from "@sablier/deployments";
import _ from "lodash";
import type { Manifest } from "../../types";
import ABIs from "../abi-entries";
import entities from "../entities";
import eventHandlers from "../event-handlers";
import { getCommon } from "./common";

export function getFlow(
  version: keyof typeof eventHandlers.flow,
  contract: Sablier.Contract | undefined,
  chainId: number,
  chainName: string,
) {
  if (!contract) {
    throw new Error(`Flow contract not found for ${version}`);
  }
  if (!contract.block) {
    throw new Error(`Block number not found for ${contract.name} for Flow ${version}`);
  }

  const dataSourceName = `${contract.name}-${version}`;
  const common = getCommon(dataSourceName, chainId, chainName);

  return _.merge({}, common, {
    source: {
      address: contract.address,
      abi: contract.name,
      startBlock: contract.block,
    } as Manifest.Source,
    mapping: {
      abis: ABIs.flow[version],
      entities: entities.flow[version],
      eventHandlers: eventHandlers.flow[version],
      file: `../mappings/flow/${version}.ts`,
    },
  });
}
