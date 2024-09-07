https://github.com/user-attachments/assets/77bfacd8-1779-4aaf-9758-9604362a1eb5

<details>
<summary><kbd>Screenshots</kbd></summary>
<br/>	
<img width="1920" alt="Heap" src="https://github.com/user-attachments/assets/0bc04e0d-45ed-4b8a-8abf-b550fde31d60">
<img width="1920" alt="CPU" src="https://github.com/user-attachments/assets/67d6852e-26c6-44ca-a23f-a99e71b6e482">
<img width="1920" alt="Allocs" src="https://github.com/user-attachments/assets/22e90362-4c0b-4db5-bb43-bf6234b8bf07">
<img width="1920" alt="Goroutine" src="https://github.com/user-attachments/assets/eb79a142-f0d1-4993-95e7-ce4571ecde19">
<img width="1920" alt="Detect Endpoints" src="https://github.com/user-attachments/assets/837215f1-e7f9-424e-94b2-4f67ba5af697">
<img width="1920" alt="Options" src="https://github.com/user-attachments/assets/7d0b33b9-b5cd-48bf-9ccc-0651ae54685f">
</details>


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
