mod root "../../justfile"

set allow-duplicate-variables := true

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
alias b := build

# Remove build files
clean:
    rm -rf bindings build

# Codegen the subgraph
[group("codegen")]
@codegen:
    just root::codegen-graph {{ PROTOCOL }}

# Codegen the subgraph bindings
[group("codegen")]
@codegen-bindings:
    just root::codegen-graph-bindings {{ PROTOCOL }}

# Codegen the subgraph manifest
[group("codegen")]
@codegen-manifest chain="ethereum":
    just root::codegen-graph-manifest {{ PROTOCOL }} {{ chain }}

# Codegen the GraphQL schema
[group("codegen")]
@codegen-schema:
    just root::codegen-schema graph {{ PROTOCOL }}

# Deploy the subgraph
[group("deploy")]
deploy chain version: build
    pnpm graph deploy \
    --version-label {{ version }} \
    sablier-{{ PROTOCOL }}-{{ chain }} \
    {{ justfile_dir() }}/manifests/{{ chain }}.yaml

# Deploy to experimental subgraph on Ethereum Sepolia
[group("deploy")]
deploy-experimental version: build
    pnpm graph deploy \
    --version-label {{ version }} \
    sablier-{{ PROTOCOL }}-experimental \
    {{ justfile_dir() }}/manifests/sepolia.yaml

# Deploy to Lightlink
[group("deploy")]
deploy-lightlink version:
    _deploy-custom lightlink \
    {{ version }} \
    {{ NODE_LIGHTLINK }} \
    {{ IPFS_URL }}

# Deploy to XDC
[group("deploy")]
deploy-xdc version:
    _deploy-custom xdc \
    {{ version }} \
    {{ NODE_XDC }} \
    {{ IPFS_URL }}

# ---------------------------------------------------------------------------- #
#                               RECIPES: HELPERS                               #
# ---------------------------------------------------------------------------- #

# Deploy to a custom The Graph endpoint
_deploy-custom chain version node_url ipfs_url=IPFS_URL: build
    #!/usr/bin/env sh
    subgraph_name="{{ chain }}/sablier-{{ PROTOCOL }}-{{ chain }}"
    pnpm graph deploy \
        --version-label {{ version }} \
        --ipfs {{ ipfs_url }} \
        --node {{ node_url }} \
        $subgraph_name \
        {{ justfile_dir() }}/manifests/{{ chain }}.yaml
