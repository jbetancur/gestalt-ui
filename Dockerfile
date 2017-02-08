FROM nginx:alpine

RUN apk add --update bash sed
COPY nginx_proxy.conf.template /etc/nginx/conf.d/
COPY config-and-serve.sh /etc/nginx/config-and-serve.sh

WORKDIR /etc/nginx/conf.d
CMD ["/etc/nginx/config-and-serve.sh"]

COPY build /usr/share/nginx/html
