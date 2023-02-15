#!/bin/bash
# --------------------------------------------------------
CONF="./docs/version.json"
ROOT=$(dirname "${FILE}")

# ---------------------------------------------------------
# Color ANIS
RED='\033[1;31m'
BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
CYAN='\033[1;36m'
NC='\033[0m';

# ---------------------------------------------------------
# Install jq
echo -e "${YELLOW}"
echo "-----Installing jq-----"
echo -e "${NC}"

if ! type jq >/dev/null 2>&1; then
    sudo apt-get install -y jq
else
    echo 'The jq has been installed.';
fi

# --------------------------------------------------------
# Parse information from configuration
USER=$(cat ${CONF} | jq -r '.USER')
BASE_NAME=$(cat ${CONF} | jq -r '.PROJECT')
TAG_VER=$(cat ${CONF} | jq -r '.VERSION')

# --------------------------------------------------------
# Concate name
IMAGE_NAME="${USER}/${BASE_NAME}:${TAG_VER}"
echo -e "${YELLOW}"
echo "-----Concatenate docker image name: ${IMAGE_NAME}-----"
echo -e "${NC}"

# --------------------------------------------------------
# Build the docker image
echo -e "${YELLOW}"
echo "-----Build the docker image. (${IMAGE_NAME})-----"
echo -e "${NC}"

docker build -t "${IMAGE_NAME}" \
-f "${ROOT}/docker/Dockerfile" . 

# ---------------------------------------------------------
# Push dockerhub
echo -e "${GREEN}"
echo "-----Push dockerhub ${IMAGE_NAME}-----"
echo -e "${NC}"
docker push ${IMAGE_NAME}