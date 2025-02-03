import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { NextResponse } from 'next/server';

// Add error handling and logging for environment variables
const region = process.env.AWS_DEFAULT_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Missing required AWS configuration:', {
    hasRegion: !!region,
    hasAccessKey: !!accessKeyId,
    hasSecretKey: !!secretAccessKey,
    hasBucket: !!bucketName
  });
}

const s3Client = new S3Client({
  region: region || 'us-east-1', // Provide a fallback region
  credentials: {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  },
});

export async function POST(request: Request) {
  try {
    const { filename, filetype } = await request.json();
    
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucketName!,
      Key: filename,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', filetype],
      ],
      Fields: {
        'Content-Type': filetype,
      },
      Expires: 600, // URL expires in 10 minutes
    });

    return NextResponse.json({ url, fields });
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return NextResponse.json(
      { error: `Failed to create presigned URL: ${error}` },
      { status: 500 }
    );
  }
}