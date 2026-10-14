import { defineCollection, defineConfig, s } from 'velite'

/**
 * Cases no formato editorial: contexto → problema → solução → arquitetura → resultado.
 * O schema (Zod, via `s`) falha o build se algum campo obrigatório faltar.
 */
const cases = defineCollection({
  name: 'Case',
  pattern: 'cases/**/*.mdx',
  schema: s
    .object({
      path: s.path(),
      title: s.string().max(90),
      kicker: s.string().max(40),
      summary: s.string().max(240),
      order: s.number().int(),
      period: s.string(),
      role: s.string(),
      diagram: s.enum(['legacy', 'subscription', 'factory', 'devsecops', 'safx']),
      stack: s.array(s.string()).min(1),
      context: s.string(),
      problem: s.string(),
      solution: s.string(),
      architecture: s.array(s.string()).min(1),
      results: s.array(s.object({ value: s.string(), label: s.string() })).min(1),
      repo: s.string().url().optional(),
      confidential: s.boolean().default(false),
      body: s.mdx(),
    })
    .transform(({ path, ...data }) => {
      const [, locale, slug] = path.split('/')
      if (locale !== 'pt-BR' && locale !== 'en') throw new Error(`Locale inválido em ${path}`)
      if (!slug) throw new Error(`Slug ausente em ${path}`)
      return { ...data, locale, slug }
    }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { cases },
  mdx: { remarkPlugins: [], rehypePlugins: [] },
})
