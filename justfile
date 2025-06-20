# See https://github.com/sablier-labs/devkit/blob/main/just/base.just
import "./node_modules/@sablier/devkit/just/base.just"

set dotenv-load := true

# ---------------------------------------------------------------------------- #
#                               ENVIRONMENT VARS                               #
# ---------------------------------------------------------------------------- #

export LOG_LEVEL := env("LOG_LEVEL", "info")

# ---------------------------------------------------------------------------- #
#                                   CONSTANTS                                  #
# ---------------------------------------------------------------------------- #

GLOBS_CLEAN := "**/{bindings,build,generated,logs}"
GLOBS_CLEAN_IGNORE := "!src/graph/common/bindings"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Show available commands
default: full-check

# Build the project
build: (clean "dist")
    pnpm tsc -p tsconfig.build.json
alias b := build

# Fetch assets from The Graph subgraphs and save them to JSON files
[group("envio")]
@check-vendors chain_id="1":
    just cli check-vendors --chain-id {{ chain_id }}

# Remove build files
clean globs=GLOBS_CLEAN:
    pnpm dlx del-cli "{{ globs }}" "{{ GLOBS_CLEAN_IGNORE }}"

# Codegen all vendors
[group("codegen")]
@codegen:
    just codegen-envio
    echo ""
    just codegen-graph

# Fetch assets from The Graph subgraphs and save them to JSON files
[group("envio")]
@fetch-assets protocol="all" chain="all":
    just cli fetch-assets --protocol {{ protocol }} --chain {{ chain }}

# Generate the schemas in the ./src/exports directory
# lint-staged will pass the globs to this recipe
export-schemas +globs="src/exports/schemas/*.graphql":
    just cli export-schemas
    just biome-write "{{ globs }}"

# Codegen the GraphQL schema
[group("codegen")]
[group("envio")]
[group("graph")]
@codegen-schema vendor="all" protocol="all":
    just cli codegen schema \
        --vendor {{ vendor }} \
        --protocol {{ protocol }}

# Setup Husky
setup:
    pnpm husky

# Run tests
test args="--silent":
    pnpm vitest run {{ args }}
alias t := test

# ---------------------------------------------------------------------------- #
#                                RECIPES: GRAPH                                #
# ---------------------------------------------------------------------------- #

# Build all Graph indexers
[group("graph")]
@build-graph-indexer protocol="all":
    just for-each _build-graph-indexer {{ protocol }}

_build-graph-indexer protocol: (codegen-graph protocol)
    #!/usr/bin/env sh
    manifest_path=src/graph/{{ protocol }}/manifests/mainnet.yaml
    if ! pnpm graph build \
        $manifest_path \
        --output-dir src/graph/{{ protocol }}/build \
        src/graph/{{ protocol }}/manifests/experimental.yaml

# Codegen all vendors
[group("codegen")]
@codegen:
    just codegen-envio
    just codegen-graph

# Codegen everything for the Envio indexer (order matters):
# 1. GraphQL schema
# 2. Envio config YAML
[doc("Codegen everything for the Envio indexer")]
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

# Codegen everything for the Graph indexer (order matters):
# 1. GraphQL schema
# 2. YAML manifest
# 3. AssemblyScript bindings
[doc("Codegen everything for the Graph indexer")]
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
        $protocol_dir/manifests/experimental.yaml

# Codegen the Graph subgraph manifest
[group("codegen")]
[group("graph")]
@codegen-graph-manifest protocol="all" chain="all":
    just cli codegen graph-manifest \
        --protocol {{ protocol }} \
        --chain {{ chain }}

# ---------------------------------------------------------------------------- #
#                                RECIPES: ENVIO                                #
# ---------------------------------------------------------------------------- #

# Codegen everything for the Envio indexer (order matters):
# 1. GraphQL schema
# 2. Envio config YAML
[doc("Codegen everything for the Envio indexer")]
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
    if ! pnpm envio codegen \
        --config $protocol_dir/config.yaml \
        --output-directory $protocol_dir/bindings \
        &>/dev/null
    then
        echo "❌ Codegen failed — comment this line or run the 'envio codegen' command directly to see the output"
        exit 1
    fi
    echo "✅ Generated Envio bindings"

# Codegen the Envio config YAML
[group("codegen")]
[group("envio")]
@codegen-envio-config protocol="all":
    just cli codegen envio-config --protocol {{ protocol }}

# ---------------------------------------------------------------------------- #
#                                RECIPES: PRINT                                #
# ---------------------------------------------------------------------------- #

# Print available chain arguments
[group("print")]
@print-chains use_graph_slugs="false":
    just cli print chains --graph {{ use_graph_slugs }}

# Print available log levels available in Winston logger
[group("print")]
@print-log-levels:
    echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Print available protocol arguments
[group("print")]
@print-protocols:
    echo "Available protocol arguments: all, flow, lockup, airdrops"

# ---------------------------------------------------------------------------- #
#                           RECIPES: PRIVATE HELPERS                           #
# ---------------------------------------------------------------------------- #

# Helper to run CLI commands through the main entry point
[private]
@cli *args:
    pnpm tsx cli/index.ts {{ args }}

# Helper to run a recipe for all protocols or a specific one
[private]
for-each recipe protocol:
    #!/usr/bin/env sh
    if [ "{{ protocol }}" = "all" ]; then
        just {{ recipe }} airdrops
        just {{ recipe }} flow
        just {{ recipe }} lockup
    else
        just {{ recipe }} {{ protocol }}
    fi
