FROM node:alpine

ADD index.js /app/index.js
ADD package.json /app/package.json

RUN cd /app && yarn install
CMD cd /app && yarn start
