all: protoc test build

protoc:
	@echo "Generating protobuf files for go"
	@if [ ! -d "./api" ]; then \
		mkdir ./api; \
	fi
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	protoc --go_out=./api --go_opt=paths=source_relative --go-grpc_out=./api --go-grpc_opt=paths=source_relative --proto_path ../proto ../proto/api.proto

build:
	@echo "Building go"
	 go build .

test:
	@echo "Testing go"
	 go test ./...

clean:
	@echo "Cleaning go"
	 go clean
