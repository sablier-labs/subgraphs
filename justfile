# Set default log level if not specified
export LOG_LEVEL := env_var_or_default("LOG_LEVEL", "info")

# Show available commands
default:
  @just --list

# Check code with Biome
biome-check:
  bun run biome check .

# Fix code with Biome
biome-write:
  bun run biome check --write .

# Run all checks
check: biome-check prettier-check tsc-check

# Clean build files
clean:
  rm -rf **/bindings **/build **/logs

# Fix all issues
fix: biome-write prettier-write

# Generate the subgraph manifests using the Handlebars YAML templates
generate-manifests protocol="" chain_name="":
  bun run scripts/generate-manifests.ts {{protocol}} {{chain_name}}

# List available log levels
log-levels:
  @echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Check markdown and YAML files with Prettier
prettier-check:
  bun run prettier --cache --check "**/*.{md,yaml,yml}"

# Format markdown and YAML files with Prettier
prettier-write:
  bun run prettier --cache --write --log-level warn "**/*.{md,yaml,yml}"

# Type check with TypeScript
tsc-check:
  bun run tsc --noEmit

