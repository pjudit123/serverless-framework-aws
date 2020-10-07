# Serverless-framework-aws
Use Cases
  - Serverless application to invoke lambda function to list the security group attached within the AWS account
  - Unit tests using Jest Mock function and AWS SDK MOCK to create necessary aws mock resources
  
Initial Setup
  - Ensure npm and node with latest version been installed on your local
  - Create serverless application using the following commands
    - ```mkdir <project root dirname> && cd <project root dirname>```
    - install serverless if haven't ```npm install -g serverless```
    - ```serverless create --template aws-nodejs --path ec2Service```
    - setup aws credentials using ```serverless config credentials --provider aws --key ##### --secret #####```
  - created serverless function and added configs in serverless.yml file as shown below
    ```
    service: ec2service
    frameworkVersion: '2'

    provider:
      name: aws
      runtime: nodejs12.x
      stage: dev
      region: ap-southeast-2

    package:
      exclude:
        - node_modules/**
        - __test__/**
        - __mock__/**
        - .eslintrc.js

    functions:
      ec2Service:
        handler: ec2Service/ec2Handler.details
        description: Get ec2 security groups for given aws account.
        events:
          - http:
              path: ec2-details
              method: get
     ```
     
Project Setup
  - Git clone the project repo
  - run ``` npm 
