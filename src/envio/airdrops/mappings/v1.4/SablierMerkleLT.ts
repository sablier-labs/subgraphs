import { Contract } from "../../bindings";
import * as common from "../common";

Contract.Campaign.MerkleLT_v1_4.Clawback.handlerWithLoader(common.clawback);
Contract.Campaign.MerkleLT_v1_4.Claim.handlerWithLoader(common.claimLockup);
Contract.Campaign.MerkleLT_v1_4.TransferAdmin.handlerWithLoader(common.transferAdmin);
