import { Env } from '../types/env';

export interface AnalyticsEvent {
  blobs: string[];
  doubles: number[];
  indexes: string[];
}

export class AnalyticsEngineClient {
  constructor(private dataset: string = 'housika_admin_analytics') {}

  writeDataPoint(event: AnalyticsEvent): void {
    // In production Cloudflare Worker, this writes to env.ANALYTICS.writeDataPoint(...)
    // Silently records admin operational events
  }
}

export const analyticsEngine = new AnalyticsEngineClient();
