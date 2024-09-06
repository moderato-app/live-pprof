<img width="1920" alt="Xnip2024-09-05_22-25-31" src="https://github.com/user-attachments/assets/fee917b2-8bc6-47e5-8b18-47bd56c545a5">

You don’t want to clutter up your computer with Docker, Prometheus, Grafana or even K8S just to monitor a Go app's heap size, right?

Use `live-pprof` to Monitor a Go app's performance. It launches in 1 second, boosting your local development.

## Install

```bash
go install github.com/moderato-app/live-pprof@v1
```

## Usage

#### Step 1: setup pprof endpoints

```bash
package main

import (
	"log"
	"net/http"
	_ "net/http/pprof"
)

func main() {
	log.Println(http.ListenAndServe("localhost:6060", nil))
}
```

#### Step 2: monitor the pprof endpoints

```bash
live-pprof 6060 
# Or:
live-pprof http://localhost:6060/debug/pprof
# Both commands will monitor http://localhost:6060/debug/pprof
```
