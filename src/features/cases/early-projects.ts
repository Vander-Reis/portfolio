import { site } from '@/shared/config/site'
import type { L10n } from '@/shared/lib/l10n'

export const earlyProjects: { name: string; url: string; stack: string; description: L10n }[] = [
  {
    name: 'dev_finance',
    url: `${site.github.url}/dev_finance`,
    stack: 'HTML · CSS · JavaScript',
    description: {
      'pt-BR': 'Controle financeiro no navegador — meu primeiro CRUD de verdade.',
      en: 'In-browser finance tracker — my first real CRUD.',
    },
  },
  {
    name: 'rocketMoviesApi',
    url: `${site.github.url}/rocketMoviesApi`,
    stack: 'Node.js · Express · SQLite',
    description: {
      'pt-BR': 'API REST de filmes com autenticação e migrations.',
      en: 'Movies REST API with authentication and migrations.',
    },
  },
  {
    name: 'FoodExplorerFront-End',
    url: `${site.github.url}/FoodExplorerFront-End`,
    stack: 'React · Vite · Styled Components',
    description: {
      'pt-BR': 'Cardápio digital responsivo, projeto final do Explorer.',
      en: 'Responsive digital menu, Explorer final project.',
    },
  },
  {
    name: 'Ignite-feed-ts',
    url: `${site.github.url}/Ignite-feed-ts`,
    stack: 'React · TypeScript',
    description: {
      'pt-BR': 'Feed social tipado — onde o TypeScript virou padrão para mim.',
      en: 'Typed social feed — where TypeScript became my default.',
    },
  },
]
