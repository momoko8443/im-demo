FROM node:latest

WORKDIR /usr/src/app
COPY . .
RUN apt-get -q update && apt-get -qy install netcat
RUN npm install
EXPOSE 3000
#ENTRYPOINT ["npm", "run"]
#CMD ["npm","run","start"]