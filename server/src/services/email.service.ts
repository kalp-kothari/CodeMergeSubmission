import { env } from '../config/env';
import { logger } from '../utils/logger';

export const sendConfirmationEmail = async (data: { to: string; teamName: string; submissionId: string; submittedAt: Date }): Promise<void> => {
  if (!env.RESEND_API_KEY) {
    logger.info('Email sending not configured, skipping.');
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'CodeMerge <noreply@yourdomain.com>',
        to: data.to,
        subject: `Submission Confirmation: ${data.submissionId}`,
        html: `
          <h1>Submission Received</h1>
          <p>Dear ${data.teamName},</p>
          <p>We have successfully received your submission.</p>
          <ul>
            <li><strong>Submission ID:</strong> ${data.submissionId}</li>
            <li><strong>Submitted At:</strong> ${data.submittedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</li>
          </ul>
        `
      })
    });

    if (!res.ok) {
      logger.error('Failed to send email via Resend API', await res.text());
    }
  } catch (error) {
    logger.error('Error sending confirmation email', error);
  }
};
