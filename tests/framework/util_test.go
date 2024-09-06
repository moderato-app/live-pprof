package framework

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRootDir(t *testing.T) {
	wd, err := os.Getwd()
	assert.NoError(t, err)

	rootDir := filepath.Dir(filepath.Dir(wd))
	assert.Equal(t, RootDir(t), rootDir)
}
