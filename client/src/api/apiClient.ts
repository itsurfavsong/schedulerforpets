export interface ApiError {
  message: string;
  code?: string;
}

export function errorHandler(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unexpected error occurred",
  };
}