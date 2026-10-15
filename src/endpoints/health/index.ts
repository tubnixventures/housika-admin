import { Context } from 'hono';
import { jsonSuccess } from '../../helpers/response';
import { nowEpochSeconds } from '../../helpers/time';

export async function handleHealth(c: Context) {
  const timestamp = nowEpochSeconds();
  return jsonSuccess(
    c,
    {
      service: 'housika-admin-backend',
      status: 'healthy',
      version: '1.5.0',
      timestamp,
      environment: process.env.NODE_ENV || 'development',
    },
    'Housika Admin Backend operational'
  );
}
