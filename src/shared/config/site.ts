import type { L10n } from '@/shared/lib/l10n'

/**
 * Fonte única dos dados pessoais. Campos marcados com TODO dependem de
 * informação que ainda não foi fornecida — trocar antes de publicar.
 */
export const site = {
  name: 'Vander Reis',
  shortName: 'Vander Reis',
  role: { 'pt-BR': 'Desenvolvedor Back-end Sênior', en: 'Senior Back-end Developer' } satisfies L10n,
  company: 'Tech One',
  location: { 'pt-BR': 'Minas Gerais, Brasil · Remoto', en: 'Minas Gerais, Brazil · Remote' } satisfies L10n,
  timeZone: 'America/Sao_Paulo',
  startedInTech: 2020,
  email: 'contato@vanderreis.dev', // TODO: e-mail público de contato
  github: { user: 'Vander-Reis', url: 'https://github.com/Vander-Reis' },
  linkedin: 'https://www.linkedin.com/in/vander-reis-044163201/',
  x: { handle: '@VanderReis9', url: 'https://x.com/VanderReis9' },
  avatar: 'https://avatars.githubusercontent.com/Vander-Reis?s=480',
  education: {
    school: 'Cruzeiro do Sul Virtual',
    // TODO: [CURSO E STATUS] — ex.: "Análise e Desenvolvimento de Sistemas · concluído"
    course: { 'pt-BR': 'Graduação em tecnologia', en: 'Technology degree' } satisfies L10n,
  },
  nowWorkingOn: {
    'pt-BR':
      'Modernização de legado Oracle Financials e um serviço de sincronização de assinaturas em NestJS.',
    en: 'Modernizing Oracle Financials legacy systems and a NestJS subscription-sync service.',
  } satisfies L10n,
  // TODO: [HOBBIES / O QUE ME MOVE]
  offline: {
    'pt-BR': 'Fora do código: aprender algo novo toda semana e ensinar o que aprendi.',
    en: 'Off the keyboard: learning something new every week and teaching what I learn.',
  } satisfies L10n,
} as const
