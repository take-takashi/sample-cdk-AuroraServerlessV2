#!/bin/bash

WORKSPACE=$PWD

# npm install for cdk
cd ${WORKSPACE}/cdk
npm ci

# npm install for app
cd ${WORKSPACE}/app
npm ci

# install start-session-plugin
#cd /tmp
#curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"
#sudo dpkg -i session-manager-plugin.deb

# create .env file
cd ${WORKSPACE}/app
echo '' > .env
echo AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} >> .env
echo AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} >> .env
echo AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} >> .env
# for prisma
echo DATABASE_URL=${PRD_DATABASE_URL} >> .env