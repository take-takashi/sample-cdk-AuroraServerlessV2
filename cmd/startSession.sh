#!/bin/sh

# get instance id from aws ssm parameter store
INSTANCE_ID=$(aws ssm get-parameter --query "Parameter.Value" --output text --name "/sample-cdk-AuroraServerlessV2/BastionHostEc2InstanceId")

# get db host from aws secret manager
DB_HOST=$(aws secretsmanager get-secret-value --secret-id samplecdkAuroraServerlessV2-hhD8Uvc5QwW1 | jq '.SecretString' | jq -r . | jq -r .host)

aws ssm start-session --target ${INSTANCE_ID} --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters "{\"portNumber\":[\"5432\"],\"localPortNumber\":[\"15432\"],\"host\":[\"${DB_HOST}\"]}"