FROM nginx:alpine

RUN apk add --no-cache --no-cache sed && apk upgrade --no-cache && rm -rf /var/cache/apk/*
COPY nginx/nginx_proxy.conf.template /etc/nginx/conf.d/
COPY nginx/config-and-serve.sh /etc/nginx/config-and-serve.sh

WORKDIR /etc/nginx/conf.d
CMD ["/etc/nginx/config-and-serve.sh"]

COPY build /usr/share/nginx/html
