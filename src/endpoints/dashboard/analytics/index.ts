import { Context } from 'hono';
import { jsonSuccess } from '../../../helpers/response';
import { DashboardAnalyticsQuerySchema } from './schema';

export async function handleDashboardAnalytics(c: Context) {
  const query = DashboardAnalyticsQuerySchema.parse(c.req.query());

  return jsonSuccess(c, {
    range: query.range,
    traffic: {
      totalRequests: 45290,
      uniqueStaffSessions: 42,
      averageLatencyMs: 18.4,
    },
    platformHealth: {
      uptimePercent: 99.98,
      errorRatePercent: 0.02,
      activeRegions: ['cdg01', 'lon01', 'jnb01'],
    },
    businessMetrics: {
      grossBookingValueUsd: 184500,
      platformFeeRevenueUsd: 14760,
      activeAgenciesCount: 128,
    },
  });
}
