# iVIT-T WEB UI

<div align="center">
  <img width="100%" height="100%" src="assets/thumbnail_iVIT-T Logo.png">
</div>

A user interfaces to the training model. This UI is easy to operate for train model and evaluates the trained model and convert to edge platform. 
* [See What's New](#see-whats-new)
* [Pre-requirements](#pre-requirements)
* [Build docker images](#build-docker-images)
* [Run container](#run-container)
* [Open web UI](#open-web-ui)


# See What's New
- [Release Notes](docs/release_notes.md)
- added code for web API that has a database

# Getting Started

### Pre-requirements
- Running ```iVIT-T Web API```
- [Tutorial](https://github.com/Innodisk-Will/ivit-t.git)

### Run container
```shell
sudo ./docker/run.sh -p 6530
```

This "-p" is the port number that relative port of web API.

### Open web UI
Open your Browser, then input ip:port in URL
```
http://127.0.0.1:6531/
```
