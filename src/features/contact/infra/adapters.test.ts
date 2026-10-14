import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const { createMemoryRateLimiter, clientKeyFrom } = await import('./adapters')

describe('createMemoryRateLimiter', () => {
  it('permite até o limite e bloqueia depois, por chave', async () => {
    const limiter = createMemoryRateLimiter(2, 60_000)
    expect((await limiter.limit('a')).success).toBe(true)
    expect((await limiter.limit('a')).success).toBe(true)
    expect((await limiter.limit('a')).success).toBe(false)
    expect((await limiter.limit('b')).success).toBe(true)
  })
})

describe('clientKeyFrom', () => {
  it('gera hash estável e nunca expõe o IP', async () => {
    const h = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })
    const key = await clientKeyFrom(h)
    expect(key).toMatch(/^[a-f0-9]{64}$/)
    expect(key).not.toContain('203.0.113.7')
    expect(await clientKeyFrom(new Headers({ 'x-forwarded-for': '203.0.113.7' }))).toBe(key)
  })
})
