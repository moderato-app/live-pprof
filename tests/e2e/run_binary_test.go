//go:build e2e

package e2e

import (
	"fmt"
	"net/http"
	"strconv"
	"testing"

	. "github.com/Eun/go-hit"
	"github.com/go-cmd/cmd"
	. "github.com/moderato-app/live-pprof/tests/framework"
	"github.com/stretchr/testify/assert"
)

//goland:noinspection HttpUrlsUsage
func TestRunBinary(t *testing.T) {

	binary, err := FindBinary(t)
	assert.NoError(t, err, "failed to find binary")

	host := "localhost"
	port := 12345

	c := cmd.NewCmd(binary, "-n", "--port", strconv.Itoa(port), "--host", host)

	c.Start()
	defer c.Stop()

	WaitForRunningOrFail(t, c, true)

	assert.True(t, LogContainsText(c.Status(), "listening on localhost:12345") ||
		LogContainsText(c.Status(), "listening on 127.0.0.1:12345"), WhatsWrong(c.Status()))

	url := fmt.Sprintf("http://%s:%d", host, port)

	Test(t,
		Description("Get home page: "+url),
		Get(url),
		Expect().Status().Equal(http.StatusOK),
		Expect().Body().String().Contains("Live pprof"),
	)

	url = fmt.Sprintf("http://%s:%d/favicon.ico", host, port)

	Test(t,
		Description("Get favicon.ico: "+url),
		Get(url),
		Expect().Status().Equal(http.StatusOK),
		Expect().Headers("content-type").First().Contains("image"),
		Expect().Body().Bytes().Len().GreaterThan(0),
	)
}
