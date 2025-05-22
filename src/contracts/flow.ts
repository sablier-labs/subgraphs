import { contracts, type Sablier, Version } from "@sablier/deployments";
import type { Indexed } from "@src/types";

const flowContracts: Indexed.ContractSource<Sablier.Version.Flow>[] = [
  {
    isTemplate: false,
    name: contracts.names.SABLIER_FLOW,
    versions: [Version.Flow.V1_0, Version.Flow.V1_1],
  },
];

export default flowContracts;
