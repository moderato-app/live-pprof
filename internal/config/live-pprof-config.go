package config

import (
	"fmt"
	"os"

	"github.com/moderato-app/live-pprof/internal/logging"

	flag "github.com/spf13/pflag"
)

type LivePprofConfig struct {
	Host string
	Port uint

	PprofURL    string
	OpenBrowser bool
}

func ParseLPFlags() *LivePprofConfig {
	config := &LivePprofConfig{}

	help := false
	flag.UintVarP(&config.Port, "port", "p", 8300, "port to listen on")
	flag.StringVar(&config.Host, "host", "0.0.0.0", "host to listen on")
	flag.BoolVarP(&help, "help", "h", false, "help")

	flag.BoolVarP(&config.OpenBrowser, "open-browser", "o", true, "open browser on startup")

	flag.Parse()

	args := flag.Args()
	if len(args) > 0 {
		config.PprofURL = args[0]
	}

	if help {
		config.printHelp()
		os.Exit(0)
	}

	logging.Sugar.Infow("flags parsed", "config", config)
	return config
}

func (config *LivePprofConfig) printHelp() {
	fmt.Println()
	fmt.Println("Usage Example:")
	fmt.Println("  live-pprof")
	fmt.Println("  live-pprof 8080")
	fmt.Println("  live-pprof localhost:8080")
	fmt.Println("  live-pprof http://localhost:8080")
	fmt.Println("  live-pprof http://localhost:8080/debug/pprof")
	fmt.Println()
	flag.PrintDefaults()
}
