FROM node:14-alpine

WORKDIR /app

COPY  . .

RUN npm i

RUN npm run build

EXPOSE 3333

CMD npm run migration && npm start 