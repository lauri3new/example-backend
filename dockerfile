FROM node:16.13.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install pm2 -g
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "npm", "run", "start-prod" ]