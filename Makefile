.PHONY: env lint outdated update build

env:
	tmuxinator

lint:
	pre-commit run --all-files --verbose

eslint:
	yarn lint

install:
	yarn install

outdated:
	yarn outdated

update:
	yarn upgrade
	pre-commit autoupdate
	nix flake update

test:
	yarn test

declarations: lib
	tsc --declaration --emitDeclarationOnly --skipLibCheck --allowJs --outDir lib src/*.ts >/dev/null 2>&1

.PHONY: lib
lib:
	yarn build

build: declarations

readme-toc:
	gimtoc --file README.md --section 'Table of Contents' --output README.md
