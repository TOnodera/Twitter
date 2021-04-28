FROM node:14

WORKDIR /app

COPY . /app

RUN npm i && npm build && npm start

EXPOSE 3000

