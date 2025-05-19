# Set default log level if not specified
export LOG_LEVEL := env_var_or_default("LOG_LEVEL", "info")

# Show available commands
default:
  @just --list

# Check code with Biome
biome-check:
  bun run biome check .

# Fix code with Biome
# See https://github.com/biomejs/biome-vscode/discussions/576
biome-write:
  bun run biome check --write .
  bun run biome lint --write --only correctness/noUnusedImports .

# Build all The Graph subgraphs
build-graph:
  just -f src/graph/airdrops/justfile build
  just -f src/graph/flow/justfile build
  just -f src/graph/lockup/justfile build

# Run all checks
check: biome-check prettier-check tsc-check

# Clean build files
clean:
  rm -rf **/bindings **/build **/logs

# Fix all issues
fix: biome-write prettier-write

# Generate:
# - The GraphQL schema
# - The subgraph manifest
# - The Envio config
@codegen protocol="all" chain_name="":
  @just codegen-schema {{protocol}}
  @just codegen-manifest {{protocol}} {{chain_name}}
  @just codegen-config {{protocol}}

# Generate the Envio config
@codegen-config protocol="all":
  bun run scripts/codegen/envio-config.ts {{protocol}}

# Generate the subgraph manifest
@codegen-manifest protocol="all" chain_name="":
  bun run scripts/codegen/graph-manifest.ts {{protocol}} {{chain_name}}

# Generate the GraphQL schema
@codegen-schema protocol="all":
  bun run scripts/codegen/schema.ts {{protocol}}

# Install the Node.js dependencies
install:
  bun install

# Install the Node.js dependencies with frozen lockfile
install-frozen:
  bun install --frozen-lockfile

# Print available chain arguments
@print-chains:
  bun run scripts/print-chains.ts

# Print available log levels available in Winston
@print-log-levels:
  echo "Available log levels: error, warn, info, http, verbose, debug, silly"

# Print available protocol arguments
@print-protocol-args:
  echo "Available protocol arguments: all, flow, lockup, airdrops"

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

