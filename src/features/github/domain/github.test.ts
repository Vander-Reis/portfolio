import { describe, expect, it } from 'vitest'
import { parseLatestCommit, parseProfile, parseRepos, pickRecentRepos } from './github'

const repo = (name: string, pushed: string, extra: Record<string, unknown> = {}) => ({
  name,
  full_name: `Vander-Reis/${name}`,
  html_url: `https://github.com/Vander-Reis/${name}`,
  description: null,
  language: 'TypeScript',
  stargazers_count: 0,
  fork: false,
  archived: false,
  pushed_at: pushed,
  ...extra,
})

describe('parseRepos', () => {
  it('valida o payload e ignora itens malformados', () => {
    const repos = parseRepos([repo('a', '2026-01-01T00:00:00Z'), { name: 42 }])
    expect(repos).toHaveLength(1)
    expect(repos[0]?.name).toBe('a')
  })

  it('retorna lista vazia para payload inesperado', () => {
    expect(parseRepos({ message: 'API rate limit exceeded' })).toEqual([])
  })
})

describe('pickRecentRepos', () => {
  it('ordena por push mais recente, remove forks/arquivados e limita', () => {
    const repos = parseRepos([
      repo('old', '2024-01-01T00:00:00Z'),
      repo('fork', '2026-09-01T00:00:00Z', { fork: true }),
      repo('new', '2026-08-01T00:00:00Z'),
      repo('arch', '2026-09-02T00:00:00Z', { archived: true }),
      repo('mid', '2025-05-01T00:00:00Z'),
    ])
    expect(pickRecentRepos(repos, 2).map((r) => r.name)).toEqual(['new', 'mid'])
  })
})

describe('parseLatestCommit', () => {
  it('extrai o primeiro commit da lista com mensagem de uma linha', () => {
    const commit = parseLatestCommit(
      [
        {
          sha: 'abcdef1234567890',
          html_url: 'https://github.com/x/y/commit/abcdef1',
          commit: {
            message: 'feat: sync assinaturas\n\ncorpo longo',
            author: { date: '2026-10-01T12:00:00Z' },
          },
        },
      ],
      'subscription-sync-service',
    )
    expect(commit).toEqual({
      repo: 'subscription-sync-service',
      sha: 'abcdef1',
      message: 'feat: sync assinaturas',
      url: 'https://github.com/x/y/commit/abcdef1',
      date: '2026-10-01T12:00:00Z',
    })
  })

  it('retorna null quando não há commits', () => {
    expect(parseLatestCommit([], 'x')).toBeNull()
    expect(parseLatestCommit({ message: 'Not Found' }, 'x')).toBeNull()
  })
})

describe('parseProfile', () => {
  it('lê os contadores públicos', () => {
    expect(parseProfile({ public_repos: 40, followers: 12, following: 3, login: 'Vander-Reis' })).toEqual({
      publicRepos: 40,
      followers: 12,
    })
    expect(parseProfile(null)).toBeNull()
  })
})
