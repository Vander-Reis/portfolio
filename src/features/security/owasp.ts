import type { L10n } from '@/shared/lib/l10n'

/** OWASP Top 10:2025 — como cada risco é tratado neste site. */
export const owaspTop10: { id: string; name: string; how: L10n }[] = [
  {
    id: 'A01',
    name: 'Broken Access Control',
    how: {
      'pt-BR':
        'Sem área autenticada nem painel administrativo; a única mutação é a Server Action de contato, com validação e rate limit. CORP/COOP isolam a origem.',
      en: 'No authenticated area or admin panel; the only mutation is the contact Server Action, validated and rate limited. CORP/COOP isolate the origin.',
    },
  },
  {
    id: 'A02',
    name: 'Security Misconfiguration',
    how: {
      'pt-BR':
        'Headers aplicados centralmente (next.config + middleware), X-Powered-By removido, CSP estrita testada em unidade e varredura OWASP ZAP no CI.',
      en: 'Headers applied centrally (next.config + middleware), X-Powered-By removed, strict CSP unit-tested and OWASP ZAP baseline scan in CI.',
    },
  },
  {
    id: 'A03',
    name: 'Software Supply Chain Failures',
    how: {
      'pt-BR':
        'Lockfile congelado, pnpm audit, Dependabot, SBOM (CycloneDX) por build e scripts de instalação bloqueados por padrão (onlyBuiltDependencies).',
      en: 'Frozen lockfile, pnpm audit, Dependabot, CycloneDX SBOM per build and install scripts blocked by default (onlyBuiltDependencies).',
    },
  },
  {
    id: 'A04',
    name: 'Cryptographic Failures',
    how: {
      'pt-BR':
        'HTTPS obrigatório com HSTS preload de 2 anos, upgrade-insecure-requests e nonce de 128 bits gerado com Web Crypto a cada requisição.',
      en: 'HTTPS enforced with a 2-year HSTS preload, upgrade-insecure-requests and a 128-bit Web Crypto nonce per request.',
    },
  },
  {
    id: 'A05',
    name: 'Injection',
    how: {
      'pt-BR':
        "Validação com Zod no servidor, escape de HTML antes do e-mail, bloqueio de CRLF no nome e CSP sem 'unsafe-inline' em scripts contra XSS.",
      en: "Server-side Zod validation, HTML escaping before e-mail, CRLF blocked in names and a CSP without 'unsafe-inline' scripts against XSS.",
    },
  },
  {
    id: 'A06',
    name: 'Insecure Design',
    how: {
      'pt-BR':
        'Regras de negócio isoladas em casos de uso testados (TDD), portas e adapters, e decisões registradas em ADRs.',
      en: 'Business rules isolated in tested use cases (TDD), ports and adapters, and decisions recorded as ADRs.',
    },
  },
  {
    id: 'A07',
    name: 'Authentication Failures',
    how: {
      'pt-BR':
        'Não há login. Contra automação: Cloudflare Turnstile, honeypot e rate limit por hash de IP (3 envios / 10 min).',
      en: 'There is no login. Against automation: Cloudflare Turnstile, a honeypot and per-IP-hash rate limiting (3 sends / 10 min).',
    },
  },
  {
    id: 'A08',
    name: 'Software or Data Integrity Failures',
    how: {
      'pt-BR':
        "Scripts só executam com nonce e 'strict-dynamic'; branch main protegida com revisão obrigatória e checks verdes.",
      en: "Scripts run only with a nonce and 'strict-dynamic'; protected main branch with required review and green checks.",
    },
  },
  {
    id: 'A09',
    name: 'Logging & Alerting Failures',
    how: {
      'pt-BR':
        'Logs sem dados pessoais (nem e-mail, nem IP, nem mensagem). Alertas do CodeQL, gitleaks e Dependabot chegam via GitHub Security.',
      en: 'Logs carry no personal data (no e-mail, IP or message). CodeQL, gitleaks and Dependabot alerts surface in GitHub Security.',
    },
  },
  {
    id: 'A10',
    name: 'Mishandling of Exceptional Conditions',
    how: {
      'pt-BR':
        'Falhas externas (GitHub, Resend, Turnstile) degradam graciosamente com timeout e mensagens genéricas — nenhum stack trace chega ao cliente.',
      en: 'External failures (GitHub, Resend, Turnstile) degrade gracefully with timeouts and generic messages — no stack trace reaches the client.',
    },
  },
]
