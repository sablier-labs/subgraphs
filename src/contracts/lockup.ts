import type { Sablier } from "@sablier/deployments";
import { contracts, Version } from "@sablier/deployments";
import type { Indexed } from "@src/types";

const lockupContracts: Indexed.ContractSource<Sablier.Version.Lockup>[] = [
  {
    isTemplate: false,
    name: contracts.names.SABLIER_V2_LOCKUP_DYNAMIC,
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: contracts.names.SABLIER_V2_LOCKUP_LINEAR,
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: contracts.names.SABLIER_V2_LOCKUP_TRANCHED,
    versions: [Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: contracts.names.SABLIER_LOCKUP,
    versions: [Version.Lockup.V2_0],
  },
];

export default lockupContracts;
