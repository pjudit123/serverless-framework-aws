import 'babel-polyfill';
import { mockEC2describeSecurityGroups } from '../__mock__/aws_sdk_ec2';

const handler = require('../ec2Service/ec2Handler');

beforeAll(async (done) => {
  // if any env vars
  done();
});

// eslint-disable-next-line arrow-body-style
jest.mock('aws-sdk', () => {
  return {
    EC2: jest.fn(() => ({
      describeSecurityGroups: mockEC2describeSecurityGroups,
    })),
  };
});

describe('Unit tests', () => {
  it('using jest mock fn should get security group details', async () => {
    const mockResult = [{ groupID: 'sg-122424', groupName: 'sg-default-1' }];
    // eslint-disable-next-line arrow-body-style
    mockEC2describeSecurityGroups.mockImplementation(() => {
      return {
        promise() {
          return Promise.resolve(mockResult);
        },
      };
    });
    const result = await handler.details();
    expect(result.body).toStrictEqual(JSON.stringify({ result: mockResult }));
    expect(mockEC2describeSecurityGroups).toHaveBeenCalled();
  });
});
