import { ChainId } from "@sablier/deployments/dist/chains/ids";
import { renderSubgraph } from "./utils/render-subgraph";

renderSubgraph("flow", ChainId.ARBITRUM_ONE, "subgraph.template.yaml", "subgraph.yaml");
