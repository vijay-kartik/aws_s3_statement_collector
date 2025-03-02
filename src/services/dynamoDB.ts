import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/aws-config';
import { GymSession } from '@/types/gym';

const TABLE_NAME = 'gym-checkins';

// Validate AWS configuration
const validateConfig = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION;
  const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error('AWS configuration is missing. Please check your environment variables.');
  }

  // Log configuration for debugging (remove in production)
  console.log('AWS Config:', {
    region,
    accessKeyId: accessKeyId.substring(0, 5) + '...',
    hasSecretKey: !!secretAccessKey
  });
};

export const dynamoService = {
  async createSession(session: GymSession) {
    try {
      validateConfig();
      const yearMonth = session.checkInTime.substring(0, 7).replace('-', '_');
      
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          year_month: yearMonth,
          ...session
        }
      });

      return await docClient.send(command);
    } catch (error) {
      console.error('Error creating session in DynamoDB:', error);
      throw error;
    }
  },

  async deleteSession(session: GymSession) {
    try {
      validateConfig();
      const yearMonth = session.checkInTime.substring(0, 7).replace('-', '_');
      
      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          year_month: yearMonth,
          checkInTime: session.checkInTime
        }
      });

      return await docClient.send(command);
    } catch (error) {
      console.error('Error deleting session from DynamoDB:', error);
      throw error;
    }
  },

  async getSessionsForMonth(yearMonth: string) {
    try {
      validateConfig();
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'year_month = :ym',
        ExpressionAttributeValues: {
          ':ym': yearMonth
        }
      });

      const response = await docClient.send(command);
      return response.Items as GymSession[];
    } catch (error) {
      console.error('Error querying sessions from DynamoDB:', error);
      throw error;
    }
  }
}; 