package framework

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/go-cmd/cmd"
	"github.com/stretchr/testify/assert"
)

func FindBinary(t *testing.T) (string, error) {

	binaryName := "live-pprof"

	rootDir := RootDir(t)
	fileName := path.Join(rootDir, "build", binaryName)

	_, err := os.Stat(fileName)

	if err != nil {
		if os.IsNotExist(err) {
			if runtime.GOOS != "linux" && runtime.GOOS != "windows" && runtime.GOOS != "darwin" {
				return "", fmt.Errorf("unsupported OS: %s", runtime.GOOS)
			}
			fileName = path.Join(rootDir, "build", fmt.Sprintf("%s-%s-%s", binaryName, runtime.GOOS, runtime.GOARCH))

			if runtime.GOOS == "windows" {
				fileName += ".exe"
			}
			if _, err := os.Stat(fileName); os.IsNotExist(err) {
				return "", fmt.Errorf("binary not found: %s, %v", fileName, err)
			}
		} else {
			return "", fmt.Errorf("binary not found: %s, %v", fileName, err)
		}
	}
	return fileName, nil
}

func IsRunning(s cmd.Status) bool {
	return s.Error == nil && s.StartTs > 0 && !s.Complete && s.Exit == -1
}

func LogContainsText(s cmd.Status, text string) bool {
	for _, line := range s.Stdout {
		if strings.Contains(line, text) {
			return true
		}
	}
	for _, line := range s.Stderr {
		if strings.Contains(line, text) {
			return true
		}
	}
	return false
}

func WhatsWrong(s cmd.Status) error {
	if s.Error != nil {
		return s.Error
	}

	marshal, err := json.Marshal(s)
	if err != nil {
		return err
	}
	return errors.New("debug info: " + string(marshal))
}

// WaitForRunningOrFail checks if stdout or stderr has content when mustWaitForStdOutput is true.
// mustWaitForStdOutput is useful when the OS performs security checks on the binary, which can be
// terribly slow on macOS.
func WaitForRunningOrFail(t *testing.T, c *cmd.Cmd, mustWaitForStdOutput bool) {
	timer := time.NewTimer(100 * time.Second)
	ticker := time.NewTicker(100 * time.Millisecond)
	defer timer.Stop()
	defer ticker.Stop()

	for {
		select {
		case <-timer.C:
			t.Fatalf("failed to start: %v", WhatsWrong(c.Status()))
		case <-ticker.C:
			status := c.Status()
			if IsRunning(status) {
				if mustWaitForStdOutput {
					if len(status.Stdout) > 0 || len(status.Stderr) > 0 {
						return
					}
				} else {
					return
				}
			}
		}
	}

}

func RootDir(t *testing.T) string {
	cmdOut, err := exec.Command("git", "rev-parse", "--show-toplevel").Output()
	assert.NoError(t, err)
	return strings.TrimSpace(string(cmdOut))
}
