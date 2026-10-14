import { describe, expect, it } from 'vitest'
import en from '../../messages/en.json'
import pt from '../../messages/pt-BR.json'

function keys(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj) || typeof obj !== 'object' || obj === null) return [prefix]
  return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
}

describe('i18n', () => {
  it('pt-BR e en têm exatamente as mesmas chaves', () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort())
  })

  it('nenhuma mensagem vazia', () => {
    const empty = (o: unknown): boolean =>
      typeof o === 'string' ? o.trim() === '' : Object.values(o as object).some(empty)
    expect(empty(pt)).toBe(false)
    expect(empty(en)).toBe(false)
  })
})
