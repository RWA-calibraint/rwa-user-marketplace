export interface ErrorResponse {
  status: number;
  data: {
    response: null;
    response_code: number;
    response_error: string;
    response_status: string;
  };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'response_error' in error.data
  ) {
    const errorObj = error as ErrorResponse;

    return errorObj.data.response_error || 'An unknown error occurred';
  }

  return 'Could not sign in';
}
