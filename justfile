# See https://github.com/sablier-labs/devkit/blob/main/just/base.just
import "./node_modules/@sablier/devkit/just/base.just"

set dotenv-load := true

# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #

export LOG_LEVEL := env("LOG_LEVEL", "info")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

GLOBS_CLEAN := "**/{bindings,build,generated,logs}"
GLOBS_CLEAN_IGNORE := "!src/graph/common/bindings"

# ---------------------------------------------------------------------------- #
#                                 RECIPES: BASE                                #
# ---------------------------------------------------------------------------- #

# Show available commands
default: full-check

# Build the project
build: (clean "dist")
    pnpm tsc -p tsconfig.build.json
alias b := build

# Remove build files
clean globs=GLOBS_CLEAN:
    pnpm dlx del-cli "{{ globs }}" "{{ GLOBS_CLEAN_IGNORE }}"

# Generate the schemas in the ./src/exports directory
export-schemas +globs="src/exports/schemas/*.graphql":
    just cli export-schemas
    just biome-write "{{ globs }}"

# Fetch assets from The Graph subgraphs and save them to JSON files
[group("envio")]
@fetch-assets protocol="all" chain="all":
    just cli fetch-assets --protocol {{ protocol }} --chain {{ chain }}

# Setup Husky
setup:
    pnpm husky

# Run Jest tests
test:
    pnpm jest
alias t := test

# ---------------------------------------------------------------------------- #
#                               RECIPES: CODEGEN                               #
# ---------------------------------------------------------------------------- #

# Build all subgraphs
[group("graph")]
@build-graph-indexers protocol="all":
    just for-each _build-graph {{ protocol }}

_build-graph-indexer protocol: (codegen-graph protocol)
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
    pnpm envio codegen \
        --config $protocol_dir/config.yaml \
        --output-directory $protocol_dir/bindings

# Codegen the Envio config YAML
[group("codegen")]
[group("envio")]
@codegen-envio-config protocol="all":
    just cli codegen envio-config --protocol {{ protocol }}

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
    pnpm dlx del-cli $protocol_dir/bindings
    pnpm graph codegen \
        --output-dir $protocol_dir/bindings \
        $protocol_dir/manifests/ethereum.yaml

# Codegen the Graph subgraph manifest
[group("codegen")]
[group("graph")]
@codegen-graph-manifest protocol="all" chain="all":
    just cli codegen graph-manifest --protocol {{ protocol }} --chain {{ chain }}

# Codegen the GraphQL schema
[group("codegen")]
[group("envio")]
[group("graph")]
@codegen-schema vendor="all" protocol="all":
    just cli codegen schema \
        --vendor {{ vendor }} \
        --protocol {{ protocol }}

# ---------------------------------------------------------------------------- #
#                                RECIPES: PRINT                                #
# ---------------------------------------------------------------------------- #

# Print available chain arguments
[group("print")]
@print-chains:
    just cli print chains

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

# Helper to run CLI commands through the main entry point
[private]
@cli *args:
    pnpm tsx cli/index.ts {{ args }}

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
