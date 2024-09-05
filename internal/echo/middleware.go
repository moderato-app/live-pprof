package echo

import (
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var AllowAllCors = middleware.CORSWithConfig(middleware.CORSConfig{
	AllowOrigins:  []string{"*"},
	AllowHeaders:  []string{"*", "Authorization"},
	AllowMethods:  []string{"*"},
	ExposeHeaders: []string{"*"},
})

func grpcMiddleware(grpcWeb *grpcweb.WrappedGrpcServer) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) (returnErr error) {
			if grpcWeb.IsAcceptableGrpcCorsRequest(c.Request()) || grpcWeb.IsGrpcWebRequest(c.Request()) {
				grpcWeb.ServeHTTP(c.Response(), c.Request())
				return nil
			} else {
				return next(c)
			}
		}
	}
}
