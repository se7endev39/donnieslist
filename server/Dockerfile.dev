FROM node
RUN mkdir -p /app
WORKDIR /app

EXPOSE 3000 9229

ENV NODE_ENV development

CMD ["npm", "install"]
CMD ["npm", "--inspect-brk=0.0.0.0", "run", "dev"]
