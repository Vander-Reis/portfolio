import { z } from 'zod'

/** Regras puras do formulário de contato — sem framework, sem I/O. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'name_short')
    .max(100, 'name_long')
    .regex(/^[^\r\n<>]+$/, 'name_invalid'),
  email: z.string().trim().toLowerCase().email('email_invalid').max(254, 'email_invalid'),
  message: z.string().trim().min(10, 'message_short').max(5000, 'message_long'),
})

export type ContactInput = z.infer<typeof contactSchema>
export type ContactField = keyof ContactInput

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escapa HTML e remove caracteres de controle (exceto \n e \t). */
export function sanitizeText(value: string): string {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: remoção intencional de caracteres de controle
  const withoutControl = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
  return withoutControl.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c] ?? c)
}

/** Honeypot: humanos não veem o campo `website`; bots o preenchem. */
export function isBot(fields: { website?: string | null }): boolean {
  return Boolean(fields.website && fields.website.trim().length > 0)
}
