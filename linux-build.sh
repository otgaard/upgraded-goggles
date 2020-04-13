#!/bin/bash

cd server
go build -o ../build/goserver
cd ../frontend
npm run build
cd ..
