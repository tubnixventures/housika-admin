import { redactSensitive } from '../helpers/redact';

export interface CosmosProperty {
  id: string;
  country: string;
  title: string;
  city: string;
  status: 'active' | 'pending' | 'flagged' | 'rejected' | 'suspended';
  unitsCount: number;
  ownerId: string;
  createdAt: number;
}

export interface CosmosUnit {
  id: string;
  propertyId: string;
  country: string;
  unitNumber: string;
  monthlyRent: number;
  status: 'available' | 'occupied' | 'maintenance' | 'flagged';
}

export interface CosmosBooking {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'disputed';
  amount: number;
  createdAt: number;
}

export interface CosmosPayment {
  id: string;
  country: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'reconciled' | 'flagged';
  method: string;
  createdAt: number;
}

export class CosmosClient {
  private properties: CosmosProperty[] = [
    { id: 'prop_001', country: 'KE', title: 'Westlands Luxury Heights', city: 'Nairobi', status: 'flagged', unitsCount: 12, ownerId: 'acc_cmp_10', createdAt: 1728950400 },
    { id: 'prop_002', country: 'KE', title: 'Kilimani Studio Suites', city: 'Nairobi', status: 'active', unitsCount: 8, ownerId: 'acc_cmp_11', createdAt: 1728954000 },
    { id: 'prop_003', country: 'RW', title: 'Kacyiru Green View Villa', city: 'Kigali', status: 'pending', unitsCount: 4, ownerId: 'acc_cmp_12', createdAt: 1728960000 },
  ];

  private units: CosmosUnit[] = [
    { id: 'unt_001', propertyId: 'prop_001', country: 'KE', unitNumber: '4B', monthlyRent: 850, status: 'flagged' },
    { id: 'unt_002', propertyId: 'prop_002', country: 'KE', unitNumber: '1A', monthlyRent: 450, status: 'available' },
  ];

  private bookings: CosmosBooking[] = [
    { id: 'bok_001', tenantId: 'acc_ind_21', propertyId: 'prop_001', unitId: 'unt_001', status: 'disputed', amount: 850, createdAt: 1728970000 },
  ];

  private payments: CosmosPayment[] = [
    { id: 'pay_001', country: 'KE', bookingId: 'bok_001', amount: 850, currency: 'USD', status: 'pending', method: 'mpesa', createdAt: 1728972000 },
  ];

  async listProperties(country?: string): Promise<CosmosProperty[]> {
    return country ? this.properties.filter((p) => p.country === country) : [...this.properties];
  }

  async getProperty(id: string): Promise<CosmosProperty | null> {
    return this.properties.find((p) => p.id === id) || null;
  }

  async updatePropertyStatus(id: string, status: CosmosProperty['status']): Promise<boolean> {
    const item = this.properties.find((p) => p.id === id);
    if (!item) return false;
    item.status = status;
    return true;
  }

  async listUnits(propertyId?: string): Promise<CosmosUnit[]> {
    return propertyId ? this.units.filter((u) => u.propertyId === propertyId) : [...this.units];
  }

  async updateUnitStatus(id: string, status: CosmosUnit['status']): Promise<boolean> {
    const item = this.units.find((u) => u.id === id);
    if (!item) return false;
    item.status = status;
    return true;
  }

  async listBookings(): Promise<CosmosBooking[]> {
    return [...this.bookings];
  }

  async updateBookingStatus(id: string, status: CosmosBooking['status']): Promise<boolean> {
    const item = this.bookings.find((b) => b.id === id);
    if (!item) return false;
    item.status = status;
    return true;
  }

  async listPayments(): Promise<CosmosPayment[]> {
    return [...this.payments];
  }

  async reconcilePayment(id: string): Promise<boolean> {
    const item = this.payments.find((p) => p.id === id);
    if (!item) return false;
    item.status = 'reconciled';
    return true;
  }
}

export const cosmosClient = new CosmosClient();
