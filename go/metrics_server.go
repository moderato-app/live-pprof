package main

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/pprof/moderato"
)

type MetricsType int

const (
	MetricsTypeInuseSpace = MetricsType(iota)
	MetricsTypeCPU
)

type MetricsServer struct {
	api.UnimplementedMetricsServer
}

func newMetricsServer() *MetricsServer {
	return &MetricsServer{}
}

func (m *MetricsServer) InuseSpaceMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("InuseSpaceMetrics req:", req)
	u, err := prepareUrl(req.Url, MetricsTypeInuseSpace)
	if err != nil {
		return nil, err
	}

	mtr, err := metrics(ctx, u)
	if err != nil {
		internal.Sugar.Error(err)
		return nil, err
	}
	resp := goMetricsResp(mtr)

	return resp, nil
}

func (m *MetricsServer) CPUMetrics(ctx context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("CPUMetrics req:", req)
	u, err := prepareUrl(req.Url, MetricsTypeCPU)
	if err != nil {
		return nil, err
	}

	mtr, err := metrics(ctx, u)
	resp := goMetricsResp(mtr)

	return resp, nil
}

func metrics(ctx context.Context, url string) (*moderato.Metrics, error) {

	client := &http.Client{}
	internal.Sugar.Debugf("GET %s", url)
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
		internal.Sugar.Error("resp.Body: \n" + string(data))
		return nil, errors.New("bad status code: " + resp.Status)
	}

	mtr, err := moderato.GetMetricsFromData(data)
	if err != nil {
		internal.Sugar.Error(err)
		internal.Sugar.Error("resp.Body: \n" + string(data))
		return nil, err
	}

	return mtr, nil
}

func prepareUrl(baseUrl string, mt MetricsType) (string, error) {
	parse, err := url.Parse(baseUrl)
	if err != nil {
		return "", errors.New("invalid url: " + baseUrl)
	}

	var u string
	if mt == MetricsTypeInuseSpace {
		u = parse.JoinPath("heap").String()
	} else if mt == MetricsTypeCPU {
		j := parse.JoinPath("profile")
		params := url.Values{}
		params.Add("seconds", "1")
		j.RawQuery = params.Encode()
		u = j.String()
	} else {
		return "", errors.New("invalid metrics type")
	}
	return u, nil
}

func goMetricsResp(mtr *moderato.Metrics) *api.GoMetricsResponse {
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
