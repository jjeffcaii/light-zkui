FROM golang:alpine AS builder
RUN apk add --no-cache git && go get -u github.com/golang/dep/cmd/dep
WORKDIR /go/src/light-zkui
COPY . .
RUN dep ensure && mkdir bin && go build -o bin/light-zkui

FROM alpine:3.5
LABEL maintainer=jjeffcaii@outlook.com
COPY --from=builder /go/src/light-zkui/bin/light-zkui /usr/local/bin

EXPOSE 8080

ENTRYPOINT ["light-zkui"]
