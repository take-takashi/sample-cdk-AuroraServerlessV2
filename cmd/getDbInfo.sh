#!/bin/sh

SECRET=$(aws secretsmanager get-secret-value --secret-id samplecdkAuroraServerlessV2-hhD8Uvc5QwW1 | jq '.SecretString' | jq -r .)

echo ${SECRET}