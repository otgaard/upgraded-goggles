FROM golang:1.14.2-alpine3.11

RUN mkdir /app

ADD server/server /app
ADD server/templates /app/templates
ADD frontend/dist /app/www

WORKDIR /app

RUN go build -o server .

CMD ["/app/server"]
