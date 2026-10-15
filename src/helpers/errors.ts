export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_REVOKED: 'TOKEN_REVOKED',
  ACCOUNT_TYPE_FORBIDDEN: 'ACCOUNT_TYPE_FORBIDDEN',
  ROLE_FORBIDDEN: 'ROLE_FORBIDDEN',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  HIERARCHY_RESTRICTED: 'HIERARCHY_RESTRICTED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  DEPENDENCY_UNAVAILABLE: 'DEPENDENCY_UNAVAILABLE',
  AUDIT_WRITE_FAILED: 'AUDIT_WRITE_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AdminApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 400,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}
