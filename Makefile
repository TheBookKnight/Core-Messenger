## build: Builds Core Messenger
.PHONY: build 
build:
	@docker build --tag cadav001/core-messenger:latest --platform linux/amd64  .

## start: Starts Core Messenger
.PHONY: start
start:
	@docker-compose build
	@docker-compose up --detach

## stop: Stops Core Messenger
.PHONY: stop
stop:
	@docker-compose down --volumes

## config: Copies the config.json to Core Messenger
config:
	@docker cp config.json core-messenger:/usr/src/bot/

.PHONY: help
help: Makefile
	@sed -n 's/^##//p' $< | column -t -s ':' | sed -e 's/^/ /'