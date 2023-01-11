FROM nginx:latest
# ------------------------------------------------------------------
# Close noninteractive
ENV DEBIAN_FRONTEND noninteractive

# ------------------------------------------------------------------
# Setting nginx.conf
# COPY ./docker/nginx.conf /etc/nginx/nginx.conf
# COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/default.conf.template /etc/nginx/templates/default.conf.template

# ------------------------------------------------------------------
# # Define Entrypoint
# ENTRYPOINT [ "/bin/bash", "-c" ]