package assets

import "embed"

//go:embed mock-data
var MockData embed.FS

// Web The all: prefix (added in Go 1.18) ensures that any files or directories prefixed with . or _ are included:
//
//go:embed all:web
var Web embed.FS
