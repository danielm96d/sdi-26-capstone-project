FROM node:alpine

WORKDIR /app/api

COPY . .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "start-dev"]