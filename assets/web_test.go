package assets

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestZipContent(t *testing.T) {
	z, err := Web.Open("web/html.zip")
	defer z.Close()
	assert.NoError(t, err)

	stat, err := z.Stat()
	assert.NoError(t, err)

	assert.Greater(t, stat.Size(), int64(0))
	assert.Equal(t, stat.Name(), "html.zip")
}
