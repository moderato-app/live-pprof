package chi

import (
	"io/fs"
	"net/http"
	"net/http/pprof"
	_ "net/http/pprof"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/moderato-app/go/live-pprof/assets"
	"github.com/moderato-app/go/live-pprof/internal/logging"
)

func WebServer(g *grpcweb.WrappedGrpcServer) *chi.Mux {
	router := chi.NewRouter()
	router.Use(
		chiMiddleware.Logger,
		chiMiddleware.Recoverer,
		grpcMiddleware(g),
	)
	w, err := fs.Sub(assets.Web, "web/html")
	if err != nil {
		logging.Sugar.Panic(err)
	}

	router.Handle("/debug/pprof", http.RedirectHandler("/debug/pprof/", http.StatusTemporaryRedirect))
	router.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	router.HandleFunc("/debug/pprof/profile", pprof.Profile)
	router.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	router.HandleFunc("/debug/pprof/trace", pprof.Trace)
	router.HandleFunc("/debug/pprof/*", pprof.Index)

	router.Handle("/*", http.FileServer(http.FS(w)))

	return router
}
