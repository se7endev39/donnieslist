FROM node


WORKDIR /var/www/

EXPOSE 80


CMD ["npm", "install"]
CMD ["npm", "run", "build"]
CMD ["./node_modules/.bin/http-server", "-p", "80"]
