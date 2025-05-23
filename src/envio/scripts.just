mod root "../../justfile"

set allow-duplicate-variables

# ---------------------------------------------------------------------------- #
#                                  ENVIRONMENT                                 #
# ---------------------------------------------------------------------------- #

# Has to be specified by each protocol's justfile
export PROTOCOL := env_var_or_default("PROTOCOL", "")

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Remove build files
clean:
    rm -rf bindings build

# Codegen everything for the Envio indexer
@codegen:
    just root::codegen-envio {{ PROTOCOL }}

# Codegen the Envio bindings
@codegen-bindings:
    just root::codegen-envio-bindings {{ PROTOCOL }}

# Codegen the Envio config
@codegen-config:
    just root::codegen-envio-config {{ PROTOCOL }}

# Codegen the Envio schema
@codegen-schema:
    just root::codegen-schema envio {{ PROTOCOL }}
