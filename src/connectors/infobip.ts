import { logger } from '../utils/logger';

export class InfobipClient {
  constructor(private apiKey?: string) {}

  async sendSms(destination: string, text: string): Promise<boolean> {
    if (!this.apiKey) {
      logger.info(`[Infobip SMS Simulation] Message to ${destination}`);
      return true;
    }
    return true;
  }
}

export const infobipClient = new InfobipClient();
