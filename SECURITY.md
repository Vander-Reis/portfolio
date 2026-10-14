# Política de segurança

## Reportando uma vulnerabilidade

Encontrou algo? Obrigado por ajudar. Por favor, **não abra uma issue pública**.

- Use **[GitHub Security Advisories](https://github.com/Vander-Reis/portfolio/security/advisories/new)** (preferencial), ou
- fale comigo pelo [LinkedIn](https://www.linkedin.com/in/vander-reis-044163201/).

Inclua: URL afetada, passos para reproduzir, impacto esperado e, se possível, uma prova de conceito
não destrutiva. Respondo em até 5 dias úteis e mantenho você informado até a correção.

## Escopo

- Em escopo: este site (código deste repositório e o deploy de produção).
- Fora de escopo: ataques de negação de serviço, engenharia social, testes automatizados em volume,
  vulnerabilidades em serviços de terceiros (Vercel, Cloudflare, Resend, Upstash, GitHub).

## O que já está implementado

Ver a página `/security` do site e os ADRs em `docs/adr/`:

- CSP estrita com nonce por requisição e `'strict-dynamic'` (sem `'unsafe-inline'` em scripts).
- HSTS com preload, COOP, CORP, `frame-ancestors 'none'`, `Permissions-Policy`, `Referrer-Policy`.
- Formulário: validação Zod no servidor, Cloudflare Turnstile, rate limit (Upstash), honeypot,
  sanitização e logs sem dados pessoais.
- CI: CodeQL, gitleaks, `pnpm audit`, SBOM CycloneDX, OWASP ZAP baseline e Dependabot.
- Mapeamento completo do OWASP Top 10:2025 em `src/features/security/owasp.ts`.
