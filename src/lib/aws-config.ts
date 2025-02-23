import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Default region if not set in environment
const DEFAULT_REGION = 'us-east-1';

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

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