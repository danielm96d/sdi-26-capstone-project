FROM node:alpine 

WORKDIR /app/api

COPY . .

RUN npm install
RUN npm install nodemon

EXPOSE 8080

CMD ["npm", "start"]