#!/bin/bash
echo "Build the docker image."
docker build -t nginx-web-service -f ./client_server/Dockerfile .