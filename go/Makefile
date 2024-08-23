all: protoc test build

protoc:
	@if [ ! -d "./api" ]; then \
		mkdir ./api; \
	fi
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	protoc --go_out=./api --go_opt=paths=source_relative --go-grpc_out=./api --go-grpc_opt=paths=source_relative --proto_path ../proto ../proto/api.proto

build:
	 go build .

test:
	 go test ./...

clean:
	 go clean
