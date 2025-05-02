# Clean files
clean:
  bun run rimraf build generated

# Generate bindings for a specific chain
codegen chain:
  bun run graph codegen --output-dir ./generated manifests/{{chain}}.yaml
