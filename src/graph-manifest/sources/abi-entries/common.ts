import type { GraphManifest } from "@src/graph-manifest/types";
import { createABIEntry as create } from "./helpers";

export const erc20Entry: GraphManifest.ABI = create("ERC20");
export const erc20BytesEntry: GraphManifest.ABI = create("ERC20Bytes");

export const prbProxyEntry: GraphManifest.ABI = create("PRBProxy");
export const prbProxyRegistryEntry: GraphManifest.ABI = create("PRBProxyRegistry");
