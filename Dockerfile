FROM node:14

WORKDIR /app

COPY . /app



RUN mkdir dist && npm i && npm run build 

EXPOSE 3000

CMD ["npm","run","start"]
