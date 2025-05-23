mod root "../../justfile"

set allow-duplicate-variables

# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #

# Has to be specified by each protocol's justfile
export PROTOCOL := env_var_or_default("PROTOCOL", "")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

IPFS_URL := "https://api.thegraph.com/ipfs"
NODE_LIGHTLINK := "https://graph.pegasus.lightlink.io/rpc"
NODE_XDC := "https://graph.xinfin.network"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Build the subgraph
@build:
    just root::build-graph {{ PROTOCOL }}

# Remove build files
clean:
    rm -rf bindings build

# Codegen the subgraph
@codegen:
    just root::codegen-graph {{ PROTOCOL }}

# Codegen the subgraph bindings
@codegen-bindings:
    just root::codegen-graph-bindings {{ PROTOCOL }}

# Codegen the subgraph manifest
@codegen-manifest chain="ethereum":
    just root::codegen-graph-manifest {{ PROTOCOL }} {{ chain }}

# Codegen the GraphQL schema
@codegen-schema:
    just root::codegen-schema graph {{ PROTOCOL }}

# Deploy the subgraph
deploy chain:
    pnpm graph deploy \
    sablier-{{ PROTOCOL }}-{{ chain }} \
    {{ justfile_dir() }}/manifests/{{ chain }}.yaml

# Deploy to Lightlink
deploy-lightlink:
    _deploy-custom lightlink \
    {{ PROTOCOL }} \
    {{ NODE_LIGHTLINK }} \
    {{ IPFS_URL }}

# Deploy to XDC
deploy-xdc:
    _deploy-custom xdc \
    {{ PROTOCOL }} \
    {{ NODE_XDC }} \
    {{ IPFS_URL }}

# ---------------------------------------------------------------------------- #
#                               RECIPES: HELPERS                               #
# ---------------------------------------------------------------------------- #

# Deploy to a custom The Graph endpoint
_deploy-custom chain protocol node_url ipfs_url=IPFS_URL: build
    #!/usr/bin/env sh
    subgraph_name="{{ chain }}/sablier-{{ protocol }}-{{ chain }}"
    pnpm graph deploy \
      --ipfs {{ ipfs_url }} \
      --node {{ node_url }} \
      $subgraph_name \
      {{ justfile_dir() }}/manifests/{{ chain }}.yaml
