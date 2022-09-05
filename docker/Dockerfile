FROM nginx
# ------------------------------------------------------------------
# Close noninteractive
ENV DEBIAN_FRONTEND noninteractive

# ------------------------------------------------------------------
# Setting nginx.conf
COPY ./docker/nginx.conf /etc/nginx/nginx.conf

# ------------------------------------------------------------------
# Define Entrypoint
ENTRYPOINT [ "/bin/bash", "-c" ]