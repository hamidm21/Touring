FROM node:latest
# Create application directory
RUN mkdir -p /usr/src/app
# Installing globals
RUN npm install -g gulp
Run npm install typescript -g
# Change current working directory to app directory
WORKDIR /usr/src/app
# Copy pakage.json to workdir and installing dependencies
COPY package.json /usr/src/app/
# Install all dependencies
RUN npm i
# Copy the code to workdir
COPY . /usr/src/app/
# gulp project 
RUN npm run gulp
# build project
RUN tsc
# Exposing port and running server for production
EXPOSE 2121
CMD ["npm", "run", "serve"]