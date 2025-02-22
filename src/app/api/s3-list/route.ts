import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    
    const files = response.Contents
      ?.filter(item => item.Key?.toLowerCase().endsWith('.pdf')) // Filter only PDF files
      .map(item => ({
        name: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
      }))
      .sort((a, b) => {
        // Sort by last modified date, most recent first
        const dateA = a.lastModified?.getTime() || 0;
        const dateB = b.lastModified?.getTime() || 0;
        return dateB - dateA;
      }) || [];

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing S3 files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
} 