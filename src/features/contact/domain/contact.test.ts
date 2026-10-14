import { describe, expect, it } from 'vitest'
import { contactSchema, isBot, sanitizeText } from './contact'

const valid = {
  name: 'Ana Souza',
  email: 'ana@example.com',
  message: 'Olá! Gostaria de conversar sobre um projeto.',
}

describe('contactSchema', () => {
  it('aceita uma mensagem válida e normaliza espaços/e-mail', () => {
    const parsed = contactSchema.parse({ ...valid, name: '  Ana Souza ', email: ' ANA@Example.com ' })
    expect(parsed.name).toBe('Ana Souza')
    expect(parsed.email).toBe('ana@example.com')
  })

  it('rejeita e-mail inválido, nome curto e mensagem curta', () => {
    const result = contactSchema.safeParse({ name: 'A', email: 'nope', message: 'oi' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const fields = Object.keys(result.error.flatten().fieldErrors)
      expect(fields).toEqual(expect.arrayContaining(['name', 'email', 'message']))
    }
  })

  it('limita o tamanho para evitar abuso', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'a'.repeat(5001) }).success).toBe(false)
  })

  it('rejeita quebras de linha no nome (header injection)', () => {
    expect(contactSchema.safeParse({ ...valid, name: 'Ana\r\nBcc: x@y.com' }).success).toBe(false)
  })
})

describe('sanitizeText', () => {
  it('escapa HTML', () => {
    expect(sanitizeText('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(sanitizeText(`"a" & 'b'`)).toBe('&quot;a&quot; &amp; &#39;b&#39;')
  })

  it('remove caracteres de controle mas mantém quebras de linha', () => {
    expect(sanitizeText('a\u0000b\u0007c\nd')).toBe('abc\nd')
  })
})

describe('isBot', () => {
  it('detecta o honeypot preenchido', () => {
    expect(isBot({ website: 'http://spam' })).toBe(true)
    expect(isBot({ website: '' })).toBe(false)
    expect(isBot({})).toBe(false)
  })
})
