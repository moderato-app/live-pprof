package echo

import (
	"io/fs"
	"net/http"

	"github.com/moderato-app/live-pprof/assets"
	"github.com/moderato-app/live-pprof/internal/logging"

	"github.com/brpaz/echozap"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	echo "github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func WebServer(g *grpcweb.WrappedGrpcServer) *echo.Echo {
	logging.Sugar.Info("initialise web server...")
	e := echo.New()
	e.Logger.SetLevel(log.DEBUG)
	e.HideBanner = true

	e.Use(echozap.ZapLogger(logging.Logger))
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(grpcMiddleware(g))

	e.Use(AllowAllCors)

	w, err := fs.Sub(assets.Web, "web/html")
	if err != nil {
		logging.Sugar.Panic(err)
	}

	s := e.Group("/*")
	s.Use(middleware.Gzip())
	h := http.FileServer(http.FS(w))
	s.Any("/*", func(c echo.Context) error {
		h.ServeHTTP(c.Response(), c.Request())
		return nil
	})
	return e
}
