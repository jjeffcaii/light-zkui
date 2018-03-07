FROM golang:1.9-alpine AS backend
RUN apk add --no-cache git && go get -u github.com/golang/dep/cmd/dep
WORKDIR /go/src/light-zkui
COPY . .
RUN dep ensure
RUN go build -o /tmp/zkui

FROM node:6-alpine AS frontend
RUN npm set registry https://registry.npm.taobao.org && npm set disturl https://npm.taobao.org/dist
RUN npm i -g @angular/cli
WORKDIR /app
COPY www/package.json ./package.json
COPY www/yarn.lock ./yarn.lock
RUN yarn
COPY www .
RUN ng build --env=prod

FROM alpine:3.5
LABEL maintainer=jjeffcaii@outlook.com

ENV ZK_URL="" PORT=8080

COPY --from=backend /tmp/zkui /usr/local/bin
COPY --from=frontend /app/dist /root/.light-zkui/www

EXPOSE $PORT

CMD zkui -www=/root/.light-zkui/www -listen=:$PORT -zk=$ZK_URL
