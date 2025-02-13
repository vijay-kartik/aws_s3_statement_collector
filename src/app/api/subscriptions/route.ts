import { NextResponse } from 'next/server';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Subscription } from '@/types/subscription';
import { v4 as uuidv4 } from 'uuid';

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

export async function GET() {
  try {
    const subscriptions = await getSubscriptions();
    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Error in GET /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscriptions = await getSubscriptions();

    const newSubscription: Subscription = {
      id: uuidv4(),
      name: body.name,
      amount: body.amount,
      billingCycle: body.billingCycle,
      startDate: body.startDate,
      description: body.description || '',
      status: 'active',
      nextPaymentDate: calculateNextPaymentDate(body.startDate, body.billingCycle),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    subscriptions.push(newSubscription);
    await saveSubscriptions(subscriptions);

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

function calculateNextPaymentDate(startDate: string, billingCycle: string): string {
  const date = new Date(startDate);
  
  switch (billingCycle) {
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date.toISOString();
} 