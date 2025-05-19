import type { Sablier } from "@sablier/deployments";
import { Version } from "@sablier/deployments";
import type { Indexed } from "@src/types";

const lockupContracts: Indexed.ContractSource<Sablier.Version.Lockup>[] = [
  {
    isTemplate: false,
    name: "SablierV2LockupDynamic",
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: "SablierV2LockupLinear",
    versions: [Version.Lockup.V1_0, Version.Lockup.V1_1, Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: "SablierV2LockupTranched",
    versions: [Version.Lockup.V1_2],
  },
  {
    isTemplate: false,
    name: "SablierLockup",
    versions: [Version.Lockup.V2_0],
  },
];

export default lockupContracts;
