FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci 

RUN npm run build

COPY . .

EXPOSE 3000


CMD ["node", "index.js"]
