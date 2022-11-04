#!/bin/bash
# ---------------------------------------------------------
# Set the default value of the getopts variable 
PORT=""
WORKSPACE="/etc/nginx/html"
CONF="./docs/version.json"

# ---------------------------------------------------------
# color ANIS
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m';

# ---------------------------------------------------------
# help
function help(){
	echo "-----------------------------------------------------------------------"
	echo "Run the iVIT-T client environment."
	echo
	echo "Syntax: scriptTemplate [-p|h]"
	echo "options:"
	echo "p		run container with Web API, setup the web api port number."
	echo "h		help."
	echo "-----------------------------------------------------------------------"
}
while getopts "p:h" option; do
	case $option in
		p )
			port=$OPTARG
			;;
		h )
			help
			exit
			;;
		\? )
			help
			exit
			;;
		* )
			help
			exit
			;;
	esac
done
# ---------------------------------------------------------
# Install jq
echo -e "${YELLOW}"
echo "-----Installing jq-----"
echo -e "${NC}"

if ! type jq >/dev/null 2>&1; then
    sudo apt-get install -y jq
else
    echo -e "${YELLOW}"
    echo 'The jq has been installed.';
    echo -e "${NC}"
fi

# ---------------------------------------------------------
# Get version number
echo -e "${YELLOW}"
echo "-----Get version number-----"
echo -e "${NC}"
TAG_VER=$(cat ${CONF} | jq -r '.VERSION')
WEB_PORT=$(cat ${CONF} | jq -r '.PORT')
USER=$(cat ${CONF} | jq -r '.USER')
BASE_NAME=$(cat ${CONF} | jq -r '.PROJECT')

DOCKER_IMAGE="${USER}/${BASE_NAME}"
CONTAINER_NAME="${BASE_NAME}"
# ---------------------------------------------------------
echo "Setting IP of webapi."
python3 ./docker/get_domain.py -p ${port}

echo "Open Nginx service."

# ---------------------------------------------------------
# start service
COMMAND="service nginx start"

# ---------------------------------------------------------
# Run container
DOCKER_CMD="docker run \
--name ${CONTAINER_NAME} \
--rm -it \
--ipc=host \
-p ${WEB_PORT}:80 \
-v `pwd`:${WORKSPACE} \
-w ${WORKSPACE} \
-v /etc/localtime:/etc/localtime:ro \
${DOCKER_IMAGE}:${TAG_VER} \"${COMMAND} && bash \""

echo ""
echo -e "Command: ${DOCKER_CMD}"
echo ""
bash -c "${DOCKER_CMD}"
