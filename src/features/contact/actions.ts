'use server'

import { headers } from 'next/headers'
import { type SendMessageResult, sendMessage } from './application/send-message'
import { clientKeyFrom, getCaptchaVerifier, getMailer, getRateLimiter } from './infra/adapters'

export type ContactState = SendMessageResult | { status: 'idle' }

const str = (v: FormDataEntryValue | null) => (typeof v === 'string' ? v : undefined)

/** Server Action: apenas adapta FormData → caso de uso. Toda regra vive em `application/`. */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const clientKey = await clientKeyFrom(await headers())
  return sendMessage(
    {
      name: str(formData.get('name')),
      email: str(formData.get('email')),
      message: str(formData.get('message')),
      website: str(formData.get('website')),
      captchaToken: str(formData.get('cf-turnstile-response')),
    },
    { clientKey },
    { rateLimiter: getRateLimiter(), captcha: getCaptchaVerifier(), mailer: getMailer() },
  )
}
