FROM node:18

WORKDIR /app

COPY package*.json .
RUN npm install -g typescript
RUN npm install

COPY . .
RUN tsc
CMD [ "node", "dist/index.js" ]
