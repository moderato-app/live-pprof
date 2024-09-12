You don’t want to clutter up your computer with Docker, Prometheus, Grafana or even K8S just to monitor a Go app's heap size, right?

Use `live-pprof` to Monitor a Go app's performance. It launches in seconds, boosting your local development.

<img width="1920" alt="Xnip2024-09-10_04-58-57" src="https://github.com/user-attachments/assets/be6fa249-eb7d-4ce9-8db9-8bd8c7c657b1">

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

## Limitations
* Metrics data is stored in the browser memory and is cleared on page refresh.
* The page slows down as data grows due to charts rendering.

As you can see, live-pprof is mainly for local development. These limitations mean it’s not a replacement for Prometheus and Grafana.

## Credits
<a href="https://golangweekly.com/latest" target="_blank">
  <img width="200" alt="image" src="https://github.com/user-attachments/assets/25490d69-576c-4d47-9f3a-6b8a1200e57b">
</a>

Thanks to [Golang Weekly](https://golangweekly.com/latest) for the shoutout!
