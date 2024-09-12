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

	chi2 "github.com/moderato-app/live-pprof/internal/chi"
	"github.com/moderato-app/live-pprof/internal/config"
	"github.com/moderato-app/live-pprof/internal/logging"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"google.golang.org/grpc"
)

func StartServeGrpc(gs *grpc.Server, conf *config.LivePprofConfig) {
	l, port, err := findPort(conf.Port, conf.Host)
	if err != nil {
		logging.Sugar.Fatal(err)
	}
	conf.Port = port

	logging.Sugar.Infof("listening on %s", l.Addr().String())
	addr := fmt.Sprintf("%s:%d", strings.Replace(conf.Host, "0.0.0.0", "localhost", 1), port)

	//goland:noinspection HttpUrlsUsage
	httpURL := "http://" + addr
	logging.Sugar.Info("click to open: ", httpURL)

	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	wrappedGrpc := grpcweb.WrapServer(gs, grpcweb.WithOriginFunc(func(origin string) bool {
		return true
	}))
	s, err := chi2.WebServer(chi2.GrpcMiddleware(wrappedGrpc))

	if err != nil {
		logging.Sugar.Panic("failed to init WebServer", err)
	}

	go func() {
		if err := http.Serve(l, s); err != nil {
			log.Fatalf("failed starting http2 server: %v", err)
		}
	}()

	<-stopChan
	gracefulShutdown(gs)

}

func findPort(port uint, host string) (net.Listener, uint, error) {
	for {
		if port > 65535 || port == 0 {
			return nil, 0, fmt.Errorf("port %d is out of range [1, 65535]", port)
		}
		addr := fmt.Sprintf("%s:%d", host, port)
		l, err := net.Listen("tcp", addr)
		if err != nil {
			// port already in use
			if strings.Contains(err.Error(), "bind: address already in use") {
				logging.Sugar.Warnf("address %s already in use, will use a port %d", addr, port+1)
				port++
			} else {
				return nil, 0, err
			}
		} else {
			return l, port, nil
		}
	}
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
