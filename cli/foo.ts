export function extractDeploymentId(output: string): string | null {
  const lines = output.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("Build completed:")) {
      // Extract the hash after "Build completed: "
      const hash = trimmedLine.replace("Build completed:", "").trim();
      return hash;
    }
  }

  return null;
}

const output = `
  Skip migration: Bump mapping apiVersion from 0.0.1 to 0.0.2
  Skip migration: Bump mapping apiVersion from 0.0.2 to 0.0.3
  Skip migration: Bump mapping apiVersion from 0.0.3 to 0.0.4
  Skip migration: Bump mapping apiVersion from 0.0.4 to 0.0.5
  Skip migration: Bump mapping apiVersion from 0.0.5 to 0.0.6
  Skip migration: Bump manifest specVersion from 0.0.1 to 0.0.2
  Skip migration: Bump manifest specVersion from 0.0.2 to 0.0.4
✔ Apply migrations
✔ Load subgraph from src/graph/airdrops/manifests/sepolia.yaml
  Compile data source: SablierV2MerkleStreamerFactory_v1_1 => build/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory_v1_1.wasm
  Compile data source: SablierV2MerkleLockupFactory_v1_2 => build/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory_v1_2.wasm
  Compile data source: SablierMerkleFactory_v1_3 => build/SablierMerkleFactory_v1_3/SablierMerkleFactory_v1_3.wasm
  Compile data source template: SablierV2MerkleStreamerLL_v1_1 => build/templates/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL_v1_1.wasm
  Compile data source template: SablierV2MerkleLL_v1_2 => build/templates/SablierV2MerkleLL_v1_2/SablierV2MerkleLL_v1_2.wasm
  Compile data source template: SablierV2MerkleLT_v1_2 => build/templates/SablierV2MerkleLT_v1_2/SablierV2MerkleLT_v1_2.wasm
  Compile data source template: SablierMerkleInstant_v1_3 => build/templates/SablierMerkleInstant_v1_3/SablierMerkleInstant_v1_3.wasm
  Compile data source template: SablierMerkleLL_v1_3 => build/templates/SablierMerkleLL_v1_3/SablierMerkleLL_v1_3.wasm
  Compile data source template: SablierMerkleLT_v1_3 => build/templates/SablierMerkleLT_v1_3/SablierMerkleLT_v1_3.wasm
✔ Compile subgraph
  Copy schema file build/schema.graphql
  Write subgraph file build/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory.json
  Write subgraph file build/SablierV2MerkleStreamerFactory_v1_1/ERC20.json
  Write subgraph file build/SablierV2MerkleStreamerFactory_v1_1/ERC20Bytes.json
  Write subgraph file build/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory.json
  Write subgraph file build/SablierV2MerkleLockupFactory_v1_2/ERC20.json
  Write subgraph file build/SablierV2MerkleLockupFactory_v1_2/ERC20Bytes.json
  Write subgraph file build/SablierMerkleFactory_v1_3/SablierMerkleFactory.json
  Write subgraph file build/SablierMerkleFactory_v1_3/ERC20.json
  Write subgraph file build/SablierMerkleFactory_v1_3/ERC20Bytes.json
  Write subgraph file build/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL.json
  Write subgraph file build/SablierV2MerkleStreamerLL_v1_1/ERC20.json
  Write subgraph file build/SablierV2MerkleStreamerLL_v1_1/ERC20Bytes.json
  Write subgraph file build/SablierV2MerkleLL_v1_2/SablierV2MerkleLL.json
  Write subgraph file build/SablierV2MerkleLL_v1_2/ERC20.json
  Write subgraph file build/SablierV2MerkleLL_v1_2/ERC20Bytes.json
  Write subgraph file build/SablierV2MerkleLT_v1_2/SablierV2MerkleLT.json
  Write subgraph file build/SablierV2MerkleLT_v1_2/ERC20.json
  Write subgraph file build/SablierV2MerkleLT_v1_2/ERC20Bytes.json
  Write subgraph file build/SablierMerkleInstant_v1_3/SablierMerkleInstant.json
  Write subgraph file build/SablierMerkleInstant_v1_3/ERC20.json
  Write subgraph file build/SablierMerkleInstant_v1_3/ERC20Bytes.json
  Write subgraph file build/SablierMerkleLL_v1_3/SablierMerkleLL.json
  Write subgraph file build/SablierMerkleLL_v1_3/ERC20.json
  Write subgraph file build/SablierMerkleLL_v1_3/ERC20Bytes.json
  Write subgraph file build/SablierMerkleLT_v1_3/SablierMerkleLT.json
  Write subgraph file build/SablierMerkleLT_v1_3/ERC20.json
  Write subgraph file build/SablierMerkleLT_v1_3/ERC20Bytes.json
  Write subgraph manifest build/subgraph.yaml
✔ Write compiled subgraph to build/
  Add file to IPFS build/schema.graphql
                .. QmSSbMGERzCPrU6mE2J7Mw3fgf7SKPaQF9JdHpuh2pA4AV
  Add file to IPFS build/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory.json
                .. QmNmXF5s9vzS8QNNb3aneMzXLzuSxyH2jTd6fKbftcWsmD
  Add file to IPFS build/SablierV2MerkleStreamerFactory_v1_1/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez
  Add file to IPFS build/SablierV2MerkleStreamerFactory_v1_1/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s
  Add file to IPFS build/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory.json
                .. QmdMrGcozrS5WCwuUEHZ83H1mmssAB6cLhLDDcxH7pDXQc
  Add file to IPFS build/SablierV2MerkleLockupFactory_v1_2/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierV2MerkleLockupFactory_v1_2/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/SablierMerkleFactory_v1_3/SablierMerkleFactory.json
                .. QmbUEXEnEjtCMwNQnKQUsmoudzCygXbNp5cnSsSFpBRUvy
  Add file to IPFS build/SablierMerkleFactory_v1_3/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierMerkleFactory_v1_3/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/SablierV2MerkleStreamerFactory_v1_1/SablierV2MerkleStreamerFactory_v1_1.wasm
                .. QmRzgpLfEKRFZBYeaxDy4u8EVNvGoTfbPpVCobZCwJbTCS
  Add file to IPFS build/SablierV2MerkleLockupFactory_v1_2/SablierV2MerkleLockupFactory_v1_2.wasm
                .. QmSjwVSj1bWqfCP3tHkDqRLYMyewY5DpJD41wBb73a7F5T
  Add file to IPFS build/SablierMerkleFactory_v1_3/SablierMerkleFactory_v1_3.wasm
                .. QmTYgZMhDVG5L5j5q3QqesTWMRMxFuLjtGtv21E2fo1vcN
  Add file to IPFS build/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL.json
                .. QmZHzwYq7zwX2LoUQUjCsdpeDnsd9JwPtxiQ9sJX41Mtub
  Add file to IPFS build/SablierV2MerkleStreamerLL_v1_1/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierV2MerkleStreamerLL_v1_1/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL_v1_1.wasm
                .. QmXDAyCLX5yDYdfktYjziYr9kZokH5rkcHB3xeSS1Pdonv
  Add file to IPFS build/SablierV2MerkleLL_v1_2/SablierV2MerkleLL.json
                .. Qmc5VtNa6bU6xQBR3rMbd8Spz7PEPmtzW6RLhG8KGA2VZC
  Add file to IPFS build/SablierV2MerkleLL_v1_2/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierV2MerkleLL_v1_2/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierV2MerkleLL_v1_2/SablierV2MerkleLL_v1_2.wasm
                .. QmVioGDTWpa3XnV7ejFac5kfNSpEPCQQZYN9edigEPKqLJ
  Add file to IPFS build/SablierV2MerkleLT_v1_2/SablierV2MerkleLT.json
                .. QmbbTiSguHBw8XBVGG4z2cJVJ4tL8UTgppS5cAXVsxbF1Z
  Add file to IPFS build/SablierV2MerkleLT_v1_2/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierV2MerkleLT_v1_2/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierV2MerkleLT_v1_2/SablierV2MerkleLT_v1_2.wasm
                .. QmeybCCpuGx834AHGhqy6qbACFmGthLqkQWgzNERW42DZe
  Add file to IPFS build/SablierMerkleInstant_v1_3/SablierMerkleInstant.json
                .. QmYkFUr4GPfA8nTwTPmewByBsuLQArobErrtEYUvvFbxda
  Add file to IPFS build/SablierMerkleInstant_v1_3/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierMerkleInstant_v1_3/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierMerkleInstant_v1_3/SablierMerkleInstant_v1_3.wasm
                .. QmT5TRkGJz5S77gTK9hovH9CihCXwk44Uqf5iya1NiDdrQ
  Add file to IPFS build/SablierMerkleLL_v1_3/SablierMerkleLL.json
                .. QmXNjFWG5qDZFCLfNZ4Tm3kuWFu6amoZwcw6uTEWDQydr9
  Add file to IPFS build/SablierMerkleLL_v1_3/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierMerkleLL_v1_3/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierMerkleLL_v1_3/SablierMerkleLL_v1_3.wasm
                .. QmWYQMZhThoz1TqKu3jy5Xnz4LqDePX3fSHEhuk56S4hVJ
  Add file to IPFS build/SablierMerkleLT_v1_3/SablierMerkleLT.json
                .. QmNxNV9gw1wRSfZ8cZVyTwkXsq2J3aZ2oUQeAHAyHtPByd
  Add file to IPFS build/SablierMerkleLT_v1_3/ERC20.json
                .. QmYm7rD7sAvjqrQsHgiy8QpNgZLTNGHyGZiFKD5fCYj5Ez (already uploaded)
  Add file to IPFS build/SablierMerkleLT_v1_3/ERC20Bytes.json
                .. QmcgcKFij23MDHn5ym613NtQs76mdgzyHZcNABZskg9v8s (already uploaded)
  Add file to IPFS build/templates/SablierMerkleLT_v1_3/SablierMerkleLT_v1_3.wasm
                .. QmVHK2GDH1n8A21r9WoLo3hMBjC5V1Kkf5jiNGbeu96zYq
✔ Upload subgraph to IPFS

Build completed: QmdpzxNobBLctqs3XcSXr3VdwscbRrMuVj1dQNVhW7TKF4

Deployed to https://thegraph.com/studio/subgraph/sablier-airdrops-experimental

Subgraph endpoints:
Queries (HTTP):     https://api.studio.thegraph.com/query/112500/sablier-airdrops-experimental/v1.3--v1.0.0-alpha.17

I would like to write a helper function  that filters out all logs except for:

Build completed: QmdpzxNobBLctqs3XcSXr3VdwscbRrMuVj1dQNVhW7TKF4

Deployed to https://thegraph.com/studio/subgraph/sablier-airdrops-experimental

Subgraph endpoints:
Queries (HTTP):     https://api.studio.thegraph.com/query/112500/sablier-airdrops-experimental/v1.3--v1.0.0-alpha.17
`;

const result = extractDeploymentId(output);
console.log({ result });
