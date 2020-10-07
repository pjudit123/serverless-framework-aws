import 'babel-polyfill';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';

const handler = require('../ec2Service/ec2Handler');

beforeAll(async (done) => {
  // if any env vars
  AWS.config.update({ region: 'ap-southeast-2' });
  done();
});

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
