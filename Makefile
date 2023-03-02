install:
	@yarn --silent install

build:
	@yarn --silent build

run: build
	@yarn --silent run-cli $(p)

.DEFAULT_GOAL := install

.PHONY: install build