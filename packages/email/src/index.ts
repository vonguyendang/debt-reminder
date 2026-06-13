export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ messageId: string | null; error: string | null }>;
}

export class ResendProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    this.apiKey = apiKey;
    this.fromEmail = fromEmail;
  }

  async send(message: EmailMessage): Promise<{ messageId: string | null; error: string | null }> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: message.to,
          subject: message.subject,
          html: message.html,
          text: message.text
        })
      });

      const data: any = await response.json();
      if (!response.ok) {
        return { messageId: null, error: data.message || 'Unknown Resend error' };
      }
      return { messageId: data.id, error: null };
    } catch (e: any) {
      return { messageId: null, error: e.message };
    }
  }
}
