FROM golang:1.14.2-alpine3.11

RUN mkdir /app

ADD . /app
ADD ./templates /app/templates
ADD ./www /app/www

WORKDIR /app

RUN go build -o server .

CMD ["/app/server"]
