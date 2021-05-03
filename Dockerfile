FROM node:14

WORKDIR /home/node/app

COPY ./ /home/node/app

RUN mkdir dist && npm i && npm run build 

EXPOSE 3000

CMD ["npm","run","start"]
