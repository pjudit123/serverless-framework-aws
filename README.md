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
  - Created an api handler to list security group details
    ```
    import * as AWS from 'aws-sdk';

    async function details() {
      try {
        const groupDetails = await new AWS.EC2({ apiVersion: '2016-11-15' }).describeSecurityGroups().promise();
        return {
          statusCode: 200,
          body: JSON.stringify({ result: groupDetails }),
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ result: 'Error! Retrieving security group details failed.' }),
        };
      }
    }

    module.exports = { details };
    ```
  - Now let invoke function in location using the command
    ```serverless invoke --function=ec2Service --log```
    will give you an output in a JSON format
    ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/local_output.PNG)

Deploy to AWS Lambda
  - ``` serverless deploy --stage dev``` will create a lambda function
  ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/lambda_api.PNG)
  - Checked the permissions on IAM role that invokes lambda function and added policies necessary to access EC2 services.
  ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/iam_role.PNG)
  - Using api will get a response as 
  ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/api_response.PNG)
  
    
Project Setup
  - Git clone the project repo
  - run ``` npm 
