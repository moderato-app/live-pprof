# mode=grpcwebtext prevents client from receiving all the messages at once when using streaming

.PHONY: build proto go ts

build: proto go ts

proto:
	protoc --go_out=./go/api --go_opt=paths=source_relative --go-grpc_out=./go/api --go-grpc_opt=paths=source_relative --proto_path ./proto ./proto/api.proto
	protoc -I=./proto api.proto \
	  --js_out=import_style=commonjs,binary:./ts/components/api \
	  --grpc-web_out=import_style=typescript,mode=grpcwebtext:./ts/components/api

go:
	cd go && go build .

ts:
	cd ts && pnpm build

clean:
	rm -rf ts/out
	cd go && go clean
