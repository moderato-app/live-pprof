package main

import (
	"context"
	"fmt"
	"time"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
)

type MetricsServer struct {
	api.UnimplementedMetricServer
}

func (m *MetricsServer) FullMetrics(ctx context.Context, req *api.FullMetricsRequest) (*api.FullMetricsResponse, error) {
	return &api.FullMetricsResponse{
		Todo: "What you up to",
	}, nil
}

func (m *MetricsServer) IncrementalMetrics(req *api.IncrementalMetricsRequest, stream api.Metric_IncrementalMetricsServer) error {
	internal.Sugar.Debug("IncrementalMetrics req:", req)
	for i := 0; i < 30; i++ {
		time.Sleep(time.Millisecond * 500)
		resp := api.IncrementalMetricsStreamResponse{Todo: fmt.Sprintf("to do %d", i)}
		err := stream.SendMsg(&resp)
		internal.Sugar.Debug("send IncrementalMetricsStreamResponse", resp)
		if err != nil {
			internal.Sugar.Error(err)
			return err
		}
	}
	return nil
}
