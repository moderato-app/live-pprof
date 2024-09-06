GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

define print_step
	@echo "$(GREEN)===== $(1) =====$(RESET)"
endef

.PHONY: protoc build release test test-e2e build-for-release

all: build
	$(call print_step, Done)

release: build-for-release
	$(call print_step, Done)

protoc:
	$(call print_step, Generating protobuf files)
	$(MAKE) -f go.mk protoc
	$(MAKE) -C ts protoc

build: protoc
	$(call print_step, Building)
	$(MAKE) -C ts build
	$(MAKE) copy
	$(MAKE) -f go.mk build

build-for-release: protoc
	$(call print_step, Build for releasing)
	$(MAKE) -C ts build
	$(MAKE) copy
	$(MAKE) zip
	$(MAKE) -f go.mk build-for-release

test: build
	$(call print_step, Testing)
	$(MAKE) -f go.mk test
	$(MAKE) -C ts test

test-e2e: build
	$(call print_step, Testing e2e)
	$(MAKE) -f go.mk test-e2e
	$(MAKE) clean
	$(MAKE) protoc build-for-release
	$(call print_step, Testing e2e again)
	$(MAKE) -f go.mk test-e2e

clean:
	$(call print_step, Cleaning)
	$(MAKE) -f go.mk clean
	$(MAKE) -C ts clean
	@echo "Removing static files from go"
	@if [ -d "./assets/web/html" ]; then \
		rm -rf ./assets/web/html; \
	fi

copy:
	$(call print_step, Removing static files)
	@if [ -d "./assets/web/html" ]; then \
		rm -rf ./assets/web/html; \
	fi
	$(call print_step, Copying static files)
	cp -r ts/out assets/web/html

zip:
	$(call print_step, Removing zip)
	@if [ -d "rm ./assets/web/html.zip" ]; then \
		rm -rf rm ./assets/web/html.zip; \
	fi

	$(call print_step, Copying zip)
	# this won't work as it creates ts/out entry in the .zip: zip -r assets/web/html.zip  ts/out/*
	cd ts/out && zip -r ../../assets/web/html.zip ./*
