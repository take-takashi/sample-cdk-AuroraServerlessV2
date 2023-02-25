#!/bin/bash

WORKSPACE=$PWD

# npm install for cdk
cd ${WORKSPACE}/cdk
npm ci

# npm install for app
cd ${WORKSPACE}/app
npm ci

# create .env file
cd ${WORKSPACE}/app
echo '' > .env
## .env for prisma
echo DATABASE_URL=${DEV_DATABASE_URL} >> .env

# create .env.prd file
cd ${WORKSPACE}/app
echo '' > .env.prd
## .env for prisma
echo DATABASE_URL=${PRD_DATABASE_URL} >> .env.prd
