#!/bin/bash
# ---------------------------------------------------------
# Set the default value of the getopts variable 
PORT=""
WORKSPACE="/etc/nginx/html"
CONF="./docs/version.json"
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
echo -e "${RED}"
echo "-----Installing jq-----"
echo -e "${NC}"

sudo apt-get install -y jq

# ---------------------------------------------------------
# Get version number
echo -e "${RED}"
echo "-----Get version number-----"
echo -e "${NC}"
TAG_VER=$(cat ${CONF} | jq -r '.VERSION')
WEB_PORT=$(cat ${CONF} | jq -r '.PORT')
USER=$(cat ${CONF} | jq -r '.USER')
BASE_NAME=$(cat ${CONF} | jq -r '.PROJECT')

DOCKER_IMAGE= "${USER}/${BASE_NAME}"
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
