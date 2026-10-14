# ADR 0003 — Conteúdo em MDX (Velite + Zod) e i18n com next-intl

- **Status:** aceito
- **Data:** 2026-10-13

## Decisão

- **Cases** em MDX (`content/cases/<locale>/<slug>.mdx`) compilados pelo **Velite**. O frontmatter
  é validado por schema (Zod via `s`): o formato contexto → problema → solução → arquitetura →
  resultado é obrigatório e o build falha se algo faltar.
- O slug é o mesmo nos dois idiomas, para a troca de idioma manter a página.
- **UI strings** em `messages/<locale>.json` (next-intl). Um teste garante que pt-BR e en têm as
  mesmas chaves.
- **Dados estruturados** (cargos, certificações, stack) em TypeScript com campos `L10n` — tipados e
  testáveis (ex.: o teste que comprova "estagiário → sênior em menos de 3 anos").
- pt-BR é o padrão em `/`; inglês em `/en` (`localePrefix: 'as-needed'`).

## Nota sobre o plugin do next-intl

O `next-intl/plugin` carrega `@swc/core` em runtime. Versões recentes do binário nativo validam as
ACLs do diretório de cache e falham em algumas máquinas Windows. Como o plugin apenas registra o
alias `next-intl/config`, o alias é configurado diretamente em `next.config.ts` (turbopack + webpack).
