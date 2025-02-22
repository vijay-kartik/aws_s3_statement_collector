import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import type { S3File } from '@/types';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(): Promise<NextResponse> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    
    const files: S3File[] = response.Contents
      ?.filter((item): item is NonNullable<typeof item> => 
        Boolean(item.Key?.toLowerCase().endsWith('.pdf'))
      )
      .map(item => ({
        name: item.Key!,
        lastModified: item.LastModified!.toISOString(),
        size: item.Size!,
      }))
      .sort((a, b) => {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
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