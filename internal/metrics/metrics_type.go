package metrics

import (
	"errors"
	"net/url"
)

type MetricsType string

const (
	MetricsTypeHeap      = "heap"
	MetricsTypeCPU       = "profile"
	MetricsTypeAllocs    = "allocs"
	MetricsTypeGoroutine = "goroutine"
)

// MetricsURL generates a URL that works with Go's net/http/pprof.
//
// If debug is true, it fetches data in text format(except for MetricsTypeCPU).
// If debug is false, it fetches data in pb.gz format.
func MetricsURL(baseUrl string, mt MetricsType, debug bool) (string, error) {
	parse, err := url.Parse(baseUrl)
	if err != nil {
		return "", errors.New("invalid url: " + baseUrl)
	}

	var p *url.URL
	params := url.Values{}

	p = parse.JoinPath(string(mt))

	if mt == MetricsTypeCPU {
		params.Add("seconds", "1")
	} else if debug {
		params.Add("debug", "1")
	}
	p.RawQuery = params.Encode()

	return p.String(), nil
}
