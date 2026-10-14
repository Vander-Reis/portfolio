import 'server-only'
import { env } from '@/shared/config/env'
import { site } from '@/shared/config/site'
import {
  type Commit,
  type Profile,
  parseLatestCommit,
  parseProfile,
  parseRepos,
  pickRecentRepos,
  type Repo,
} from '../domain/github'

const API = 'https://api.github.com'
/** Cache de 1h no Data Cache do Next (ISR para fetch). */
const REVALIDATE_SECONDS = 3600

async function gh(path: string): Promise<unknown> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['github'] },
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    // Rede indisponível ou rate limit: o site degrada graciosamente.
    return null
  }
}

export type GithubSnapshot = {
  profile: Profile | null
  repos: Repo[]
  latestCommit: Commit | null
}

export async function getGithubSnapshot(): Promise<GithubSnapshot> {
  const user = site.github.user
  const [profileJson, reposJson] = await Promise.all([
    gh(`/users/${user}`),
    gh(`/users/${user}/repos?sort=pushed&per_page=30&type=owner`),
  ])
  const repos = pickRecentRepos(parseRepos(reposJson), 6)
  const latest = repos[0]
  const latestCommit = latest
    ? parseLatestCommit(await gh(`/repos/${user}/${latest.name}/commits?per_page=1`), latest.name)
    : null
  return { profile: parseProfile(profileJson), repos, latestCommit }
}
