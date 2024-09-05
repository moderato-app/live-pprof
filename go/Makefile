BINARY_NAME = live-pprof
ENTRY = ./cmd/live-pprof/live-pprof.go

.PHONY: build

all: protoc test build
release: protoc test build-for-release

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
	 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME} ${ENTRY}

build-for-release:
	@echo "Building go for release"
	GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-linux-amd64 ${ENTRY};
	GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-linux-arm64 ${ENTRY};
	GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-darwin-amd64 ${ENTRY};
	GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-darwin-arm64 ${ENTRY};
	GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-windows-amd64.exe ${ENTRY};
	GOOS=windows GOARCH=arm64 go build -ldflags="-s -w" -tags prod -o build/${BINARY_NAME}-windows-arm64.exe ${ENTRY};
	cd build; \
	tar -zcvf ${BINARY_NAME}-linux-amd64.tar.gz ${BINARY_NAME}-linux-amd64; \
	tar -zcvf ${BINARY_NAME}-linux-arm64.tar.gz ${BINARY_NAME}-linux-arm64; \
	tar -zcvf ${BINARY_NAME}-darwin-amd64.tar.gz ${BINARY_NAME}-darwin-amd64; \
	tar -zcvf ${BINARY_NAME}-darwin-arm64.tar.gz ${BINARY_NAME}-darwin-arm64; \
	zip -r ${BINARY_NAME}-windows-amd64.exe.zip ${BINARY_NAME}-windows-amd64.exe; \
	zip -r ${BINARY_NAME}-windows-arm64.exe.zip ${BINARY_NAME}-windows-arm64.exe;

test:
	@echo "Testing go"
	 go test ./...

clean:
	@echo "Cleaning go"
	go clean; rm -rf build
