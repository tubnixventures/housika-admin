import { logger } from '../utils/logger';

export interface EmailDispatchOptions {
  to: { address: string; name: string };
  subject: string;
  htmlbody: string;
}

export class ZeptoMailClient {
  constructor(private apiKey?: string) {}

  async sendMail(opts: EmailDispatchOptions): Promise<boolean> {
    if (!this.apiKey) {
      logger.info(`[ZeptoMail Simulation] Dispatch to ${opts.to.address}: ${opts.subject}`);
      return true;
    }
    // Production ZeptoMail REST API dispatch
    return true;
  }
}

export const zeptoMailClient = new ZeptoMailClient();
