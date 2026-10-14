/**
 * Monta a Content-Security-Policy. Função pura: recebe o nonce e o ambiente,
 * devolve a string — fácil de testar e de auditar.
 *
 * - script-src: só scripts com nonce; 'strict-dynamic' propaga a confiança
 *   para scripts carregados por eles (runtime do Next, Turnstile, Analytics).
 *   Sem 'unsafe-inline' e sem hosts liberados.
 * - style-src: arquivos do próprio domínio + <style> com nonce.
 * - style-src-attr: atributos `style=""` gerados no SSR por React/Motion
 *   (ver ADR 0004). Atributos de estilo não executam script.
 */
export type CspOptions = {
  nonce: string
  isDev: boolean
}

export function buildCsp({ nonce, isDev }: CspOptions): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      // Fallback para navegadores sem CSP3 (ignorado quando há nonce + strict-dynamic).
      'https:',
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    // Em dev o overlay do Next injeta <style> sem nonce (shadow DOM). Com nonce presente
    // o navegador ignora 'unsafe-inline', por isso o nonce sai apenas em dev.
    'style-src': isDev ? ["'self'", "'unsafe-inline'"] : ["'self'", `'nonce-${nonce}'`],
    'style-src-attr': ["'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https://avatars.githubusercontent.com', 'https://github.com'],
    'font-src': ["'self'"],
    'connect-src': [
      "'self'",
      'https://challenges.cloudflare.com',
      'https://vitals.vercel-insights.com',
      ...(isDev ? ['ws:', 'wss:'] : []),
    ],
    'frame-src': ['https://challenges.cloudflare.com'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'none'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  }

  const policy = Object.entries(directives).map(([key, values]) => `${key} ${values.join(' ')}`)
  if (!isDev) policy.push('upgrade-insecure-requests')
  return policy.join('; ')
}

/** Headers de segurança estáticos aplicados a todas as respostas. */
export const securityHeaders: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-DNS-Prefetch-Control': 'off',
  'X-Permitted-Cross-Domain-Policies': 'none',
}

/** Nonce aleatório de 128 bits em base64 — compatível com o Edge runtime. */
export function createNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

/** Remove o nonce de uma CSP para exibi-la publicamente. */
export function redactNonce(csp: string): string {
  return csp.replace(/'nonce-[^']+'/g, "'nonce-…'")
}
