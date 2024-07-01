.PHONY: shell lint outdated update build

shell:
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
	devbox update
	pre-commit autoupdate

test:
	yarn test

declarations: lib
	npx tsc --declaration --esModuleInterop --emitDeclarationOnly --skipLibCheck --allowJs --outDir lib src/*.ts src/*/*.ts
	cp -f src/*.d.ts lib/

.PHONY: lib
lib:
	yarn build

package: declarations
	yarn pack

publish: declarations
	yarn publish

readme-toc:
	gimtoc --file README.md --section 'Table of Contents' --output README.md
