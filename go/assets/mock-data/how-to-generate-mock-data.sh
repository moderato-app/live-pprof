rm -rf default.etcd &&  etcd --enable-pprof

./bin/tools/benchmark put --total=190000000 --val-size=10000

while true ; do go tool pprof -text http://localhost:2379/debug/pprof/profile\?seconds\=1; done

while true ; do go tool pprof -text http://localhost:2379/debug/pprof/heap && sleep 1 ;done