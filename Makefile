GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

define print_step
	@echo "$(GREEN)===== $(1) =====$(RESET)"
endef


all: protoc test build
	$(call print_step, Done)

release: protoc test build-for-release
	$(call print_step, Done)

protoc:
	$(call print_step, Generating protobuf files)
	$(MAKE) -C go protoc
	$(MAKE) -C ts protoc

test:
	$(call print_step, Testing)
	$(MAKE) -C go test
	$(MAKE) -C ts test

build:
	$(call print_step, Building)
	$(MAKE) -C ts build
	$(MAKE) copy
	$(MAKE) -C go build

build-for-release:
	$(call print_step, Build for releasing)
	$(MAKE) -C ts build
	$(MAKE) copy
	$(MAKE) -C go build-for-release

clean:
	$(call print_step, Cleaning)
	$(MAKE) -C go clean
	$(MAKE) -C ts clean
	@echo "Removing static files from go"
	@if [ -d "./go/assets/web/html" ]; then \
		rm -rf ./go/assets/web/html; \
	fi

copy:
	$(call print_step, Removing static files from go)
	@if [ -d "./go/assets/web/html" ]; then \
		rm -rf ./go/assets/web/html; \
	fi
	$(call print_step, Copying static files to go)
	cp -r ts/out go/assets/web/html
