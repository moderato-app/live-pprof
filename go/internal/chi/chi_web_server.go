package chi

import (
	"io/fs"
	"net/http"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/moderato-app/live-pprof/assets"
	"github.com/moderato-app/live-pprof/internal/logging"
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

	router.Handle("/*", http.FileServer(http.FS(w)))

	return router
}
