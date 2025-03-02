import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { awsConfig } from '@/config/aws';

const client = new DynamoDBClient(awsConfig.getConfig());

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`
  convertEmptyValues: true,
  // Whether to remove undefined values while marshalling
  removeUndefinedValues: true,
  // Whether to convert typeof object to map attribute
  convertClassInstanceToMap: true,
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers
  wrapNumbers: false,
};

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions,
  unmarshallOptions,
}); 