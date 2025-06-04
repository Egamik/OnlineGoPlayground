FROM nginx:alpine3.21-slim

RUN rm /etc/nginx/conf.d/*

RUN groupadd -r nginx && useradd -r -g nginx nginx
RUN chown -r nginx:nginx /usr/share/nginx
USER nginx

COPY ./build /usr/share/nginx/html
COPY ./aa12 /usr/share/nginx/aa12
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs/*.pem /etc/nginx/ssl/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

