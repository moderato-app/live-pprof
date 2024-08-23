package main

import (
	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/live-pprof/internal/general"
	"github.com/moderato-app/live-pprof/internal/metrics"
	"google.golang.org/grpc"
)

func main() {
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)

	api.RegisterMetricsServer(grpcServer, metrics.NewMetricsServer())
	api.RegisterMockMetricsServer(grpcServer, metrics.NewMockMetricsServer())
	api.RegisterGeneralServer(grpcServer, general.NewGeneralServer())

	internal.StartServeGrpc(grpcServer)
}
