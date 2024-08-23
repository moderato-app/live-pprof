# mode=grpcwebtext prevents client from receiving all the messages at once when using streaming

build: protoc test build

protoc:
	@if [ ! -d "./components/api" ]; then \
		mkdir ./components/api; \
	fi
	protoc -I=../proto api.proto \
	  --js_out=import_style=commonjs,binary:./components/api \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./components/api


build:
	pnpm build

test:
	pnpm test

install:
	pnpm install

clean:
	rm -rf out
