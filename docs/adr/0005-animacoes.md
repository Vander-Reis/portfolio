# ADR 0005 — Animações com Motion + Lenis, sem custo de performance

- **Status:** aceito
- **Data:** 2026-10-13

## Decisão

- **Motion** com `LazyMotion` + `m.*` e features (`domAnimation`) carregadas sob demanda — o
  bundle inicial não leva o motor completo.
- `MotionConfig reducedMotion="user"`: com `prefers-reduced-motion`, transforms viram cortes.
  O CSS global também zera durações. Lenis não é ativado nesse caso nem em telas touch.
- **Diagramas** em SVG: `pathLength` para desenhar arestas e SMIL `<animateMotion>` para as
  "mensagens" fluindo — sem JavaScript por frame.
- **Spotlight** atualiza apenas CSS custom properties (sem re-render).
- **View Transitions** entre lista e case via `next-view-transitions` (`view-transition-name`
  compartilhado no título).
- Texto do hero está completo no HTML do SSR; a revelação palavra a palavra é progressiva.

## Tokens

Curvas e durações em `src/shared/lib/motion.ts`, espelhadas em CSS (`globals.css`).
Ver `docs/design-system.md`.
