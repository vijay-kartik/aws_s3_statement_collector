import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/aws-config';
import { GymSession } from '@/types/gym';
import { awsConfig } from '@/config/aws';

const TABLE_NAME = 'gym-checkins';

export const dynamoService = {
  async createSession(session: GymSession) {
    try {
      if (!awsConfig.isConfigured()) {
        throw new Error('AWS configuration is missing');
      }

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
      if (!awsConfig.isConfigured()) {
        throw new Error('AWS configuration is missing');
      }

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
      if (!awsConfig.isConfigured()) {
        throw new Error('AWS configuration is missing');
      }

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