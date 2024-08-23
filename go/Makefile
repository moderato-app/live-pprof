all: protoc test build

protoc:
	@if [ ! -d "./api" ]; then \
		mkdir ./api; \
	fi
	protoc --go_out=./api --go_opt=paths=source_relative --go-grpc_out=./api --go-grpc_opt=paths=source_relative --proto_path ../proto ../proto/api.proto

build:
	 go build .

test:
	 go test ./...

clean:
	 go clean
