import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Subscription } from '@/types/subscription';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME!;
const SUBSCRIPTIONS_KEY = 'subscriptions.json';

async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: SUBSCRIPTIONS_KEY,
    });

    const response = await s3Client.send(command);
    const subscriptionsData = await response.Body?.transformToString();
    return subscriptionsData ? JSON.parse(subscriptionsData) : [];
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
}

async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: SUBSCRIPTIONS_KEY,
    Body: JSON.stringify(subscriptions),
    ContentType: 'application/json',
  });

  await s3Client.send(command);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const subscriptions = await getSubscriptions();
    const subscriptionIndex = subscriptions.findIndex((sub: Subscription) => sub.id === id);

    if (subscriptionIndex === -1) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    subscriptions.splice(subscriptionIndex, 1);
    await saveSubscriptions(subscriptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
} 