mod root "../../justfile"

set allow-duplicate-variables := true
set shell := ["bash", "-euo", "pipefail", "-c"]

# ---------------------------------------------------------------------------- #
#                                    RECIPES                                   #
# ---------------------------------------------------------------------------- #

# Remove build files
clean:
    pnpm dlx del-cli bindings build

# Codegen everything for the Envio indexer
@codegen:
    just root::codegen-envio $PROTOCOL
alias c := codegen

# Codegen the Envio bindings
@codegen-bindings:
    just root::codegen-envio-bindings $PROTOCOL
alias cb := codegen-bindings

# Codegen the Envio config
@codegen-config:
    just root::codegen-envio-config $PROTOCOL
alias cc := codegen-config

# Codegen the Envio schema
@codegen-schema:
    just root::codegen-schema envio $PROTOCOL
alias cs := codegen-schema

# Envio CLI: dev, start, stop
@envio command:
    just _envio {{ command }}

# ---------------------------------------------------------------------------- #
#                               RECIPES: HELPERS                               #
# ---------------------------------------------------------------------------- #

_envio command tui_off="false":
    TUI_OFF={{ tui_off }} pnpm envio {{ command }} \
    --config {{ justfile_dir() }}/config.yaml \
    --output-directory {{ justfile_dir() }}/bindings
