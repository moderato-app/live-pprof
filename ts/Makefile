# mode=grpcwebtext prevents client from receiving all the messages at once when using streaming

all: protoc test build

protoc:
	@if [ ! -d "./components/api" ]; then \
		mkdir ./components/api; \
	fi
	pnpm install -g protoc-gen-js protoc-gen-grpc-web
	protoc -I=../proto api.proto \
	  --js_out=import_style=commonjs,binary:./components/api \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./components/api

build: install
	pnpm build

test: install
	pnpm test

install:
	pnpm install && pnpm install -D vitest

clean:
	rm -rf out
