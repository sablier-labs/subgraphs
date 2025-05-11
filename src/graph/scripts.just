# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

ipfs_url := "https://api.thegraph.com/ipfs"
node_lightlink := "https://graph.pegasus.lightlink.io/rpc"
node_ultra := "https://graph.evm.ultra.io"
node_xdc := "https://graph.xinfin.network"

# ---------------------------------------------------------------------------- #
#                                   VARIABLES                                  #
# ---------------------------------------------------------------------------- #

# The directory containing the scripts
scripts_dir := "../../../scripts"

# ---------------------------------------------------------------------------- #
#                                PUBLIC RECIPES                                #
# ---------------------------------------------------------------------------- #

foo:
  @echo {{PROTOCOL}}

# Authenticate with Graph hosted service
auth:
  bun run graph auth --product hosted-service

# Build the subgraph
@build: codegen
  bun run graph build manifests/ethereum.yaml

# Clean auto-generated files
clean:
  rm -rf bindings build schema.graphql

# Generate everything needed for building the subgraph: GraphQL schema, YAML manifest, and AssemblyScript bindings
codegen: codegen-schema codegen-bindings

# Generate subgraph bindings
@codegen-bindings: (codegen-manifest "ethereum")
  bun run graph codegen manifests/ethereum.yaml --output-dir bindings

# Generate subgraph manifest for a specific chain
@codegen-manifest chain_name:
  # The path is relative to each protocol's directory
  bun run {{scripts_dir}}/codegen-manifest.ts {{PROTOCOL}} {{chain_name}}

# Generate GraphQL schema
@codegen-schema:
  bun run {{scripts_dir}}/codegen-schema.ts {{PROTOCOL}}

# Deploy the subgraph
deploy chain_name:
  bun run graph deploy sablier-{{PROTOCOL}}-{{chain_name}} manifests/{{chain_name}}.yaml

# Deploy to Lightlink
deploy_lightlink:
  _deploy_custom {{node_lightlink}} {{ipfs_url}} {{PROTOCOL}} lightlink

# Deploy to Ultra
deploy_ultra:
  _deploy_custom {{node_ultra}} {{ipfs_url}} {{PROTOCOL}} ultra

# Deploy to XDC
deploy_xdc:
  _deploy_custom {{node_xdc}} {{ipfs_url}} {{PROTOCOL}} xdc

# ---------------------------------------------------------------------------- #
#                               INTERNAL RECIPES                               #
# ---------------------------------------------------------------------------- #

# Deploy to a custom The Graph endpoint
_deploy_custom node_url ipfs_url protocol chain_name: build
  bun run graph deploy \
    --ipfs {{ipfs_url}} \
    --node {{node_url}} \
    {{chain_name}}/sablier-{{protocol}}-{{chain_name}} \
    manifests/{{chain_name}}.yaml
