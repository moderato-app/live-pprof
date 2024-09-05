//go:build !prod

package assets

import "embed"

//go:embed mock-data
var MockData embed.FS
