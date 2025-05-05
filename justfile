# Show available commands
default:
    @just --list

# Check code with Biome
biome-check:
    bun run biome check .

# Fix code with Biome
biome-write:
    bun run biome check --write .

# Clean generated files and node_modules
clean:
    bun run rimraf **/build **/generated node_modules

# Run all checks
full-check: biome-check prettier-check

# Fix all issues
full-fix: biome-write prettier-write

# Authenticate with Graph hosted service
graph-auth:
    bun run graph auth --product hosted-service

# Check markdown and YAML files with Prettier
prettier-check:
    bun run prettier --cache --check "**/*.{md,yaml,yml}"

# Format markdown and YAML files with Prettier
prettier-write:
    bun run prettier --cache --write --log-level warn "**/*.{md,yaml,yml}"

# Generate the subgraph manifests using the Handlebars YAML templates
render-manifests protocol="" chain_name="":
    bun run scripts/render-manifests.ts {{protocol}} {{chain_name}}

# Type check with TypeScript
tsc-check:
    tsc --noEmit

