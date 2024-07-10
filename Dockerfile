FROM node:18-alpine

WORKDIR /usr/src/

COPY package*.json ./

RUN ["npm", "install"]

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "build" ]

CMD [ "npm", "run", "start:build" ]
