import type { Sablier } from "@sablier/deployments";
import indexedContracts from "@src/contracts";
import type { EnvioConfig } from "@src/envio-config/types";
import indexedEvents from "@src/events";
import { sanitizeName } from "@src/helpers";
import { paths } from "@src/paths";
import { getRelativePath } from "@src/paths";
import type { IndexedEvent, IndexedProtocol } from "@src/types";

export function createContracts(protocol: IndexedProtocol): EnvioConfig.Contract[] {
  const contracts: EnvioConfig.Contract[] = [];
  for (const contract of indexedContracts[protocol]) {
    for (const version of contract.versions) {
      contracts.push({
        name: sanitizeName(contract.name, version),
        abi_file_path: getRelativeAbiFilePath(protocol, contract.name, version),
        handler: `mappings/${version}/index.ts`,
        events: resolveEvents(indexedEvents[protocol][contract.name][version]),
      });
    }
  }

  return contracts;
}

function getRelativeAbiFilePath(protocol: IndexedProtocol, contractName: string, version: Sablier.Version): string {
  const envioConfigDir = paths.envioConfig(protocol);
  const abiPath = paths.abi(contractName, protocol, version);
  return getRelativePath(envioConfigDir, abiPath);
}

/**
 * Resolves the event names from the indexed events.
 */
function resolveEvents(indexedEvents: IndexedEvent[]): EnvioConfig.Event[] {
  const events: EnvioConfig.Event[] = [];
  for (const indexedEvent of indexedEvents) {
    const event = {
      event: indexedEvent.eventName,
    };
    events.push(event);
  }
  return events;
}
