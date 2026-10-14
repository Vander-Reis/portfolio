import type { Role } from '../domain/career'

export const roles: readonly Role[] = [
  {
    id: 'intern',
    start: '2021-10',
    company: 'Tech Mind',
    level: 1,
    title: { 'pt-BR': 'Estagiário de desenvolvimento', en: 'Software development intern' },
    summary: {
      'pt-BR': 'Primeiro contato com produção: telas, levantamento de requisitos e sustentação de legado.',
      en: 'First contact with production: UI screens, requirements gathering and legacy support.',
    },
    highlights: [
      { 'pt-BR': 'Telas e fluxos de cadastro', en: 'Screens and data-entry flows' },
      { 'pt-BR': 'Levantamento de requisitos com o cliente', en: 'Requirements gathering with clients' },
      { 'pt-BR': 'Sustentação de sistemas legados', en: 'Legacy systems support' },
    ],
  },
  {
    id: 'developer',
    start: '2022-07',
    company: 'Tech Mind',
    level: 2,
    title: { 'pt-BR': 'Desenvolvedor de software', en: 'Software developer' },
    summary: {
      'pt-BR': 'Efetivado: entregas ponta a ponta e mais autonomia nas demandas.',
      en: 'Hired full-time: end-to-end delivery and more ownership over tasks.',
    },
    highlights: [
      { 'pt-BR': 'Entregas ponta a ponta', en: 'End-to-end delivery' },
      { 'pt-BR': 'Correções e evoluções em produção', en: 'Fixes and improvements in production' },
    ],
  },
  {
    id: 'junior',
    start: '2022-10',
    company: 'Tech One',
    level: 3,
    title: { 'pt-BR': 'Full-stack Júnior', en: 'Junior Full-stack Developer' },
    summary: {
      'pt-BR': 'VB/.NET Framework, APIs .NET e migração de servidores.',
      en: 'VB/.NET Framework, .NET APIs and server migrations.',
    },
    highlights: [
      { 'pt-BR': 'Manutenção em VB/.NET Framework', en: 'VB/.NET Framework maintenance' },
      { 'pt-BR': 'APIs REST em .NET', en: 'REST APIs in .NET' },
      { 'pt-BR': 'Migração de servidores', en: 'Server migrations' },
    ],
  },
  {
    id: 'mid',
    start: '2023-09',
    company: 'Tech One',
    level: 4,
    title: { 'pt-BR': 'Full-stack Pleno', en: 'Mid-level Full-stack Developer' },
    summary: {
      'pt-BR':
        'Oracle Financials, migração COBOL → .NET Core e APIs integradas ao Oracle com Clean Architecture e DDD.',
      en: 'Oracle Financials, COBOL → .NET Core migration and Oracle-integrated APIs with Clean Architecture and DDD.',
    },
    highlights: [
      { 'pt-BR': 'Migração COBOL → .NET Core', en: 'COBOL → .NET Core migration' },
      { 'pt-BR': 'APIs integradas ao Oracle Financials', en: 'APIs integrated with Oracle Financials' },
      { 'pt-BR': 'Clean Architecture e DDD', en: 'Clean Architecture and DDD' },
    ],
  },
  {
    id: 'senior',
    start: '2024-04',
    company: 'Tech One',
    level: 5,
    title: { 'pt-BR': 'Back-end Sênior', en: 'Senior Back-end Developer' },
    summary: {
      'pt-BR':
        'Promovido pelo valor entregue. Direciono tarefas, oriento devs e foco em soluções robustas e escaláveis.',
      en: 'Promoted for the value delivered. I steer tasks, mentor developers and focus on robust, scalable solutions.',
    },
    highlights: [
      { 'pt-BR': 'Direcionamento técnico do time', en: 'Technical direction for the team' },
      { 'pt-BR': 'Mentoria de desenvolvedores', en: 'Mentoring developers' },
      { 'pt-BR': 'Arquitetura robusta e escalável', en: 'Robust, scalable architecture' },
    ],
  },
]
