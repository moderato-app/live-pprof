package main

import (
	"context"
	"net/http"
	"time"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/pprof/moderato"
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
	for {
		time.Sleep(time.Second)
		mtr, err := metrics()

		now := time.Now().UnixNano()
		if err != nil {
			internal.Sugar.Error(err)
			return err
		}
		var pbItems []*api.Item

		pbItems = append(pbItems, &api.Item{
			Func: "total",
			Line: "",
			Flat: mtr.Total,
			Cum:  mtr.Total},
		)

		for _, mItem := range mtr.Items {
			pbItems = append(pbItems, &api.Item{
				Func: mItem.Func,
				Line: mItem.Line,
				Flat: mItem.Flat,
				Cum:  mItem.Cum},
			)
		}

		resp := api.IncrementalMetricsStreamResponse{
			Date:  now,
			Items: pbItems,
			Total: mtr.Total,
		}

		err = stream.SendMsg(&resp)
		internal.Sugar.Debug("send IncrementalMetricsStreamResponse")

		if err != nil {
			internal.Sugar.Error(err)
			return err
		}
	}
}

func metrics() (*moderato.Metrics, error) {
	client := &http.Client{}
	url := "http://localhost:2379/debug/pprof/heap"
	internal.Sugar.Debugf("GET %s", url)
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	internal.Sugar.Debug("Reading body")
	return moderato.GetMetrics(resp.Body)
}
