import { NextRequest, NextResponse } from 'next/server';
import { validateRequiredFields, validateFieldTypes, validators } from '@/utils/validation';
import { createData } from '@/services/dataService';
import { CreateDataInput, DataResponse, DataItem } from '@/types/data';

/**
 * API handler for POST requests to submit data
 * @param request The incoming request object
 * @returns JSON response with the processed data or error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Define required fields for this endpoint
    const requiredFields = ['title', 'description', 'category'];
    
    // Validate required fields
    const requiredFieldsValidation = validateRequiredFields(body, requiredFields);
    if (!requiredFieldsValidation.isValid) {
      const response: DataResponse<null> = {
        status: 'error',
        error: {
          message: 'Missing required fields',
          details: requiredFieldsValidation.missingFields
        }
      };
      
      return NextResponse.json(response, { status: 400 });
    }

    // Define type validations for the fields
    const typeValidations = {
      title: validators.isString,
      description: validators.isString,
      category: validators.isString,
      tags: validators.isArray,
      email: validators.isEmail,
      url: validators.isUrl,
      amount: validators.isNumber
    };

    // Validate field types
    const typeValidation = validateFieldTypes(body, typeValidations);
    if (!typeValidation.isValid) {
      const response: DataResponse<null> = {
        status: 'error',
        error: {
          message: 'Invalid field types',
          details: typeValidation.invalidFields
        }
      };
      
      return NextResponse.json(response, { status: 400 });
    }

    // Create data item using the data service
    const dataInput: CreateDataInput = {
      title: body.title,
      description: body.description,
      category: body.category,
      tags: body.tags,
      email: body.email,
      url: body.url,
      amount: body.amount
    };
    
    const createdData = await createData(dataInput);

    // Prepare successful response
    const response: DataResponse<DataItem> = {
      status: 'success',
      message: 'Data created successfully',
      data: createdData
    };

    // Return a successful response
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error processing data:', error);
    
    // Prepare error response
    const response: DataResponse<null> = {
      status: 'error',
      error: {
        message: 'Failed to process data',
        details: (error as Error).message
      }
    };
    
    // Return an error response
    return NextResponse.json(response, { status: 400 });
  }
} 