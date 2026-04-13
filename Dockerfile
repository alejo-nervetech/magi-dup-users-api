FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

# Rebuild native modules
RUN npm rebuild bcrypt

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
