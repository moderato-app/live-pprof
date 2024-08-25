all: protoc test build

protoc:
	$(MAKE) -C go protoc
	$(MAKE) -C ts protoc

test:
	$(MAKE) -C go test
	$(MAKE) -C ts test

build:
	@echo "Building ts..."
	$(MAKE) -C ts build
	@echo "Copying files..."
	$(MAKE) copy
	@echo "Building go..."
	$(MAKE) -C go build

clean:
	$(MAKE) -C go clean
	$(MAKE) -C ts clean
	$(MAKE) -C ts build
	@if [ -d "./go/assets/web/html" ]; then \
		rm -rf ./go/assets/web/html; \
	fi

copy:
	@echo "Running copy..."
	@if [ -d "./go/assets/web/html" ]; then \
		rm -rf ./go/assets/web/html; \
	fi
	cp -r ts/out go/assets/web/html
