FROM node:14

WORKDIR /home/node/app

COPY ./ /home/node/app

RUN apt update && apt install -y jq
RUN npm i && npm run build 

EXPOSE 3000

CMD ["npm","run","start"]
