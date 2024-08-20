package main

import (
	"embed"
	"errors"
	"path/filepath"
	"sort"
	"sync"
	"sync/atomic"

	"github.com/moderato-app/live-pprof/internal"
	"github.com/moderato-app/pprof/moderato"
)

//go:embed assets
var assets embed.FS

const cpuDir = "assets/mock-data/cpu"
const heap = "assets/mock-data/heap"

type MockAssets struct {
	loadProfilesOnce func()
	cpuProfiles      [][]byte
	heapProfiles     [][]byte
	mockCount        atomic.Int64
}

func newMockAssets() *MockAssets {

	m := &MockAssets{}
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
	})
	return m
}

func (m *MockAssets) GetMetrics(mt MetricsType) (*moderato.Metrics, error) {

	m.loadProfilesOnce()

	cnt := m.mockCount.Add(1)
	var profile []byte
	if mt == MetricsTypeInuseSpace {
		profile = m.heapProfiles[cnt%int64(len(m.cpuProfiles))]
	} else if mt == MetricsTypeCPU {
		profile = m.cpuProfiles[cnt%int64(len(m.cpuProfiles))]
	} else {
		return nil, errors.New("invalid metrics type")
	}

	mtr, err := moderato.GetMetricsFromData(profile)
	if err != nil {
		internal.Sugar.Error(err)
		internal.Sugar.Error("profile data: \n" + string(profile))
		return nil, err
	}

	return mtr, nil
}

func walkDirNonRecursive(dir string, f func(data []byte)) error {
	entries, err := assets.ReadDir(dir)
	sort.Slice(entries, func(i, j int) bool { return entries[i].Name() <= entries[j].Name() })
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if !entry.IsDir() {
			fPath := filepath.Join(dir, entry.Name())
			data, err := assets.ReadFile(fPath)
			if err != nil {
				return err
			}
			f(data)
		}
	}
	return nil
}
