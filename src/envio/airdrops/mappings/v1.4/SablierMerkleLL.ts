import { Contract } from "../../bindings";
import * as common from "../common";

Contract.Campaign.MerkleLL_v1_4.Clawback.handlerWithLoader(common.clawback);
Contract.Campaign.MerkleLL_v1_4.Claim.handlerWithLoader(common.claimLockup);
Contract.Campaign.MerkleLL_v1_4.TransferAdmin.handlerWithLoader(common.transferAdmin);
