import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import EXTRACT_TRANSACTIONS_PROMPT from '@/constants/extract_transactions_prompt';

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Remove .pdf extension and add .csv
    const csvFilename = filename.replace('.pdf', '.csv');

    const command = new GetObjectCommand({
      Bucket: 'extracted-transaction-tables',
      Key: csvFilename,
    });

    const response = await s3Client.send(command);
    
    if (!response.Body) {
      throw new Error('No data received from S3');
    }

    const csvData = await response.Body.transformToString();
    
    // Call OpenAI API with the CSV data
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "sonar-pro",
            messages: [
                {
                    role: "system",
                    content: "Be precise in your response. Only return json as response.In your response, you should only return the json object with the key table and the value as the csv data."
                },
                {
                    role: "user",
                    content: `Here is the CSV data: ${csvData} \n ${EXTRACT_TRANSACTIONS_PROMPT}`
                }
            ],
            temperature: 0.2,
            top_p: 0.9,
            search_domain_filter: null,
            return_images: false,
            return_related_questions: false,
            top_k: 0,
            stream: false,
            presence_penalty: 0,
            frequency_penalty: 1,
            response_format: null
        })
    };

    const openaiResponse = await fetch('https://api.perplexity.ai/chat/completions', options);
    console.log(openaiResponse);

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('Perplexity API error:', errorText);
      throw new Error(`Perplexity API error: ${openaiResponse.status}`);
    }

    const result = await openaiResponse.json();
    
    if (!result.choices || !result.choices[0]?.message?.content) {
      throw new Error('Invalid response format from Perplexity API');
    }

    const analysis = result.choices[0].message.content;
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
} 