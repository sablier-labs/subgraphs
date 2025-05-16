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

# Generate the GraphQL schema and subgraph manifest
codegen protocol="all" chain_name="":
  @just codegen-manifest {{protocol}} {{chain_name}}
  @just codegen-schema {{protocol}}

# Generate the Envio config
codegen-envio-config protocol="all":
  bun run scripts/codegen/envio-config.ts {{protocol}}

# Generate the The Graph manifest
codegen-manifest protocol="all" chain_name="":
  bun run scripts/codegen/manifest.ts {{protocol}} {{chain_name}}

# Generate the GraphQL schema
codegen-schema protocol="all":
  bun run scripts/codegen/schema.ts {{protocol}}

# Install the Node.js dependencies
install:
  bun install

# Install the Node.js dependencies with frozen lockfile
install-frozen:
  bun install --frozen-lockfile

# Print available log levels
print-log-levels:
  @echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Print available chain arguments
# TODO
print-chain-args:

# Print available protocol arguments
print-protocol-args:
  @echo "Available protocol arguments: all, flow, lockup, airdrops"
  @echo "Note that 'all' will run the codegen script for all protocols"

# Check markdown and YAML files with Prettier
prettier-check:
  bun run prettier --cache --check "**/*.{md,yaml,yml}"

# Format markdown and YAML files with Prettier
prettier-write:
  bun run prettier --cache --write --log-level warn "**/*.{md,yaml,yml}"

# Run Jest tests
test:
  bun run jest

# Type check with TypeScript
tsc-check:
  bun run tsc --noEmit

