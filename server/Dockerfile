
FROM node:20.12.2

RUN mkdir -p /src

COPY package.json src/package.json

WORKDIR /src

RUN npm install --only=production --silent

COPY . /src

CMD npm start
