export interface PayoutRecord {
  id: string;
  amount: number;
  currency: string;
  recipientAccount: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy?: string;
  idempotencyKey: string;
  createdAt: number;
}

export class PayProviderClient {
  private payouts: PayoutRecord[] = [
    {
      id: 'pot_001',
      amount: 1450.0,
      currency: 'USD',
      recipientAccount: 'acc_cmp_10',
      status: 'pending',
      requestedBy: 'acc_mgr_1',
      idempotencyKey: 'idem_pot_001',
      createdAt: 1728980000,
    },
  ];

  async listPayouts(): Promise<PayoutRecord[]> {
    return [...this.payouts];
  }

  async getPayout(id: string): Promise<PayoutRecord | null> {
    return this.payouts.find((p) => p.id === id) || null;
  }

  async approvePayout(id: string, approverId: string): Promise<boolean> {
    const item = this.payouts.find((p) => p.id === id);
    if (!item) return false;
    item.status = 'approved';
    item.approvedBy = approverId;
    return true;
  }
}

export const payProvider = new PayProviderClient();
