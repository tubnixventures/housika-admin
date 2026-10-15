import { AuthTokenClaims } from '../types/auth';
import { AdminApiError, ERROR_CODES } from '../helpers/errors';

export async function verifyHousikaJwt(token: string, secret: string): Promise<AuthTokenClaims> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, 'Malformed JWT structure', 401);
  }

  const [headerB64, payloadB64, signatureB64] = parts;
  let header: { alg?: string; typ?: string };
  let payload: AuthTokenClaims;

  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, 'Failed to parse JWT payload', 401);
  }

  if (header.alg !== 'HS256') {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, `Unsupported JWT algorithm: ${header.alg}`, 401);
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
  const signatureBytes = Buffer.from(signatureB64, 'base64url');

  const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, dataToVerify);
  if (!isValid) {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, 'Invalid token signature', 401);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSec) {
    throw new AdminApiError(ERROR_CODES.TOKEN_REVOKED, 'Access token has expired', 401);
  }
  if (payload.iat && payload.iat > nowSec + 60) {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, 'Token iat is in the future', 401);
  }
  if (payload.aud !== 'housika-api') {
    throw new AdminApiError(ERROR_CODES.TOKEN_INVALID, `Invalid audience: expected 'housika-api', got '${payload.aud}'`, 401);
  }

  return payload;
}
