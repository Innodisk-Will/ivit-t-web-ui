#!/bin/bash
# ---------------------------------------------------------
# Set the default value of the getopts variable 
port=""
docker_image="nginx-web-service"
workspace="/etc/nginx/html"
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
#!/bin/bash
echo "Setting IP of webapi."
python3 ./docker/get_domain.py -p ${port}

echo "Open Nginx service."

# ---------------------------------------------------------
# start service
command="service nginx start"

# ---------------------------------------------------------
# Run container
docker_cmd="docker run \
--name ${docker_image} \
--rm -it \
-p 6531:80 \
-v `pwd`:${workspace} \
-v /etc/localtime:/etc/localtime:ro \
${docker_image} \"${command} && bash \""

echo ""
echo -e "Command: ${docker_cmd}"
echo ""
bash -c "${docker_cmd}"
