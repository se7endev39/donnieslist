FROM node

CMD ["npm", "install"]
CMD ["npm", "run", "build"]

FROM nginx:1.13.12-alpine
EXPOSE 80
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]