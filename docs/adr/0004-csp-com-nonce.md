# ADR 0004 — CSP estrita com nonce

- **Status:** aceito
- **Data:** 2026-10-13

## Decisão

O middleware gera um nonce de 128 bits (Web Crypto) por requisição e envia:

```
script-src 'nonce-<n>' 'strict-dynamic' https:
style-src 'self' 'nonce-<n>'
style-src-attr 'unsafe-inline'
object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'
upgrade-insecure-requests
```

- O Next lê o nonce do header CSP da requisição e o aplica aos próprios scripts.
- `'strict-dynamic'` permite que scripts confiáveis carreguem outros (Turnstile, Analytics) sem
  liberar hosts. `https:` é apenas fallback para navegadores sem CSP3.
- **Nenhum `'unsafe-inline'` em scripts.** É a parte que protege contra XSS.

## Trade-off: `style-src-attr 'unsafe-inline'`

React (SSR) e Motion renderizam atributos `style=""` (ex.: estado inicial das animações,
`next/image`). Bloqueá-los exigiria abrir mão das animações SSR ou de `next/image`.
Atributos de estilo não executam JavaScript; `<style>` continua exigindo nonce. O Mozilla
Observatory não penaliza esse caso a ponto de impedir A+.

Em **desenvolvimento**, `style-src` usa `'unsafe-inline'` (o overlay do Next injeta `<style>` sem
nonce) e `script-src` ganha `'unsafe-eval'` (React Refresh). Produção não tem nenhum dos dois —
coberto por testes em `src/shared/lib/csp.test.ts`.

## Demais headers

Definidos uma única vez em `securityHeaders` e aplicados em todas as rotas via `next.config.ts`:
HSTS (2 anos, preload), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Frame-Options`, COOP e CORP.
