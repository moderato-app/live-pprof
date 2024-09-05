package chi

import (
	"io"
	"io/fs"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/moderato-app/live-pprof/assets"
	"github.com/moderato-app/live-pprof/pkg"

	"github.com/stretchr/testify/assert"
)

func TestWebServer(t *testing.T) {
	chi, err := WebServer()
	assert.NoError(t, err)

	ts := httptest.NewServer(chi)

	resp, err := http.Get(ts.URL + "/")
	assert.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusOK)
	assert.Contains(t, resp.Header.Get("Content-Type"), "text/html")

	data, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	bodyStr := string(data)
	t.Log("body:", bodyStr)

	assert.Contains(t, bodyStr, "Live pprof")
}

func TestMemFSHTTPServer(t *testing.T) {
	z, err := assets.Web.Open("web/html.zip")
	assert.NoError(t, err)
	defer z.Close()

	assert.NoError(t, err)

	mf, err := pkg.Unzip(z)
	assert.NoError(t, err)

	ts := httptest.NewServer(http.FileServer(http.FS(mf)))

	resp, err := http.Get(ts.URL + "/")
	assert.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, resp.StatusCode, http.StatusOK)
	assert.Contains(t, resp.Header.Get("Content-Type"), "text/html")

	data, err := io.ReadAll(resp.Body)
	assert.NoError(t, err)
	bodyStr := string(data)
	t.Log("body:", bodyStr)

	assert.Contains(t, bodyStr, "Live pprof")
}

func TestFileNotExists(t *testing.T) {
	_, err := assets.Web.Open("web/html2")
	assert.ErrorIs(t, err, fs.ErrNotExist)
}
