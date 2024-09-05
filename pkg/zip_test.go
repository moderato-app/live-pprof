package pkg

import (
	"embed"
	"io"
	"testing"

	"github.com/stretchr/testify/assert"
)

//go:embed all:test_data
var TestData embed.FS

func TestUnzip(t *testing.T) {
	z, err := TestData.Open("test_data/html.zip")
	defer z.Close()
	assert.NoError(t, err)

	fs, err := Unzip(z)
	assert.NoError(t, err)

	html, err := fs.Open("index.html")
	assert.NoError(t, err)

	stat, err := html.Stat()
	assert.NoError(t, err)

	assert.Greater(t, stat.Size(), int64(0))
	all, err := io.ReadAll(html)
	assert.NoError(t, err)

	assert.Contains(t, string(all), "Live pprof")
}
