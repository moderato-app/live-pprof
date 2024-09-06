package metrics

import (
	"errors"
	"net/url"
	"strconv"
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
func MetricsURL(debug bool, mt MetricsType, urlStr string, profileSeconds uint64) (string, error) {
	parse, err := url.Parse(urlStr)
	if err != nil {
		return "", errors.New("invalid url: " + urlStr)
	}

	var p *url.URL
	params := url.Values{}

	p = parse.JoinPath(string(mt))

	if mt == MetricsTypeCPU {
		var sec = uint64(1)
		if profileSeconds > 1 {
			sec = profileSeconds
		}
		params.Add("seconds", strconv.Itoa(int(sec)))
	} else if debug {
		params.Add("debug", "1")
	}
	p.RawQuery = params.Encode()

	return p.String(), nil
}
