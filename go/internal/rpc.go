package internal

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	chi2 "github.com/moderato-app/live-pprof/internal/chi"
	"github.com/moderato-app/live-pprof/internal/config"
	"github.com/moderato-app/live-pprof/internal/logging"
	"google.golang.org/grpc"
)

func StartServeGrpc(gs *grpc.Server, conf *config.LivePprofConfig) {

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	addr := fmt.Sprintf("%s:%d", conf.Host, conf.Port)
	l, err := net.Listen("tcp", addr)
	if err != nil {
		logging.Sugar.Fatal(err)
	} else {
		logging.Sugar.Info("listening on", addr)
		addr = strings.Replace(addr, "0.0.0.0", "localhost", 1)
		//goland:noinspection HttpUrlsUsage
		httpURL := "http://" + addr
		logging.Sugar.Info(httpURL)
	}

	wrappedGrpc := grpcweb.WrapServer(gs, grpcweb.WithOriginFunc(func(origin string) bool {
		return true
	}))

	s := chi2.WebServer(wrappedGrpc)

	go func() {
		if err := http.Serve(l, s); err != nil {
			log.Fatalf("failed starting http2 server: %v", err)
		}
	}()

	<-stopChan
	gracefulShutdown(gs)
}

func gracefulShutdown(s *grpc.Server) {
	logging.Sugar.Info("shutting down gRPC server gracefully")
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
