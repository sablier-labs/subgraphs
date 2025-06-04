import { graphChains } from "@src/chains";

if (require.main === module) {
  console.log("✨ Available chains:");
  console.log(graphChains.map((c) => `- ${c.graph.name}`).join("\n"));
}
