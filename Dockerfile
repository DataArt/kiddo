FROM node AS build

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli

COPY . .

RUN npm run build:elements-prod

FROM nginx:stable

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/game_engine /var/www
COPY --from=build /app/dist/elements/kiddo-player.js /var/www
RUN gzip --keep /var/www/*.js
EXPOSE 80