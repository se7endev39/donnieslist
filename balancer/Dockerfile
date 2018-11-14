FROM nginx:alpine
WORKDIR /app
COPY . /app

EXPOSE 80
EXPOSE 443
RUN rm -f /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/* /etc/nginx/ssl/
