FROM node:20-alpine

WORKDIR /usr/src/

RUN apk update && apk add sqlite

COPY . .

RUN ["npm", "install"]

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]