import indexedContracts from "@src/contracts";
import type { EnvioConfig } from "@src/envio-config/types";
import indexedEvents from "@src/events";
import { sanitizeName } from "@src/helpers";
import { getRelativePath, paths } from "@src/paths";
import type { Indexed } from "@src/types";

export function createContracts(protocol: Indexed.Protocol): EnvioConfig.Contract[] {
  const contracts: EnvioConfig.Contract[] = [];
  for (const indexedContract of indexedContracts[protocol]) {
    for (const version of indexedContract.versions) {
      contracts.push({
        abi_file_path: getRelativeAbiFilePath(protocol, indexedContract.name, version),
        events: resolveEvents(indexedEvents[protocol][indexedContract.name][version]),
        handler: `mappings/${version}/index.ts`,
        name: sanitizeName(indexedContract.name, version),
      });
    }
  }

  return contracts;
}

function getRelativeAbiFilePath(protocol: Indexed.Protocol, contractName: string, version: Indexed.Version): string {
  const envioConfigDir = paths.envioConfig(protocol);
  const abiPath = paths.abi(contractName, protocol, version);
  return getRelativePath(envioConfigDir, abiPath);
}

/**
 * Resolves the event names from the indexed events.
 */
function resolveEvents(indexedEvents: Indexed.Event[]): EnvioConfig.Event[] {
  const events: EnvioConfig.Event[] = [];
  for (const indexedEvent of indexedEvents) {
    const event = {
      event: indexedEvent.eventName,
    };
    events.push(event);
  }
  return events;
}
