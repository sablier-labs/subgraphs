import { contracts, type Sablier, Version } from "@sablier/deployments";
import type { Types } from "../types";

export const flowContracts: Types.ContractSource<Sablier.Version.Flow>[] = [
  {
    isTemplate: false,
    name: contracts.names.SABLIER_FLOW,
    versions: [Version.Flow.V1_0, Version.Flow.V1_1],
  },
];
