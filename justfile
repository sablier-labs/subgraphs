set dotenv-load := true
set shell := ["bash", "-euo", "pipefail", "-c"]

# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #

export LOG_LEVEL := env_var_or_default("LOG_LEVEL", "info")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

globs_prettier := "**/*.{md,yaml,yml}"

# ---------------------------------------------------------------------------- #
#                                 RECIPES: BASE                                #
# ---------------------------------------------------------------------------- #

# Show available commands
default: full-check

# Authenticate with Graph hosted service
[group("graph")]
auth:
    pnpm graph auth $GRAPH_DEPLOY_KEY

# Check code with Biome
biome-check:
    pnpm biome check .

alias bc := biome-check

[doc("Fix code with Biome")]
biome-write:
    pnpm biome check --write .
    pnpm biome lint --write --only correctness/noUnusedImports .
alias bw := biome-write

# Remove build files
clean:
    rm -rf **/bindings **/build **/generated **/logs

# Run all code checks
full-check: biome-check prettier-check tsc-check
alias check := full-check
alias fc := full-check

# Run all code fixes
full-write: biome-write prettier-write
alias write := full-write
alias fw := full-write

# Install the Node.js dependencies
install *args:
    ni install {{ args }}

# Check code with Prettier
prettier-check:
    pnpm prettier --cache --check "{{ globs_prettier }}"
alias pc := prettier-check

# Format code with Prettier
prettier-write:
    pnpm prettier --cache --write "{{ globs_prettier }}"
alias pw := prettier-write

# Setup Husky
setup:
    pnpm husky

# Run Jest tests
test:
    pnpm jest
alias t := test

# Type check with TypeScript
tsc-check:
    pnpm tsc --noEmit

# ---------------------------------------------------------------------------- #
#                               RECIPES: CODEGEN                               #
# ---------------------------------------------------------------------------- #

# Build all subgraphs
[group("graph")]
@build-graph protocol="all":
    just for-each _build-graph {{ protocol }}

_build-graph protocol: (codegen-graph protocol)
    pnpm graph build \
        --output-dir src/graph/{{ protocol }}/build \
        src/graph/{{ protocol }}/manifests/ethereum.yaml

# Codegen all vendors
[group("codegen")]
@codegen:
    just codegen-envio
    just codegen-graph

# Codegen everything for the Envio indexer (order matters):
# 1. GraphQL schema
# 2. Envio config YAML
[doc("Codegen everything needed for building the Envio indexer")]
[group("codegen")]
[group("envio")]
@codegen-envio protocol="all":
    just for-each _codegen-envio {{ protocol }}

@_codegen-envio protocol:
    just codegen-schema envio {{ protocol }}
    just codegen-envio-config {{ protocol }}
    just codegen-envio-bindings {{ protocol }}

# Codegen the Envio bindings
[group("codegen")]
[group("envio")]
@codegen-envio-bindings protocol="all":
    just for-each _codegen-envio-bindings {{ protocol }}

_codegen-envio-bindings protocol:
    #!/usr/bin/env sh
    protocol_dir="src/envio/{{ protocol }}"
    rm -rf $protocol_dir/bindings
    pnpm envio codegen \
        --config $protocol_dir/config.yaml \
        --output-directory $protocol_dir/bindings

# Codegen the Envio config YAML
[group("codegen")]
[group("envio")]
@codegen-envio-config protocol="all":
    pnpm tsx scripts/codegen/envio-config.ts {{ protocol }}

# Codegen the GraphQL types
[group("codegen")]
[group("gql")]
codegen-gql vendor protocol: (codegen-schema vendor protocol)
    #!/usr/bin/env sh
    pnpm graphql-codegen \
        --config src/gql/config.js \
        --project {{ vendor }}_{{ protocol }}

# Codegen everything for the Graph subgraph (order matters):
# 1. GraphQL schema
# 2. YAML manifest
# 3. AssemblyScript bindings
[doc("Codegen everything needed for building the Graph subgraph")]
[group("codegen")]
[group("graph")]
@codegen-graph protocol="all":
    just for-each _codegen-graph {{ protocol }}

@_codegen-graph protocol:
    just codegen-schema graph {{ protocol }}
    just codegen-graph-manifest {{ protocol }} all
    just codegen-graph-bindings {{ protocol }}

# Codegen the Graph subgraph bindings
[group("codegen")]
[group("graph")]
@codegen-graph-bindings protocol="all":
    just for-each _codegen-graph-bindings {{ protocol }}

_codegen-graph-bindings protocol:
    #!/usr/bin/env sh
    protocol_dir="src/graph/{{ protocol }}"
    rm -rf $protocol_dir/bindings
    pnpm graph codegen \
        --output-dir $protocol_dir/bindings \
        $protocol_dir/manifests/ethereum.yaml

# Codegen the Graph subgraph manifest
[group("codegen")]
[group("graph")]
@codegen-graph-manifest protocol="all" chain="all":
    pnpm tsx scripts/codegen/graph-manifest.ts {{ protocol }} {{ chain }}

# Codegen the GraphQL schema
[group("codegen")]
[group("envio")]
[group("graph")]
@codegen-schema vendor="all" protocol="all":
    pnpm tsx scripts/codegen/schema.ts {{ vendor }} {{ protocol }}

# ---------------------------------------------------------------------------- #
#                                RECIPES: PRINT                                #
# ---------------------------------------------------------------------------- #

# Print available chain arguments
[group("print")]
@print-chains:
    pnpm tsc scripts/print-chains.ts

# Print available log levels available in Winston
[group("print")]
@print-log-levels:
    echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Print available protocol arguments
[group("print")]
@print-protocol-args:
    echo "Available protocol arguments: all, flow, lockup, airdrops"

# ---------------------------------------------------------------------------- #
#                               RECIPES: HELPERS                               #
# ---------------------------------------------------------------------------- #

# Helper to run a recipe for all protocols or a specific one
[private]
for-each base_recipe protocol:
    #!/usr/bin/env sh
    if [ "{{ protocol }}" = "all" ]; then
        just {{ base_recipe }} airdrops
        just {{ base_recipe }} flow
        just {{ base_recipe }} lockup
    else
        just {{ base_recipe }} {{ protocol }}
    fi
