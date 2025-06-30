#!/bin/bash

PROJECT_ROOT=$(pwd)

rm -f $PROJECT_ROOT/web/certs/*.pem
rm -f $PROJECT_ROOT/api/certs/*.pem


cd certs

./gen_certs.sh

cd $PROJECT_ROOT

cp ./certs/api-crt.pem ./api/certs/
cp ./certs/api-key.pem ./api/certs/
cp ./certs/ca-crt.pem ./api/certs/

cp ./certs/*.pem ./web/certs/