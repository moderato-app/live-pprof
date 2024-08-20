package main

import (
	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"google.golang.org/grpc"
)

func main() {
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)

	api.RegisterMetricsServer(grpcServer, newMetricsServer())
	api.RegisterMockMetricsServer(grpcServer, newMockMetricsServer())
	internal.StartServeGrpc(grpcServer)
}
