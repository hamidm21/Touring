FROM node:latest
# Create application directory
RUN mkdir -p /usr/src/app
# Installing gulp
RUN npm install -g gulp@4.0.2
# Change current working directory to app directory
WORKDIR /usr/src/app
# Copy pakage.json to workdir and installing dependencies
COPY package.json /usr/src/app/
# Install all dependencies
RUN npm i
# Copy the code to workdir
COPY . /usr/src/app/
# Build project with gulp 
RUN npm run gulp
# Exposing port and running server for production
EXPOSE 5252
CMD ["npm", "run", "serve"]