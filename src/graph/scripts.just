set allow-duplicate-variables

# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #
# Has to be specified by each protocol's justfile

export PROTOCOL := ""

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

IPFS_URL := "https://api.thegraph.com/ipfs"
NODE_LIGHTLINK := "https://graph.pegasus.lightlink.io/rpc"
NODE_XDC := "https://graph.xinfin.network"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Authenticate with Graph hosted service
auth:
    bun run graph auth --product hosted-service

# Build the subgraph
@build: codegen
    bun run graph build manifests/ethereum.yaml --output-dir build

# Clean auto-generated files
@clean:
    rm -rf bindings build

# Generate everything needed for building the subgraph (the order matters):
# 1. GraphQL schema
# 2. YAML manifest

# 3. AssemblyScript bindings
codegen: clean codegen-schema codegen-bindings

# Generate subgraph bindings
@codegen-bindings: (codegen-manifest "ethereum")
    bun run graph codegen manifests/ethereum.yaml --output-dir bindings

# Generate subgraph manifest for a specific chain
@codegen-manifest chain_name:
    bun run {{ source_dir() }}/../../scripts/codegen/graph-manifest.ts {{ PROTOCOL }} {{ chain_name }}

# Generate GraphQL schema
@codegen-schema:
    bun run {{ source_dir() }}/../../scripts/codegen/schema.ts "{{ PROTOCOL }}"

# Deploy the subgraph
deploy chain_name:
    bun run graph deploy sablier-{{ PROTOCOL }}-{{ chain_name }} manifests/{{ chain_name }}.yaml

# Deploy to Lightlink
deploy_lightlink:
    _deploy_custom {{ NODE_LIGHTLINK }} {{ IPFS_URL }} {{ PROTOCOL }} lightlink

# Deploy to XDC
deploy_xdc:
    _deploy_custom {{ NODE_XDC }} {{ IPFS_URL }} {{ PROTOCOL }} xdc

# Run tests with Matchstick
test:
    bun run graph test

# ---------------------------------------------------------------------------- #
#                                    PRIVATE                                   #
# ---------------------------------------------------------------------------- #

# Deploy to a custom The Graph endpoint
_deploy_custom node_url ipfs_url protocol chain_name: build
    bun run graph deploy \
      --ipfs {{ ipfs_url }} \
      --node {{ node_url }} \
      {{ chain_name }}/sablier-{{ protocol }}-{{ chain_name }} \
      manifests/{{ chain_name }}.yaml
