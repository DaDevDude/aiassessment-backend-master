FROM node:alpine

WORKDIR /aiassessment-backend

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 4000

CMD ["npm", "start"]