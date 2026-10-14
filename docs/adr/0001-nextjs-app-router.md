# ADR 0001 — Next.js 15 (App Router) + React 19 + TypeScript strict

- **Status:** aceito
- **Data:** 2026-10-13

## Contexto

O portfólio anterior era um app Vite (SPA) sem conteúdo indexável. Precisamos de SEO de verdade
(HTML renderizado no servidor), Open Graph dinâmico, i18n, formulário com lógica server-side e
headers de segurança por requisição (CSP com nonce).

## Decisão

Next.js 15 com App Router, React 19 e TypeScript em modo `strict` (+ `noUncheckedIndexedAccess`).

- **Server Components por padrão.** Client Components apenas onde há interação ou animação
  (`'use client'` em hero, timeline, diagramas, formulário, header).
- **Server Actions** para o formulário de contato — sem rota de API pública extra.
- **Middleware** gera o nonce da CSP e resolve o locale.

## Consequências

- A CSP com nonce torna as páginas dinâmicas (nonce por requisição). O custo é compensado pelo
  Data Cache: as chamadas ao GitHub são cacheadas por 1h (`revalidate: 3600`).
- Alternativa descartada: Astro — excelente para conteúdo, mas Server Actions, next-intl e o
  ecossistema React/Motion pesaram a favor do Next.
