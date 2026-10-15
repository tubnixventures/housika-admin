export function contactReplyEmail(recipientName: string, subject: string, replyText: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Housika Customer Support</h2>
      <p>Dear ${recipientName},</p>
      <p>Thank you for reaching out to us regarding: <strong>${subject}</strong>.</p>
      <div style="border-left: 4px solid #f59e0b; padding-left: 12px; margin: 16px 0; color: #334155;">
        ${replyText.replace(/\n/g, '<br/>')}
      </div>
      <p>If you have any further questions, feel free to reply directly to this email.</p>
      <p>Warm regards,<br/>The Housika Support Team</p>
    </div>
  `;
}
