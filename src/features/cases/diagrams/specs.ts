import type { Locale } from '@/shared/i18n/routing'
import type { DiagramKey, DiagramSpec } from './types'

/** Especificação declarativa de cada diagrama — dados puros, renderizados por FlowDiagram. */
export function getDiagramSpec(key: Exclude<DiagramKey, 'legacy'>, locale: Locale): DiagramSpec {
  const l = (pt: string, en: string) => (locale === 'pt-BR' ? pt : en)

  switch (key) {
    case 'subscription':
      return {
        width: 980,
        height: 380,
        description: l(
          'O Asaas notifica o serviço via webhook; uma reconciliação periódica busca divergências. O serviço NestJS persiste no PostgreSQL e publica eventos no RabbitMQ, consumidos por cada aplicação.',
          'Asaas notifies the service through webhooks; a periodic reconciliation catches drift. The NestJS service persists to PostgreSQL and publishes events to RabbitMQ, consumed by each application.',
        ),
        groups: [{ x: 200, y: 20, w: 450, h: 345, label: 'subscription-sync-service' }],
        nodes: [
          { id: 'asaas', x: 20, y: 150, w: 140, label: 'Asaas', sub: l('gateway', 'gateway') },
          { id: 'webhook', x: 225, y: 60, w: 160, label: 'Webhook', sub: 'POST · token' },
          {
            id: 'cron',
            x: 225,
            y: 240,
            w: 160,
            label: l('Reconciliação', 'Reconciliation'),
            sub: l('cron · periódica', 'cron · periodic'),
          },
          {
            id: 'core',
            x: 455,
            y: 150,
            w: 170,
            label: 'NestJS',
            sub: l('idempotência', 'idempotency'),
            tone: 'ink',
          },
          { id: 'db', x: 455, y: 290, w: 170, h: 54, label: 'PostgreSQL', sub: 'Prisma' },
          { id: 'mq', x: 690, y: 150, w: 120, label: 'RabbitMQ', sub: 'topic' },
          { id: 'a', x: 850, y: 50, w: 110, h: 50, label: 'App A' },
          { id: 'b', x: 850, y: 154, w: 110, h: 50, label: 'App B' },
          { id: 'c', x: 850, y: 258, w: 110, h: 50, label: 'App C' },
        ],
        edges: [
          { from: 'asaas', to: 'webhook', label: l('evento', 'event'), flow: true },
          { from: 'cron', to: 'asaas', label: 'GET', dashed: true },
          { from: 'webhook', to: 'core', flow: true },
          { from: 'cron', to: 'core' },
          { from: 'core', to: 'db' },
          { from: 'core', to: 'mq', label: 'publish', flow: true },
          { from: 'mq', to: 'a', flow: true },
          { from: 'mq', to: 'b', flow: true },
          { from: 'mq', to: 'c', flow: true },
        ],
      }

    case 'factory':
      return {
        width: 940,
        height: 400,
        description: l(
          'Monorepo pnpm com três apps: a interface web em Next.js envia pedidos para a API, que enfileira tarefas para o worker. O worker orquestra agentes especializados (planejamento, código, revisão e testes).',
          'pnpm monorepo with three apps: the Next.js web UI sends requests to the API, which queues jobs for the worker. The worker orchestrates specialised agents (planning, coding, review and testing).',
        ),
        groups: [{ x: 10, y: 20, w: 620, h: 360, label: 'monorepo · pnpm workspaces' }],
        nodes: [
          { id: 'web', x: 35, y: 150, w: 160, label: 'apps/web', sub: 'Next.js 15 · React 19' },
          { id: 'api', x: 245, y: 150, w: 150, label: 'apps/api', sub: l('orquestração', 'orchestration') },
          {
            id: 'worker',
            x: 450,
            y: 150,
            w: 150,
            label: 'apps/worker',
            sub: l('fila de jobs', 'job queue'),
            tone: 'ink',
          },
          {
            id: 'state',
            x: 245,
            y: 290,
            w: 150,
            h: 54,
            label: l('Estado', 'State'),
            sub: l('artefatos · logs', 'artifacts · logs'),
          },
          {
            id: 'plan',
            x: 700,
            y: 30,
            w: 200,
            h: 54,
            label: 'Planner',
            sub: l('requisitos → tarefas', 'specs → tasks'),
            tone: 'accent',
          },
          {
            id: 'code',
            x: 700,
            y: 120,
            w: 200,
            h: 54,
            label: 'Coder',
            sub: l('implementação', 'implementation'),
            tone: 'accent',
          },
          {
            id: 'review',
            x: 700,
            y: 210,
            w: 200,
            h: 54,
            label: 'Reviewer',
            sub: l('revisão de código', 'code review'),
            tone: 'accent',
          },
          { id: 'test', x: 700, y: 300, w: 200, h: 54, label: 'Tester', sub: 'TDD', tone: 'accent' },
        ],
        edges: [
          { from: 'web', to: 'api', label: 'HTTP', flow: true },
          { from: 'api', to: 'worker', label: 'jobs', flow: true },
          { from: 'api', to: 'state' },
          { from: 'worker', to: 'plan', flow: true },
          { from: 'worker', to: 'code', flow: true },
          { from: 'worker', to: 'review', flow: true },
          { from: 'worker', to: 'test', flow: true },
        ],
      }

    case 'devsecops':
      return {
        width: 900,
        height: 380,
        description: l(
          'Desenvolvedores abrem Pull Requests no GitHub; checagens automáticas e aprovações obrigatórias protegem a branch main. Após o merge, um workflow do GitHub Actions sincroniza o código com o Azure DevOps, que executa build e release.',
          'Developers open Pull Requests on GitHub; automated checks and required approvals protect main. After merge, a GitHub Actions workflow syncs the code to Azure DevOps, which runs build and release.',
        ),
        groups: [
          { x: 10, y: 20, w: 880, h: 150, label: 'GitHub' },
          { x: 10, y: 205, w: 880, h: 160, label: 'Azure DevOps' },
        ],
        nodes: [
          { id: 'dev', x: 35, y: 70, w: 150, label: 'Dev', sub: 'feature/*' },
          {
            id: 'pr',
            x: 255,
            y: 70,
            w: 160,
            label: 'Pull Request',
            sub: l('lint · testes · CodeQL', 'lint · tests · CodeQL'),
          },
          {
            id: 'approve',
            x: 485,
            y: 70,
            w: 160,
            label: l('Aprovações', 'Approvals'),
            sub: l('obrigatórias', 'required'),
            tone: 'accent',
          },
          { id: 'main', x: 715, y: 70, w: 150, label: 'main', sub: l('protegida', 'protected'), tone: 'ink' },
          { id: 'sync', x: 715, y: 260, w: 150, label: 'GitHub Actions', sub: 'sync' },
          { id: 'repos', x: 485, y: 260, w: 160, label: 'Azure Repos', sub: l('espelho', 'mirror') },
          { id: 'pipe', x: 255, y: 260, w: 160, label: 'Pipelines', sub: 'build · release' },
          { id: 'env', x: 35, y: 260, w: 150, label: l('Ambientes', 'Environments'), sub: 'dev → prod' },
        ],
        edges: [
          { from: 'dev', to: 'pr', flow: true },
          { from: 'pr', to: 'approve', flow: true },
          { from: 'approve', to: 'main', label: 'merge', flow: true },
          { from: 'main', to: 'sync', label: 'on: push', flow: true },
          { from: 'sync', to: 'repos', flow: true },
          { from: 'repos', to: 'pipe', flow: true },
          { from: 'pipe', to: 'env', flow: true },
        ],
      }

    case 'safx':
      return {
        width: 960,
        height: 340,
        description: l(
          'O analista fiscal envia uma planilha Excel pela tela de administração. A API .NET valida e converte para o layout SAFX, registra o histórico e envia o arquivo por SFTP para o Tax One.',
          'The tax analyst uploads an Excel sheet through the admin screen. The .NET API validates and converts it to the SAFX layout, records history and sends the file over SFTP to Tax One.',
        ),
        nodes: [
          {
            id: 'user',
            x: 20,
            y: 120,
            w: 150,
            label: l('Analista', 'Analyst'),
            sub: l('planilha .xlsx', '.xlsx sheet'),
          },
          { id: 'ui', x: 210, y: 120, w: 150, label: 'Admin SAFX', sub: 'upload' },
          {
            id: 'api',
            x: 400,
            y: 120,
            w: 170,
            label: 'API .NET',
            sub: l('validação · layout', 'validation · layout'),
            tone: 'ink',
          },
          {
            id: 'db',
            x: 400,
            y: 250,
            w: 170,
            h: 54,
            label: l('Histórico', 'History'),
            sub: l('auditoria', 'audit'),
          },
          {
            id: 'sftp',
            x: 610,
            y: 120,
            w: 140,
            label: 'SFTP',
            sub: l('canal seguro', 'secure channel'),
            tone: 'accent',
          },
          { id: 'tax', x: 790, y: 120, w: 150, label: 'Tax One', sub: l('importação', 'import') },
        ],
        edges: [
          { from: 'user', to: 'ui', flow: true },
          { from: 'ui', to: 'api', label: 'multipart', flow: true },
          { from: 'api', to: 'db' },
          { from: 'api', to: 'sftp', label: 'SAFX', flow: true },
          { from: 'sftp', to: 'tax', flow: true },
        ],
      }
  }
}
