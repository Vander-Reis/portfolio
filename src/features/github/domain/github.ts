import { z } from 'zod'

/** Parsing defensivo da API do GitHub: nunca confiar no formato da resposta. */
const repoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  fork: z.boolean(),
  archived: z.boolean(),
  pushed_at: z.string(),
})

export type Repo = {
  name: string
  url: string
  description: string | null
  language: string | null
  stars: number
  fork: boolean
  archived: boolean
  pushedAt: string
}

export type Commit = { repo: string; sha: string; message: string; url: string; date: string }
export type Profile = { publicRepos: number; followers: number }

export function parseRepos(payload: unknown): Repo[] {
  if (!Array.isArray(payload)) return []
  return payload.flatMap((item) => {
    const r = repoSchema.safeParse(item)
    if (!r.success) return []
    const d = r.data
    return [
      {
        name: d.name,
        url: d.html_url,
        description: d.description,
        language: d.language,
        stars: d.stargazers_count,
        fork: d.fork,
        archived: d.archived,
        pushedAt: d.pushed_at,
      },
    ]
  })
}

export function pickRecentRepos(repos: readonly Repo[], limit: number): Repo[] {
  return repos
    .filter((r) => !r.fork && !r.archived)
    .toSorted((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt))
    .slice(0, limit)
}

const commitSchema = z.object({
  sha: z.string(),
  html_url: z.string().url(),
  commit: z.object({ message: z.string(), author: z.object({ date: z.string() }).nullable() }),
})

export function parseLatestCommit(payload: unknown, repo: string): Commit | null {
  if (!Array.isArray(payload)) return null
  const first = commitSchema.safeParse(payload[0])
  if (!first.success) return null
  const { sha, html_url, commit } = first.data
  return {
    repo,
    sha: sha.slice(0, 7),
    message: commit.message.split('\n')[0]?.trim() ?? '',
    url: html_url,
    date: commit.author?.date ?? '',
  }
}

const profileSchema = z.object({ public_repos: z.number(), followers: z.number() })

export function parseProfile(payload: unknown): Profile | null {
  const p = profileSchema.safeParse(payload)
  return p.success ? { publicRepos: p.data.public_repos, followers: p.data.followers } : null
}
