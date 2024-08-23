all: protoc test build

protoc:
	$(MAKE) -C go protoc
	$(MAKE) -C ts protoc

test:
	$(MAKE) -C go test
	$(MAKE) -C ts test

build:
	$(MAKE) -C go build
	$(MAKE) -C ts build

clean:
	$(MAKE) -C go clean
	$(MAKE) -C ts clean
