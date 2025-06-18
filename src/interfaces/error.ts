/**
 * Every error message's description
 */
export interface IGenericErrorMessages {
  /** Error generated location */
  path: string;
  message: string;
}

/**
 * Generic error response structure
 */
export interface IGenericErrorResponse {
  /** HTTP status code */
  statusCode: number;
  /** Error message */
  message: string;
  /** Array of error messages */
  errorMessages: IGenericErrorMessages[];
}
