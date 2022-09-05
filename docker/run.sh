#!/bin/bash
# ---------------------------------------------------------
# Set the default value of the getopts variable 
port=""
container_name="ivit-t-web-service"
docker_image="willqiuinnodisk/ivit-t-web-service"
workspace="/etc/nginx/html"
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

# Get version number
TAG_VER=$(cat ${CONF} | jq -r '.VERSION')
# ---------------------------------------------------------
echo "Setting IP of webapi."
python3 ./docker/get_domain.py -p ${port}

echo "Open Nginx service."

# ---------------------------------------------------------
# start service
command="service nginx start"

# ---------------------------------------------------------
# Run container
docker_cmd="docker run \
--name ${container_name} \
--rm -it \
--ipc=host \
-p 6531:80 \
-v `pwd`:${workspace} \
-w ${workspace} \
-v /etc/localtime:/etc/localtime:ro \
${docker_image}:${TAG_VER} \"${command} && bash \""

echo ""
echo -e "Command: ${docker_cmd}"
echo ""
bash -c "${docker_cmd}"
