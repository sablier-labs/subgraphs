# ---------------------------------------------------------------------------- #
#                                   VARIABLES                                  #
# ---------------------------------------------------------------------------- #

# The directory containing the scripts, relative to the root of each protocol's directory
scripts_dir := "../../../scripts"

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Clean auto-generated files
clean:
  rm -rf bindings build

# Generate everything needed for building the indexer (the order matters!):
# 1. GraphQL schema
# 2. Envio bindings
codegen: clean codegen-schema codegen-envio

# Generate Envio bindings
@codegen-envio:
  bun run envio codegen --config config.yaml --output-directory bindings

# Generate GraphQL schema
@codegen-schema:
	bun run {{scripts_dir}}/codegen/schema.ts "{{PROTOCOL}}";
