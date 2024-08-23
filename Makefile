# mode=grpcwebtext prevents client from receiving all the messages at once when using streaming

build: proto build-go build-ts

proto:
	protoc --go_out=./go/api --go_opt=paths=source_relative --go-grpc_out=./go/api --go-grpc_opt=paths=source_relative --proto_path ./proto ./proto/api.proto
	protoc -I=./proto api.proto \
	  --js_out=import_style=commonjs,binary:./ts/components/api \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./ts/components/api

build-go:
	cd go && go build .

build-ts:
	cd ts && pnpm build

test:  test-ts test-go

test-go:
	cd go && go test ./...

test-ts:
	cd ts && pnpm test

install-ts:
	cd ts && pnpm install

clean:
	rm -rf ts/out
	cd go && go clean
