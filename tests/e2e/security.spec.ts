import { expect, test } from '@playwright/test'

test.describe('headers de segurança', () => {
  test('CSP com nonce único por requisição e sem unsafe-inline em scripts', async ({ request }) => {
    const a = (await request.get('/')).headers()['content-security-policy'] ?? ''
    const b = (await request.get('/')).headers()['content-security-policy'] ?? ''
    const nonce = (csp: string) => /'nonce-([^']+)'/.exec(csp)?.[1]
    expect(nonce(a)).toBeTruthy()
    expect(nonce(a)).not.toBe(nonce(b))
    const scriptSrc = a.split(';').find((d) => d.trim().startsWith('script-src')) ?? ''
    expect(scriptSrc).not.toContain('unsafe-inline')
    expect(scriptSrc).not.toContain('unsafe-eval')
    expect(a).toContain("frame-ancestors 'none'")
  })

  test('headers estáticos presentes', async ({ request }) => {
    const h = (await request.get('/')).headers()
    expect(h['strict-transport-security']).toContain('preload')
    expect(h['x-content-type-options']).toBe('nosniff')
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(h['cross-origin-opener-policy']).toBe('same-origin')
    expect(h['cross-origin-resource-policy']).toBe('same-origin')
    expect(h['permissions-policy']).toContain('camera=()')
    expect(h['x-powered-by']).toBeUndefined()
  })

  test('scripts da página carregam o nonce da resposta', async ({ page }) => {
    const res = await page.goto('/')
    const nonce = /'nonce-([^']+)'/.exec(res?.headers()['content-security-policy'] ?? '')?.[1]
    const withoutNonce = await page.$$eval(
      'script:not([type="application/ld+json"])',
      (els) => els.filter((s) => !(s as HTMLScriptElement).nonce).length,
    )
    expect(nonce).toBeTruthy()
    expect(withoutNonce).toBe(0)
  })

  test('security.txt publicado', async ({ request }) => {
    const res = await request.get('/.well-known/security.txt')
    expect(res.status()).toBe(200)
    expect(await res.text()).toContain('Contact:')
  })

  test('nenhum erro de CSP no console', async ({ page }) => {
    const violations: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy/i.test(msg.text())) violations.push(msg.text())
    })
    await page.goto('/')
    await page.mouse.wheel(0, 4000)
    await page.waitForTimeout(500)
    expect(violations).toEqual([])
  })
})
