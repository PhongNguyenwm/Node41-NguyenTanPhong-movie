import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function Api500Response() {
  return applyDecorators(
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
          error: { type: 'string' },
        },
        example: {
          statusCode: 500,
          message: 'An error occurred.',
          error: 'Internal Server Error',
        },
      },
    }),
  );
}

export function Api200Response() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Success',
    }),
  );
}
