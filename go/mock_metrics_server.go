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

func (m *MockMetricsServer) InuseSpaceMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("InuseSpaceMetrics req:", req)
	_, err := prepareUrl(req.Url, MetricsTypeInuseSpace)
	if err != nil {
		return nil, err
	}

	mtr, err := m.mockResources.GetMetrics(MetricsTypeInuseSpace)
	if err != nil {
		internal.Sugar.Error(err)
		return nil, err
	}
	resp := goMetricsResp(mtr)

	return resp, nil
}

func (m *MockMetricsServer) CPUMetrics(_ context.Context, req *api.GoMetricsRequest) (*api.GoMetricsResponse, error) {
	internal.Sugar.Debug("CPUMetrics req:", req)
	_, err := prepareUrl(req.Url, MetricsTypeCPU)
	if err != nil {
		return nil, err
	}

	mtr, err := m.mockResources.GetMetrics(MetricsTypeCPU)
	resp := goMetricsResp(mtr)

	return resp, nil
}
