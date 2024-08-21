package main

import (
	"context"

	"github.com/moderato-app/live-pprof/api"
	"github.com/moderato-app/live-pprof/internal"
)

// MockMetricsServer returns mock data instead of real data to save development time
type MockMetricsServer struct {
	api.UnimplementedMockMetricsServer

	mockResources *MockAssets
}

func newMockMetricsServer() *MockMetricsServer {
	return &MockMetricsServer{
		mockResources: newMockAssets(),
	}
}

func (m *MockMetricsServer) HeapMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("HeapMetrics req:", req)
	return m.dispatch(req, MetricsTypeHeap)
}

func (m *MockMetricsServer) CPUMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("CPUMetrics req:", req)
	return m.dispatch(req, MetricsTypeCPU)
}

func (m *MockMetricsServer) AllocsMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("AllocsMetrics req:", req)
	return m.dispatch(req, MetricsTypeAllocs)
}

func (m *MockMetricsServer) GoroutineMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("GoroutineMetrics req:", req)
	return m.dispatch(req, MetricsTypeGoroutine)
}

func (m *MockMetricsServer) dispatch(req *api.GoMetricsRequest, mt MetricsType) (*api.GoMetricsResponse, error) {
	_, err := prepareUrl(req.Url, mt)
	if err != nil {
		return nil, err
	}

	mtr, err := m.mockResources.GetMetrics(mt)
	if err != nil {
		internal.Sugar.Error(err)
		return nil, err
	}
	resp := toResp(mtr)

	return resp, nil
}
