FROM node:16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn
COPY . /usr/src/app
RUN npm run tsc
RUN npm run build:template:prod
RUN npm run upload
EXPOSE 7001
CMD npx egg-scripts start --title=lego-backend
