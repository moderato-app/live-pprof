package chi

import (
	"net/http"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

func grpcMiddleware(grpcWeb *grpcweb.WrappedGrpcServer) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if grpcWeb.IsAcceptableGrpcCorsRequest(r) || grpcWeb.IsGrpcWebRequest(r) {
				grpcWeb.ServeHTTP(w, r)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
