# ADR 0002 — Clean Architecture adaptada ao front-end

- **Status:** aceito
- **Data:** 2026-10-13

## Contexto

Um portfólio de um dev back-end sênior também é uma amostra de código. Queremos regras de negócio
testáveis isoladamente, sem acoplamento a Next.js, React ou provedores externos.

## Decisão

```
src/
  app/        → rotas (camada de entrega). Só compõe features.
  features/   → domínios verticais (career, cases, contact, github…)
    <feature>/
      domain/       → regras puras (sem I/O, sem framework) + testes
      application/  → casos de uso que dependem de *portas* (interfaces)
      infra/        → adapters (Upstash, Turnstile, Resend, GitHub API)
      *.tsx         → UI da feature
  shared/     → ui, lib, config, i18n (sem regras de negócio)
content/      → MDX validado por Zod (Velite)
```

Regra de dependência: `app → features → shared`. `domain` não importa nada de `infra` nem de React.

Exemplo: `features/contact/application/send-message.ts` recebe `RateLimiter`, `CaptchaVerifier`
e `Mailer` por injeção. A Server Action (`actions.ts`) apenas monta os adapters reais. Os testes
usam fakes — sem rede, sem mocks de módulo.

## Consequências

- Trocar Resend por SES, ou Upstash por outro store, muda apenas `infra/`.
- Um pouco mais de arquivos do que o "tudo no componente" — aceitável pelo ganho em testabilidade.
