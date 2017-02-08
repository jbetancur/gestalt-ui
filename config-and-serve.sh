#!/bin/bash

<nginx_proxy.conf.template \
      sed "s|META_API_URL|$META_API_URL|" \
    | sed "s|SEC_API_URL|$SEC_API_URL|" \
    > default.conf 
echo "default.conf"
cat default.conf
# nginx -g 'daemon off;'
exec nginx '-g' 'daemon off;'
