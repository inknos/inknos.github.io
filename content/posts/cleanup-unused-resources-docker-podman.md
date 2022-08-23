---
title: "Cleanup Unused Resources Docker Podman"
date: 2022-01-24T16:08:46+02:00
tags: ["docker", "cmdline", "linux", "podman"]
draft: false
---
# Docker - How to cleanup (unused) resources

Once in a while, you may need to cleanup resources (containers, volumes, images, networks) ...
    
## delete volumes[^docker-cleanup-volumes]    

```bash
$ docker volume rm $(docker volume ls -qf dangling=true)
$ docker volume ls -qf dangling=true | xargs -r docker volume rm
```
    
## delete networks

```bash
$ docker network ls  
$ docker network ls | grep "bridge"   
$ docker network rm $(docker network ls | grep "bridge" | awk '/ / { print $1 }')
```

## remove docker images [^remove-old-docker]
 
```bash
$ docker images
$ docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
    
$ docker images | grep "none"
$ docker rmi $(docker images | grep "none" | awk '/ / { print $3 }')
```

## remove docker containers

```bash
$ docker ps
$ docker ps -a
$ docker rm $(docker ps -qa --no-trunc --filter "status=exited")
```

## Resize disk space for docker vm[^remove-unused-images]
```bash
$ docker-machine create --driver virtualbox --virtualbox-disk-size "40000" default
```

[^docker-cleanup-volumes]: https://github.com/chadoe/docker-cleanup-volumes

[^remove-old-docker]: http://stackoverflow.com/questions/32723111/how-to-remove-old-and-unused-docker-images
[^remove-unused-images]: http://stackoverflow.com/questions/32723111/how-to-remove-old-and-unused-docker-images
