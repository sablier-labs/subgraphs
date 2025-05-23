# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #

# Set default log level if not specified
export LOG_LEVEL := env_var_or_default("LOG_LEVEL", "info")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

globs_prettier := "**/*.{md,yaml,yml}"

# ---------------------------------------------------------------------------- #
#                                 RECIPES: BASE                                #
# ---------------------------------------------------------------------------- #

# Show available commands
default:
    @just --list

# Authenticate with Graph hosted service
auth:
    pnpm graph auth --product hosted-service

# Check code with Biome
biome-check:
    pnpm biome check .

# Fix code with Biome
# See https://github.com/biomejs/biome-vscode/discussions/576
biome-write:
    pnpm biome check --write .
    pnpm biome lint --write --only correctness/noUnusedImports .

# Clean build files
clean:
    rm -rf **/bindings **/build **/generated **/logs

# Run all code checks
full-check: biome-check prettier-check tsc-check

# Run all code fixes
full-write: biome-write prettier-write

# Install the Node.js dependencies
install *args:
    pnpm install {{ args }}

# Print available chain arguments
@print-chains:
    pnpm exec tsc scripts/print-chains.ts

# Print available log levels available in Winston
@print-log-levels:
    echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Print available protocol arguments
@print-protocol-args:
    echo "Available protocol arguments: all, flow, lockup, airdrops"

# Check markdown and YAML files with Prettier
prettier-check:
    pnpm prettier --cache --check "{{ globs_prettier }}"

# Format markdown and YAML files with Prettier
prettier-write:
    pnpm prettier --cache --write "{{ globs_prettier }}"

# Run Jest tests
test:
    pnpm jest

# Type check with TypeScript
tsc-check:
    pnpm tsc --noEmit


# ---------------------------------------------------------------------------- #
#                               RECIPES: CODEGEN                               #
# ---------------------------------------------------------------------------- #

# Build all subgraphs
@build-graph protocol="all":
    just for-each _build-graph {{ protocol }}

_build-graph protocol: (codegen-graph protocol)
    pnpm graph build \
        --output-dir src/graph/{{ protocol }}/build \
        src/graph/{{ protocol }}/manifests/ethereum.yaml

# Codegen all vendors
@codegen:
    just codegen-envio
    just codegen-graph

# Codegen everything for the Envio indexer (order matters):
# 1. GraphQL schema
# 2. Envio config YAML
# 3. Envio bindings
[doc("Codegen everything needed for building the Envio indexer")]
@codegen-envio protocol="all":
    just for-each _codegen-envio {{ protocol }}

@_codegen-envio protocol:
    just codegen-schema envio {{ protocol }}
    just codegen-envio-config {{ protocol }}
    just codegen-envio-bindings {{ protocol }}

# Codegen the Envio bindings
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
@codegen-envio-config protocol="all":
    pnpm tsx scripts/codegen/envio-config.ts {{ protocol }}

# Codegen everything for the Graph subgraph (order matters):
# 1. GraphQL schema
# 2. YAML manifest
# 3. AssemblyScript bindings
[doc("Codegen everything needed for building the Graph subgraph")]
@codegen-graph protocol="all":
    just for-each _codegen-graph {{ protocol }}

@_codegen-graph protocol:
    just codegen-schema graph {{ protocol }}
    just codegen-graph-manifest {{ protocol }} ethereum
    just codegen-graph-bindings {{ protocol }}

# Codegen the Graph subgraph bindings
@codegen-graph-bindings protocol="all":
    just for-each _codegen-graph-bindings {{ protocol }}

_codegen-graph-bindings-for protocol:
    #!/usr/bin/env sh
    protocol_dir="src/graph/{{ protocol }}"
    rm -rf $protocol_dir/bindings
    pnpm graph codegen \
        --output-dir $protocol_dir/bindings \
        $protocol_dir/manifests/ethereum.yaml

# Codegen the Graph subgraph manifest
@codegen-graph-manifest protocol="all" chain="all":
    pnpm tsx scripts/codegen/graph-manifest.ts {{ protocol }} {{ chain }}

# Codegen the GraphQL schema
@codegen-schema vendor="all" protocol="all":
    pnpm tsx scripts/codegen/schema.ts {{ vendor }} {{ protocol }}

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
