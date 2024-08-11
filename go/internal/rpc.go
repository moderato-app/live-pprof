package internal

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

func StartServeGrpc(s *grpc.Server) {

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	l, err := net.Listen("tcp", ":8080")
	if err != nil {
		Sugar.Fatal(err)
	} else {
		Sugar.Info("listening on :8080")
	}

	wrappedGrpc := grpcweb.WrapServer(s, grpcweb.WithOriginFunc(func(origin string) bool {
		return true
	}))

	router := chi.NewRouter()
	router.Use(
		chiMiddleware.Logger,
		chiMiddleware.Recoverer,
		grpcMiddlware(wrappedGrpc),
	)

	router.Get("/todo", nil)

	go func() {
		if err := http.Serve(l, router); err != nil {
			log.Fatalf("failed starting http2 server: %v", err)
		}
	}()

	<-stopChan
	gracefulShutdown(s)
}

func gracefulShutdown(s *grpc.Server) {
	Sugar.Info("shutting down gRPC server gracefully")
	doneChan := make(chan struct{})
	go func() {
		s.GracefulStop()
		doneChan <- struct{}{}
	}()

	t := time.NewTicker(30 * time.Second)
	for {
		select {
		case <-doneChan:
			return
		case <-t.C:
			return
		}
	}
}
