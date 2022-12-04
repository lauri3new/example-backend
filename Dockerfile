FROM node:16.13.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
# CMD should be prod cmd and override in other envs
CMD [ "npm", "run", "dev:docker:start" ]