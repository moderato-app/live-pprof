package general

import (
	"context"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/live-pprof/internal/logging"
)

type GeneralServer struct {
	api.UnimplementedGeneralServer
}

func NewGeneralServer() *GeneralServer {
	return &GeneralServer{}
}

func (m *GeneralServer) DetectURL(req *api.DetectURLRequest, stream api.General_DetectURLServer) error {
	logging.Sugar.Debug("DetectURL req:", req)
	wg := sync.WaitGroup{}
	mts := [...]internal.MetricsType{
		internal.MetricsTypeHeap,
		internal.MetricsTypeCPU,
		internal.MetricsTypeAllocs,
		internal.MetricsTypeGoroutine,
	}

	urls := make([]string, 0, 5)
	urls = append(urls, req.Url)
	for _, mt := range mts {
		url, err := internal.MetricsURL(req.Url, mt, true)
		if err != nil {
			logging.Sugar.Error(err)
			panic(err)
		}
		urls = append(urls, url)
	}

	for _, url := range urls {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			ctx, cancel := context.WithTimeout(stream.Context(), 3*time.Second)
			defer cancel()
			result, err := detect(ctx, url)
			var errMsg *string
			if err != nil {
				msg := err.Error()
				errMsg = &msg
			}
			resp := api.DetectURLResponse{
				Endpoint:   url,
				HttpResult: result,
				Error:      errMsg,
			}
			err = stream.Send(&resp)
			if err != nil {
				logging.Sugar.Error(err)
			}
		}(url)
	}
	wg.Wait()
	return nil
}

func detect(ctx context.Context, url string) (*api.HTTPResult, error) {
	client := &http.Client{}
	logging.Sugar.Debugf("GET %s", url)

	method := http.MethodGet

	// don't fetch /profile endpoint since only returns data in pb.gz format
	if strings.Contains(url, "/profile?seconds=") {
		method = http.MethodHead
	}
	req, err := http.NewRequestWithContext(ctx, method, url, nil)
	if err != nil {
		return nil, err
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()

	data, err := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode > 399 {
		logging.Sugar.Info("resp.Body: \n" + string(data))
	}

	bodyStr := string(data)

	return &api.HTTPResult{
		StatusCode: int32(resp.StatusCode),
		StatusText: resp.Status,
		Body:       &bodyStr,
	}, nil
}
