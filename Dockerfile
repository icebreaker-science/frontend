## Build app ##

FROM node:12.16-slim AS builder
WORKDIR /build/

COPY package.json .
COPY package-lock.json .
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm  --quiet ci

COPY . .
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm --quiet run build-prod


## Serve via nginx ##

FROM nginx:stable as server

COPY --from=builder /build/dist/frontend /app
RUN rm /etc/nginx/conf.d/default.conf
COPY docker_resources/nginx-icebreaker.conf /etc/nginx/conf.d/icebreaker.conf

EXPOSE 12010
