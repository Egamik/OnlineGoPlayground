#!/bin/bash

# Generate private keys and certificates
openssl req -new -x509 -days 365 -keyout ca-key.pem -out ca-crt.pem -subj "/C=BR/ST=SC/L=Florianopolis/O=UFSC/CN=WebCA" -passout pass:$1
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout web-key.pem -out web-crt.pem -config web.cnf -CA ca-crt.pem -CAkey ca-key.pem -passin pass:$1
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout api-key.pem -out api-crt.pem -config api.cnf -CA ca-crt.pem -CAkey ca-key.pem -passin pass:$1
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout client-key.pem -out client-crt.pem -config client.cnf -CA ca-crt.pem -CAkey ca-key.pem -passin pass:$1


# Combine key and cert into a single PEM file
cat web-key.pem web-crt.pem > web.pem
cat api-key.pem api-crt.pem > api.pem
cat client-key.pem client-crt.pem > client.pem

# Set proper permissions
chmod 400 web-key.pem web-crt.pem web.pem
chmod 400 api-key.pem api-crt.pem api.pem
chmod 400 client-key.pem client-crt.pem client.pem
