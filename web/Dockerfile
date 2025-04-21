FROM nginx:alpine3.21-slim

RUN rm /etc/nginx/conf.d/*

COPY ./build /usr/share/nginx/html
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs/*.pem /etc/nginx/ssl/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

