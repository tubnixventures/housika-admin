import { Context } from 'hono';
import { jsonSuccess } from '../../../helpers/response';
import { cosmosClient } from '../../../connectors/cosmos';

export async function handleDashboardSummary(c: Context) {
  const accountsDb = (c.env as any).DB_ACCOUNTS;
  const adminBannersDb = (c.env as any).ADMIN_BANNERS_D1;
  const adminContactsDb = (c.env as any).ADMIN_CONTACTS_D1;

  let staffCount = 0;
  let activeBanners = 0;
  let pendingTickets = 0;

  if (accountsDb) {
    const r = await accountsDb.prepare("SELECT COUNT(*) as cnt FROM accounts WHERE account_type = 'housika'").first<any>();
    staffCount = r?.cnt || 0;
  }
  if (adminBannersDb) {
    const r = await adminBannersDb.prepare("SELECT COUNT(*) as cnt FROM banners WHERE status = 'active'").first<any>();
    activeBanners = r?.cnt || 0;
  }
  if (adminContactsDb) {
    const r = await adminContactsDb.prepare("SELECT COUNT(*) as cnt FROM contact_messages WHERE status = 'new'").first<any>();
    pendingTickets = r?.cnt || 0;
  }

  const properties = await cosmosClient.listProperties();
  const flaggedProperties = properties.filter((p) => p.status === 'flagged').length;

  return jsonSuccess(c, {
    staffCount,
    activeBanners,
    pendingTickets,
    flaggedProperties,
    activeListingsCount: properties.filter((p) => p.status === 'active').length,
  });
}
