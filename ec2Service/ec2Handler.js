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
