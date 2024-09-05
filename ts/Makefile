# mode=grpcwebtext prevents client from receiving all the messages at once when using streaming
.PHONY: build

all: protoc disable-telemetry test build

protoc:
	@echo "Generating protobuf files for ts"
	@if [ ! -d "./components/api" ]; then \
		mkdir ./components/api; \
	fi
	pnpm install -g protoc-gen-js protoc-gen-grpc-web
	protoc -I=../proto api.proto \
	  --js_out=import_style=commonjs,binary:./components/api \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./components/api

build: install
	@echo "Building ts"
	pnpm build

test: install
	@echo "Testing ts"
	pnpm test

install:
	@echo "Installing dependencies for ts"
	pnpm install

disable-telemetry:
	@echo "Disabling Next.js telemetry"
	npx next telemetry --disable

analyze:
	ANALYZE=true pnpm build

clean:
	@echo "Cleaning ts"
	rm -rf out
