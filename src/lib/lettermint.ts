import { Lettermint } from 'lettermint'

if (!process.env.LETTERMINT_API_KEY) {
  console.warn('LETTERMINT_API_KEY missing – email sending will fail until set')
}

// Raw SDK client (chainable .email builder)
export const lettermintClient = new Lettermint({ apiToken: process.env.LETTERMINT_API_KEY || '' })

export class MailerError extends Error {
  status?: number
  code?: string
  details?: unknown
  constructor(message: string, opts: { status?: number; code?: string; details?: unknown } = {}) {
    super(message)
    this.name = 'MailerError'
    this.status = opts.status
    this.code = opts.code
    this.details = opts.details
  }
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function safeSendEmail(args: { to: string; subject: string; html: string; text?: string; headers?: Record<string,string>; idempotencyKey?: string }) {
  const { to, subject, html, text, headers, idempotencyKey } = args
  const maxAttempts = 3
  let attempt = 0
  let lastErr: unknown
  while (attempt < maxAttempts) {
    try {
      // Build and send using chainable API
      const fromEmail = process.env.LETTERMINT_FROM_EMAIL || 'contact@launch-print.com'
      const fromName = process.env.LETTERMINT_FROM_NAME
      let builder = lettermintClient.email
        .from(fromName ? `${fromName} <${fromEmail}>` : fromEmail)
        .to(to)
        .subject(subject)
        .html(html)
        .text(text || '')
      if (headers) builder = builder.headers(headers)
      if (idempotencyKey) builder = builder.idempotencyKey(idempotencyKey)
      const res = await builder.send()
      return res
    } catch (err: unknown) {
      lastErr = err
      // Attempt to read HTTP-like status
      let status: number | undefined
      if (typeof err === 'object' && err && 'response' in err) {
        const respVal = (err as { response?: { status?: number } }).response
        status = respVal?.status
      }
      if (status && [429,500,502,503,504].includes(status) && attempt < maxAttempts - 1) {
        await sleep(300 * (attempt + 1) ** 2)
        attempt++
        continue
      }
      throw new MailerError('Failed to send email', { status, details: err })
    }
  }
  throw new MailerError('Failed to send email', { details: lastErr })
}
