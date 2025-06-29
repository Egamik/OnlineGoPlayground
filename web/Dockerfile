FROM nginx:alpine3.21-slim

RUN rm /etc/nginx/conf.d/*

# RUN addgroup -S nginx && adduser -S -G nginx nginx

RUN chown -R nginx:nginx /usr/share/nginx
USER nginx

COPY ./build /usr/share/nginx/html
COPY ./aa/aa12 /usr/share/nginx/
COPY ./aa/aa14 /usr/share/nginx/
COPY ./proxy/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./certs/*.pem /etc/nginx/ssl/

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
