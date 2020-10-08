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
    const AWS = require('aws-sdk');

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
  
  ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/iam-role.PNG)
  
  - Using api will get a response as 
  
  ![alt text](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/api_response.PNG)
  
Other AWS Setup:
  - Cloud watch log groups was created for API access log and lamba function
  - API logs/trace
    - Created IAM role for the specific log group and added API gateway policies required to integrate logs
    - In AWS console, navigate to Services -> API -> Settings -> fillin <CloudWatch log role ARN*> that was created in the initial step
    - Enable logs for the deployed API stage
    ![](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/cloud_watch.PNG)
  - API Gateway using authorizer
    - I have used token based authorizer
    - Navigate to AWS console -> API gateway -> Authorizer -> Create new authorizer. 
    Choose name and the lambda function to add auth and header field to pass a bearer token. 

Unit Test Setup
  - Used Jest for unit testing
  - ```npm install --save-dev jest```
  - Create test folder __test__ and tests to it.
  - Create mock function folder __mock__ and add mocks if any.
  - add scripts to run test 
    ```
    "scripts": {
      "test": "jest",
    },
    ```
  - To run tests ```npm run test```  
  - Used aws-sdk-mock for the mocking the aws resource
  ```
    describe('Unit tests', () => {
      it('using AWS SDK mock should get security group details', async () => {
        const mockResult = { groupID: 'sg-122424', groupName: 'sg-default-1' };
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('EC2', 'describeSecurityGroups', (callback) => {
          console.log('EC2', 'describeSecurityGroup', 'mock called');
          callback(null, mockResult);
        });
        expect(await new AWS.EC2({ apiVersion: '2016-11-15' })
          .describeSecurityGroups().promise()).toStrictEqual(mockResult);

        AWSMock.restore('EC2');
        await handler.details();
      });
    });
  ```
  - Other way to unit test without aws-sdk-mock. 
  I have used jest.fn().mockImplementation to mock the AWS.EC2() which is ```__test__/ec2ServiceJestMock.test.js```

Code Coverage Report

  - add scripts to run test coverage report
    ```
    "scripts": {
      "test:coverage": "jest --coverage",
    },
    ```
  - To run tests ```npm run test:coverage``` 
  ![](https://github.com/pjudit123/serverless-framework-aws/blob/master/ouput_images/code_coverage_report.PNG)

Other Dependencies
  - Used babel config for general presets
  - Eslint was installed 
    - ```npm install eslint@5```
    - ```npx eslint init```
    Follow the instruction to setup preset config for eslint, once done .eslintrc.js will be created
    - Alter rules as necessary, I have added the below ones as basic
    ```
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': ['error', { code: 120 }],
        'linebreak-style': 0,
        'no-unused-vars': ['error', { 'args': 'after-used' }],
        'object-curly-newline': ['error', {
          'consistent': true,
        }],
        'import/extensions': ['error', 'ignorePackages', { 'js':  'never' }],
    }
    ```

Project Clone and Run
  - Git clone the project repo
  - run ``` npm ci```
  - run ``` npm install ```
  - run ```server deploy --stage dev```
