#!/bin/bash

PROJECT_ROOT=$(pwd)

cd certs

./gen_certs.sh

cd $PROJECT_ROOT

cp ./certs/api-crt.pem ./api/certs/
cp ./certs/api-key.pem ./api/certs/
cp ./certs/ca-crt.pem ./api/certs/

cp ./certs/*.pem ./web/certs/