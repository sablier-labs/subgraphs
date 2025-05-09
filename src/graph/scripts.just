ipfs_url := "https://api.thegraph.com/ipfs"
node_lightlink := "https://graph.pegasus.lightlink.io/rpc"
node_ultra := "https://graph.evm.ultra.io"
node_xdc := "https://graph.xinfin.network"

# Authenticate with Graph hosted service
auth:
  bun run graph auth --product hosted-service

# Build the subgraph
build:
  @# @if [ ! -d "bindings" ]; then \
  @#   echo "bindings directory doesn't exist, running codegen..."; \
  @#   just codegen; \
  @# fi
  just codegen
  bun run graph build manifests/ethereum.yaml

# Clean files
clean:
  rm -rf bindings build

# Deploy to Lightlink
deploy_lightlink protocol:
  _deploy_custom {{node_lightlink}} {{ipfs_url}} {{protocol}} lightlink

# Deploy to Ultra
deploy_ultra protocol:
  _deploy_custom {{node_ultra}} {{ipfs_url}} {{protocol}} ultra

# Deploy to XDC
deploy_xdc protocol:
  _deploy_custom {{node_xdc}} {{ipfs_url}} {{protocol}} xdc

# Deploy to a custom The Graph endpoint
_deploy_custom node_url ipfs_url protocol chain_name: build
  bun run graph deploy \
    --node {{node_url}} \
    --ipfs {{ipfs_url}} \
    {{chain_name}}/sablier-{{protocol}}-{{chain_name}} \
    manifests/{{chain_name}}.yaml

# Generate the manifest for Ethereum since the bindings are shared
_generate_manifest protocol="" chain_name="":
  @# The path is relative to each protocol's directory
  bun run ../../../scripts/generate-manifests.ts {{protocol}} {{chain_name}}
