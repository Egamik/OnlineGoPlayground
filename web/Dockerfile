FROM nginx:alpine3.21-slim

RUN rm /etc/nginx/conf.d/*

COPY ./build /usr/share/nginx/html
COPY ./aa/aa12 /usr/share/nginx/
COPY ./aa/aa14 /usr/share/nginx/
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs/*.pem /etc/nginx/ssl/

RUN chown -R nginx:nginx /usr/share/nginx

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
