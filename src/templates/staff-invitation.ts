export function staffInvitationEmail(name: string, role: string, temporaryPassword: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Welcome to the Housika Platform Team</h2>
      <p>Hello ${name},</p>
      <p>An administrative account has been provisioned for you with the role of <strong>${role}</strong>.</p>
      <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-family: monospace;">
        Temporary Password: ${temporaryPassword}
      </div>
      <p>Please log in immediately at <a href="https://admin.housika.com">admin.housika.com</a> and update your credentials.</p>
      <p>Best regards,<br/>Housika Platform Security Operations</p>
    </div>
  `;
}
