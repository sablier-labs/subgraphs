mod root "../../justfile"

set allow-duplicate-variables := true

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Remove build files
clean:
    rm -rf bindings build

# Codegen everything for the Envio indexer
@codegen:
    just root::codegen-envio $PROTOCOL

# Codegen the Envio bindings
@codegen-bindings:
    just root::codegen-envio-bindings $PROTOCOL

# Codegen the Envio config
@codegen-config:
    just root::codegen-envio-config $PROTOCOL

# Codegen the Envio schema
@codegen-schema:
    just root::codegen-schema envio $PROTOCOL

dev: codegen
    MAX_BATCH_SIZE=1 pnpm envio dev \
    --config {{ justfile_dir() }}/config.yaml \
    --directory {{ justfile_dir() }} \
    --output-directory {{ justfile_dir() }}/bindings
