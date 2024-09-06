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

	PprofURL  string
	NoBrowser bool
}

func ParseLPFlags() *LivePprofConfig {
	config := &LivePprofConfig{}

	help := false
	flag.UintVarP(&config.Port, "port", "p", 8300, "port to listen on")
	flag.StringVar(&config.Host, "host", "0.0.0.0", "host to listen on")
	flag.BoolVarP(&help, "help", "h", false, "help")

	flag.BoolVarP(&config.NoBrowser, "no-browser", "n", false, "don't open browser")

	flag.Parse()

	args := flag.Args()
	if len(args) == 1 {
		config.PprofURL = args[0]
	} else if len(args) > 1 {
		_, _ = fmt.Fprintf(os.Stderr, "Expected 0 or 1 arg, but %d were given: %v\n", len(args), args)
		config.printHelp()
		os.Exit(0)
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
	fmt.Println("      open the browser and wait for instructions")
	fmt.Println()
	fmt.Println("  live-pprof 8080")
	fmt.Println("      open the browser and start to monitor http://localhost:8080/debug/pprof")
	fmt.Println("      equivalent to `live-pprof http://localhost:8080/debug/pprof`")
	fmt.Println("  live-pprof localhost:8080")
	fmt.Println("      open the browser and start to monitor http://localhost:8080")
	fmt.Println("  live-pprof http://localhost:8080")
	fmt.Println("      open the browser and start to monitor http://localhost:8080")
	fmt.Println("  live-pprof https://example.com/perf")
	fmt.Println("      open the browser and start to monitor https://example.com/perf")
	fmt.Println()
	fmt.Println("  live-pprof -n")
	fmt.Println("      don't open the browser")
	fmt.Println("  live-pprof --host 192.168.0.200 -port 1800")
	fmt.Println("      listen on 192.168.0.200:1800")
	fmt.Println()
	fmt.Println("Help")
	flag.PrintDefaults()
}
