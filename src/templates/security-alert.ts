export function securityAlertEmail(adminEmail: string, alertAction: string, details: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0;">
      <h2 style="color: #dc2626;">Security Notification: High-Privilege Action</h2>
      <p>An administrative action was executed on the Housika platform requiring audit visibility.</p>
      <p><strong>Actor:</strong> ${adminEmail}</p>
      <p><strong>Action:</strong> ${alertAction}</p>
      <p><strong>Details:</strong> ${details}</p>
      <p>Timestamp: ${new Date().toISOString()}</p>
    </div>
  `;
}
