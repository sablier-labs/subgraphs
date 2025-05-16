# ---------------------------------------------------------------------------- #
#                                   VARIABLES                                  #
# ---------------------------------------------------------------------------- #

# The directory containing the scripts
scripts_dir := "../../../scripts"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Build the subgraph
@build: codegen
  bun run graph build manifests/ethereum.yaml --output-dir build

# Clean auto-generated files
clean:
  rm -rf bindings build

# Generate everything needed for building the indexer (the order matters):
# 1. GraphQL schema
# 2. Envio bindings
codegen: clean codegen-schema codegen-envio

# Generate Envio bindings
@codegen-envio:
  bun run envio codegen

# Generate GraphQL schema
@codegen-schema:
	bun run {{scripts_dir}}/codegen/schema.ts "{{PROTOCOL}}";
