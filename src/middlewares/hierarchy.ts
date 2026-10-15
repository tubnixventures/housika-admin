import { Context, Next } from 'hono';
import { jsonError } from '../helpers/response';
import { ERROR_CODES } from '../helpers/errors';
import { RequestContextUser } from '../types/auth';

export function assertCallerLevelDominance(
  caller: RequestContextUser,
  targetLevel: number,
  actionDescription: string = 'modify'
): void {
  if (caller.level === 100) return; // Root can manage all

  if (caller.level <= targetLevel) {
    throw new Error(
      `Hierarchy restricted: Caller level (${caller.level}) must be strictly greater than target level (${targetLevel}) to ${actionDescription}.`
    );
  }
}

export function isCallerAllowedToGrantRole(callerRole: string, targetRole: string): boolean {
  if (targetRole === 'root') return false; // No one creates root via API
  if (targetRole === 'ceo') return callerRole === 'root'; // Only root creates CEO
  if (callerRole === 'root' || callerRole === 'ceo') return true;
  return false;
}
