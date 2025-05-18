import { graphChains } from "@src/chains";

if (require.main === module) {
  console.log("✨ Available chains:");
  console.log(graphChains.map((chain) => `${chain.graph.name}`).join(", "));
}
