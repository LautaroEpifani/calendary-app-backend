# Base image
FROM node:21

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]