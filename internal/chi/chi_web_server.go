package chi

import (
	"errors"
	"fmt"
	"io/fs"
	"net/http"
	"net/http/pprof"
	_ "net/http/pprof"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/moderato-app/live-pprof/assets"
	"github.com/moderato-app/live-pprof/pkg"
)

func WebServer(middlewares ...func(http.Handler) http.Handler) (*chi.Mux, error) {
	router := chi.NewRouter()
	router.Use(
		chiMiddleware.Logger,
		chiMiddleware.Recoverer,
	)

	for _, middleware := range middlewares {
		router.Use(middleware)
	}

	dir, err := staticFS()
	if err != nil {
		return nil, err
	}

	router.Handle("/debug/pprof", http.RedirectHandler("/debug/pprof/", http.StatusTemporaryRedirect))
	router.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	router.HandleFunc("/debug/pprof/profile", pprof.Profile)
	router.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	router.HandleFunc("/debug/pprof/trace", pprof.Trace)
	router.HandleFunc("/debug/pprof/*", pprof.Index)

	router.Handle("/*", http.FileServer(http.FS(dir)))

	return router, nil
}

// staticFS use web/html as static files. If web/html does not exist,
// extract web/html.zip into a memory FS
func staticFS() (fs.FS, error) {
	_, err := assets.Web.Open("web/html")

	if err != nil {
		// There are 2 cases when web/html doesn't exist:
		// 1. During development when web/html isn't generated yet.
		// 2. When live-pprof is installed using `go install github.com/moderato-app/live-pprof`.
		// In these cases, we can use the html.zip files as static content. They may not have the latest code,
		// but they'll still work.
		if errors.Is(err, fs.ErrNotExist) {
			z, err := assets.Web.Open("web/html.zip")
			if err != nil {
				return nil, fmt.Errorf("failed to open web/html.zip: %w", err)
			}
			defer z.Close()

			mf, err := pkg.Unzip(z)
			if err != nil {
				return nil, fmt.Errorf("failed to unzip web/html.zip: %w", err)
			}
			return mf, nil
		} else {
			return nil, fmt.Errorf("failed to open web/html: %w", err)
		}
	}

	dir, err := fs.Sub(assets.Web, "web/html")
	if err != nil {
		return nil, fmt.Errorf("failed to open web/html: %w", err)
	}
	return dir, nil
}
