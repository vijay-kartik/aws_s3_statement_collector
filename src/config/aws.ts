import type { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

export const awsConfig = {
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
  isConfigured: () => {
    return !!(
      process.env.NEXT_PUBLIC_AWS_REGION &&
      process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID &&
      process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
    );
  },
  getConfig: (): DynamoDBClientConfig => {
    if (!awsConfig.isConfigured()) {
      console.error('AWS Configuration:', {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID?.substring(0, 5),
        hasSecretKey: !!process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
      });
      throw new Error('AWS configuration is missing. Please check your environment variables.');
    }
    return {
      region: awsConfig.region,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
      }
    };
  }
}; 