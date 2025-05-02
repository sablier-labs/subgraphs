import * as fs from "node:fs";
import { type Sablier, getChainName, releasesByProtocol } from "@sablier/deployments";
import * as Handlebars from "handlebars";
import _ from "lodash";
import isSupported from "./is-supported";
import startBlocks from "./start-blocks";

type SubgraphData = {
  chain: string;
  initializerAddress: string;
  startBlock: number;
};

export function renderSubgraph(
  protocol: Sablier.Protocol,
  chainId: number,
  templatePath: string,
  outputPath: string,
): void {
  if (!isSupported[chainId]) {
    // TODO: use Winston to log stuff with info level
    return;
  }

  const template = fs.readFileSync(templatePath, "utf-8");
  const renderer = Handlebars.compile(template);

  const release = getFirstRelease(protocol);
  const deployment = getDeployment(release, chainId);
  if (!deployment) {
    throw new Error(`Deployment not found for first release of ${protocol} on ${chainId}`);
  }

  // TODO: map our chain names to The Graph's chain names
  const chainName = getChainName(chainId);

  const contract = _.find(deployment.contracts, { name: "SablierFlow" });
  if (!contract) {
    throw new Error("Contract not found for TBD");
  }

  const startBlock = startBlocks[deployment.chainId][release.protocol];
  if (!startBlock) {
    throw new Error("Start block not found for TBD");
  }

  const data: SubgraphData = {
    chain: chainName,
    initializerAddress: contract.address,
    startBlock,
  };

  const result = renderer(data);
  fs.writeFileSync(outputPath, result);
}

function getFirstRelease(protocol: Sablier.Protocol): Sablier.Release {
  return releasesByProtocol[protocol][0];
}

function getDeployment(release: Sablier.Release, chainId: number): Sablier.Deployment | undefined {
  return _.find(release.deployments, { chainId });
}
