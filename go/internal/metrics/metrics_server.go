package metrics

import (
	"context"
	"errors"
	"io"
	"net/http"
	"time"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/live-pprof/internal/logging"
	"github.com/moderato-app/pprof/moderato"
)

type MetricsServer struct {
	api.UnimplementedMetricsServer
}

func NewMetricsServer() *MetricsServer {
	return &MetricsServer{}
}

func (m *MetricsServer) HeapMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("HeapMetrics req:", req)
	return dispatch(ctx, req, internal.MetricsTypeHeap)
}

func (m *MetricsServer) CPUMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("CPUMetrics req:", req)
	return dispatch(ctx, req, internal.MetricsTypeCPU)
}

func (m *MetricsServer) AllocsMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("AllocsMetrics req:", req)
	return dispatch(ctx, req, internal.MetricsTypeAllocs)
}

func (m *MetricsServer) GoroutineMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("GoroutineMetrics req:", req)
	return dispatch(ctx, req, internal.MetricsTypeGoroutine)
}

func dispatch(ctx context.Context, req *api.GoMetricsRequest, mt internal.MetricsType) (*api.GoMetricsResponse, error) {
	u, err := internal.MetricsURL(req.Url, mt, false)
	if err != nil {
		logging.Sugar.Error(err)
		return nil, err
	}

	mtr, err := fetch(ctx, u)
	if err != nil {
		logging.Sugar.Error(err)
		return nil, err
	}

	resp := toResp(mtr)

	return resp, nil
}

func fetch(ctx context.Context, url string) (*moderato.Metrics, error) {

	client := &http.Client{}
	logging.Sugar.Debugf("GET %s", url)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		logging.Sugar.Error("resp.Body: \n" + string(data))
		return nil, errors.New("bad status code: " + resp.Status + ". " + string(data))
	}

	mtr, err := moderato.GetMetricsFromData(data)
	if err != nil {
		logging.Sugar.Error(err)
		logging.Sugar.Error("resp.Body: \n" + string(data))
		return nil, err
	}

	return mtr, nil
}

func toResp(mtr *moderato.Metrics) *api.GoMetricsResponse {
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

	resp := api.GoMetricsResponse{
		Date:  time.Now().UnixNano(),
		Items: pbItems,
		Total: mtr.Total,
	}
	return &resp
}
