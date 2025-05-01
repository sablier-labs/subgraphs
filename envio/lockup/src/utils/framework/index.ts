import { getClient } from "./client";
import {
  getERC20BytesContract,
  getERC20Contract,
  getPRBProxyContract,
  getPRBProxyRegistryContract,
} from "./contracts";

export const framework = {
  getClient,
  getERC20Contract,
  getERC20BytesContract,
  getPRBProxyContract,
  getPRBProxyRegistryContract,
};
