package internal

import (
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/moderato-app/go/live-pprof/api"
	"github.com/moderato-app/go/live-pprof/internal/config"
	"github.com/moderato-app/go/live-pprof/internal/general"
	"github.com/moderato-app/go/live-pprof/internal/logging"
	"github.com/moderato-app/go/live-pprof/internal/metrics"
	"github.com/moderato-app/go/live-pprof/internal/util"
	"github.com/pkg/browser"
	"google.golang.org/grpc"
)

func LivePprof() {
	conf := config.ParseLPFlags()

	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)

	api.RegisterMetricsServer(grpcServer, metrics.NewMetricsServer())
	api.RegisterMockMetricsServer(grpcServer, metrics.NewMockMetricsServer())
	api.RegisterGeneralServer(grpcServer, general.NewGeneralServer())

	go func() {
		time.Sleep(time.Second)
		maybeOpenURL(conf)
	}()

	StartServeGrpc(grpcServer, conf)
}

func maybeOpenURL(conf *config.LivePprofConfig) {
	goRun := util.IsRunningAsGoRun()
	if conf.OpenBrowser && !goRun {
		u := url.URL{
			Scheme: "http",
			Host:   strings.Replace(conf.Host, "0.0.0.0", "localhost", 1) + ":" + strconv.Itoa(int(conf.Port)),
		}

		params := url.Values{}
		if conf.PprofURL != "" {
			params.Add("pprof-url", conf.PprofURL)
		}
		u.RawQuery = params.Encode()

		logging.Sugar.Infof("opening %s in the browser\n", u.String())

		_ = browser.OpenURL(u.String())
	} else {
		logging.Sugar.Debugw("will not open the browser", "conf.OpenBrowser", conf.OpenBrowser,
			"IsRunningAsGoRun", goRun)
	}
}
