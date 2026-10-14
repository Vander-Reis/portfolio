# Design system — clean, claro e vivo

## Cores (tokens semânticos)

| Token          | Claro (padrão) | Escuro    | Uso                                      |
| -------------- | -------------- | --------- | ---------------------------------------- |
| `bg`           | `#FAFAF7`      | `#0D0D0C` | Fundo quente                             |
| `surface`      | `#FFFFFF`      | `#151514` | Cards                                    |
| `surface-2`    | `#F3F2EC`      | `#1C1C1A` | Chips, hovers                            |
| `ink`          | `#111111`      | `#F2F1EC` | Texto principal                          |
| `ink-2`        | `#3B3B38`      | `#CFCDC5` | Texto secundário                         |
| `muted`        | `#6B6A64`      | `#9A9890` | Metadados, eyebrows                      |
| `line`         | `#E6E4DC`      | `#2A2926` | Bordas de 1px                            |
| `accent`       | `#2B4BFF`      | `#7088FF` | **Única** cor de destaque — com parcimônia |

Contraste: `ink`/`bg` ≈ 18:1, `ink-2`/`bg` ≈ 10.8:1, `muted`/`bg` ≈ 5.2:1, `accent`/`bg` ≈ 5.7:1 (AA).

## Tipografia

- **Geist** — texto e títulos (500).
- **Instrument Serif itálico** — palavras de destaque (`<em>` nas mensagens → `.em-serif`).
- **Geist Mono** — só detalhes técnicos: eyebrows, datas, chips de stack, código.

Escala fluida (`clamp`): `display` 44→104px, `h1` 36→68px, `h2` 28→44px, `h3` 22px, `lead` 18→22px.
Títulos com tracking negativo e `text-wrap: balance`.

## Espaço e forma

- Base de 4px (escala do Tailwind). Seções com `py-20 / sm:py-28`.
- Container 1200px, gutter 20px (mobile) / 32px.
- Grid editorial de 12 colunas; cabeçalho de seção: número + eyebrow em 3 colunas, título em 9.
- Bordas 1px; raio `14px` em cards, `999px` em chips/botões.

## Movimento

| Token          | Valor                            | Uso                         |
| -------------- | -------------------------------- | --------------------------- |
| `ease.outExpo` | `cubic-bezier(0.16, 1, 0.3, 1)`  | Entradas (padrão)           |
| `ease.inOutQuart` | `cubic-bezier(0.76, 0, 0.24, 1)` | Desenho de caminhos, estados |
| `fast`         | 150ms                            | Hovers                      |
| `base`         | 300ms                            | Transições de UI            |
| `slow`         | 600ms                            | Reveals                     |
| `slower`       | 900ms                            | Hero (blur → foco)          |
| `stagger.words`| 45ms                             | Palavras do hero            |

Regras: nada anima `width/height/top/left`; só `opacity`, `transform`, `filter` e `pathLength`.
Tudo respeita `prefers-reduced-motion`.

## Esboço da home

```
┌───────────────────────────────────────────────────────────────┐
│ VR Vander Reis        Cases Trajetória Cert. Stack Contato  PT│EN ☾ │
├───────────────────────────────────────────────────────────────┤
│ ● BACK-END SÊNIOR · TECH ONE                                    │
│ Entrei na tecnologia em 2020. Em menos de                       │
│ 3 anos, de estagiário a *sênior.*                               │
│ lead ...                              [Ver cases] [Falar comigo]│
│ 30 meses │ 5 cargos │ 8 certificações │ 6+ anos                 │
├─ 02 Sobre / Agora ────────────────────────────────────────────┤
│ ┌foto────┐ ┌agora trabalhando em──────────────────────────┐    │
│ │        │ └──────────────────────────────────────────────┘    │
│ │        │ ┌relógio ao vivo──────┐ ┌último commit───────────┐  │
│ └────────┘ └─────────────────────┘ └────────────────────────┘  │
│ ┌stack principal──────────────┐ ┌selos Oracle────────────────┐ │
│ ┌formação · fora do código──────────────────────────────────┐  │
├─ 03 Cases (lista editorial → página com diagrama SVG) ────────┤
├─ 04 Trajetória (linha que se desenha, LV.1 → LV.5) ───────────┤
├─ 05 Certificações · 06 Stack · 07 Como eu trabalho ───────────┤
├─ 08 GitHub ao vivo · 09 Segurança · 10 Contato ───────────────┤
└───────────────────────────────────────────────────────────────┘
```
