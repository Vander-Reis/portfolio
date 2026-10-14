export type StackGroup = { id: 'backend' | 'frontend' | 'data' | 'devops' | 'security'; items: string[] }

export const stack: readonly StackGroup[] = [
  { id: 'backend', items: ['C#', '.NET Core', 'ASP.NET', 'Node.js', 'NestJS', 'TypeScript', 'VB.NET'] },
  { id: 'frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Testing Library'] },
  { id: 'data', items: ['Oracle', 'PostgreSQL', 'SQL Server', 'Prisma', 'RabbitMQ', 'Redis'] },
  { id: 'devops', items: ['Azure DevOps', 'GitHub Actions', 'Docker', 'OCI', 'Vercel', 'SFTP'] },
  {
    id: 'security',
    items: ['OWASP Top 10', 'CSP', 'CodeQL', 'gitleaks', 'OAuth 2.0 / JWT', 'Rate limiting'],
  },
]

/** Destaques mostrados no bento da home. */
export const coreStack = ['Node.js', 'C#', '.NET Core', 'TypeScript', 'Next.js', 'React'] as const
