//go:build prod

package metrics

import (
	"context"
	"errors"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal/logging"
)

var mockNotAvailableErr = errors.New("mock data is not available for a prod build")

// MockMetricsServer returns mock data instead of real data to save development time
type MockMetricsServer struct {
	api.UnimplementedMockMetricsServer
}

func NewMockMetricsServer() *MockMetricsServer {
	return &MockMetricsServer{}
}

func (m *MockMetricsServer) HeapMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("HeapMetrics req:", req)
	return nil, mockNotAvailableErr
}

func (m *MockMetricsServer) CPUMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("CPUMetrics req:", req)
	return nil, mockNotAvailableErr
}

func (m *MockMetricsServer) AllocsMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("AllocsMetrics req:", req)
	return nil, mockNotAvailableErr
}

func (m *MockMetricsServer) GoroutineMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	logging.Sugar.Debug("GoroutineMetrics req:", req)
	return nil, mockNotAvailableErr
}
