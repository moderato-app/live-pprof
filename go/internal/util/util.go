package util

import (
	"fmt"
	"os"
	"strings"
)

func IsRunningAsGoRun() bool {
	execPath, err := os.Executable()
	if err != nil {
		return false
	}

	fmt.Printf("exec path: %s\n", execPath)
	// go run
	res := strings.Contains(execPath, "go-build")
	// GoLand
	res = res || strings.Contains(execPath, "go_build")

	return res
}
