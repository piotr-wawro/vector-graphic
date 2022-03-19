FROM node:17-alpine3.14

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

CMD ["npm", "run", "start"]
