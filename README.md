# AWS Sam Bloodrush

This repository contains the AWS hosted backend for Bloodrush as a [SAM](https://github.com/awslabs/serverless-application-model).

## Prerequisites

- AWS CLI
- SAM CLI
- S3 Bucket named aws-sam-bloodrush

## Deployment

`$ sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket aws-sam-bloodrush`

`$ sam deploy --template-file packaged.yaml --stack-name aws-sam-bloodrush --capabilities CAPABILITY_IAM`
