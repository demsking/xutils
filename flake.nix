{
  description = "Common Utils";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=23.11";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        envDir = "./venv";
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = with pkgs; mkShell {
          EDITOR = "vim";
          NODE_ENV = "development";
          buildInputs = [
            # tmux
            git
            tmux
            gitmux
            tmuxinator

            # devtools
            yarn
            nodejs

            # pre-commit
            which
            pre-commit
            editorconfig-checker
          ];
          shellHook = ''
            # Python
            export PYTHONPATH=${envDir}:$PYTHONPATH

            # Node.js
            mkdir -p .nix-node

            export NODE_PATH=$PWD/.nix-node
            export PATH=$NODE_PATH/bin:node_modules/.bin:$PATH

            npm config set prefix $NODE_PATH

            # Install pre-commit hooks
            pre-commit install -f
          '';
        };
      });
}
