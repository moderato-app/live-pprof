package metrics

import (
	"errors"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"sync/atomic"

	"github.com/moderato-app/live-pprof/assets"
	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/live-pprof/internal/logging"
	"github.com/moderato-app/pprof/moderato"
)

const cpuDir = "mock-data/cpu"
const heap = "mock-data/heap"
const allocs = "mock-data/allocs"
const goroutine = "mock-data/goroutine"

type MockAssets struct {
	loadProfilesOnce  func()
	cpuProfiles       [][]byte
	heapProfiles      [][]byte
	allocsProfiles    [][]byte
	goroutineProfiles [][]byte
	mockCount         atomic.Int64
}

func newMockAssets() *MockAssets {

	m := &MockAssets{}
	logging.Sugar.Info(os.Getwd())
	m.loadProfilesOnce = sync.OnceFunc(func() {
		err := walkDirNonRecursive(cpuDir, func(data []byte) {
			m.cpuProfiles = append(m.cpuProfiles, data)
		})
		if err != nil {
			panic(err)
		}
		if len(m.cpuProfiles) == 0 {
			panic("no files at " + cpuDir)
		}

		err = walkDirNonRecursive(heap, func(data []byte) {
			m.heapProfiles = append(m.heapProfiles, data)
		})
		if err != nil {
			panic(err)
		}
		if len(m.heapProfiles) == 0 {
			panic("no files at " + heap)
		}

		err = walkDirNonRecursive(allocs, func(data []byte) {
			m.allocsProfiles = append(m.allocsProfiles, data)
		})
		if err != nil {
			panic(err)
		}
		if len(m.allocsProfiles) == 0 {
			panic("no files at " + allocs)
		}

		err = walkDirNonRecursive(goroutine, func(data []byte) {
			m.goroutineProfiles = append(m.goroutineProfiles, data)
		})
		if err != nil {
			panic(err)
		}
		if len(m.goroutineProfiles) == 0 {
			panic("no files at " + goroutine)
		}
	})
	return m
}

func (m *MockAssets) GetMetrics(mt internal.MetricsType) (*moderato.Metrics, error) {

	m.loadProfilesOnce()

	cnt := m.mockCount.Add(1)
	var profile []byte
	if mt == internal.MetricsTypeHeap {
		profile = m.heapProfiles[cnt%int64(len(m.cpuProfiles))]
	} else if mt == internal.MetricsTypeCPU {
		profile = m.cpuProfiles[cnt%int64(len(m.cpuProfiles))]
	} else if mt == internal.MetricsTypeAllocs {
		profile = m.allocsProfiles[cnt%int64(len(m.allocsProfiles))]
	} else if mt == internal.MetricsTypeGoroutine {
		profile = m.goroutineProfiles[cnt%int64(len(m.goroutineProfiles))]
	} else {
		return nil, errors.New("invalid fetch type")
	}

	mtr, err := moderato.GetMetricsFromData(profile)
	if err != nil {
		logging.Sugar.Error(err)
		logging.Sugar.Error("profile data: \n" + string(profile))
		return nil, err
	}

	return mtr, nil
}

func walkDirNonRecursive(dir string, f func(data []byte)) error {
	entries, err := assets.MockData.ReadDir(dir)
	sort.Slice(entries, func(i, j int) bool { return entries[i].Name() <= entries[j].Name() })
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			fPath := filepath.Join(dir, entry.Name())
			data, err := assets.MockData.ReadFile(fPath)
			if err != nil {
				return err
			}
			f(data)
		}
	}
	return nil
}
