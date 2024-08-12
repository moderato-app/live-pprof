module github.com/moderato-app/live-pprof

go 1.22.6

replace github.com/moderato-app/pprof => ../../google-pprof

require (
	github.com/go-chi/chi/v5 v5.1.0
	github.com/improbable-eng/grpc-web v0.15.0
	github.com/moderato-app/pprof v0.0.0-20240812192036-77f131dbada2
	go.uber.org/zap v1.27.0
	google.golang.org/grpc v1.65.0
	google.golang.org/protobuf v1.34.2
)

require (
	github.com/cenkalti/backoff/v4 v4.1.1 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/golang/protobuf v1.5.4 // indirect
	github.com/klauspost/compress v1.11.7 // indirect
	github.com/rs/cors v1.7.0 // indirect
	go.uber.org/multierr v1.10.0 // indirect
	golang.org/x/net v0.25.0 // indirect
	golang.org/x/sys v0.20.0 // indirect
	golang.org/x/text v0.15.0 // indirect
	google.golang.org/genproto v0.0.0-20210126160654-44e461bb6506 // indirect
	nhooyr.io/websocket v1.8.6 // indirect
)
