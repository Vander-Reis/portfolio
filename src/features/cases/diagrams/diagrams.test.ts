import { describe, expect, it } from 'vitest'
import { locales } from '@/shared/i18n/routing'
import { edgePath } from './flow-diagram'
import { getDiagramSpec } from './specs'

describe('edgePath', () => {
  const a = { x: 0, y: 0, w: 100, h: 50 }

  it('liga bordas laterais quando o alvo está à direita', () => {
    expect(edgePath(a, { x: 200, y: 0, w: 100, h: 50 })).toBe('M 100 25 C 150 25, 150 25, 200 25')
  })

  it('liga bordas verticais quando o alvo está abaixo', () => {
    expect(edgePath(a, { x: 0, y: 200, w: 100, h: 50 })).toBe('M 50 50 C 50 125, 50 125, 50 200')
  })
})

describe('getDiagramSpec', () => {
  const keys = ['subscription', 'factory', 'devsecops', 'safx'] as const

  it.each(keys.flatMap((k) => locales.map((l) => [k, l] as const)))(
    '%s (%s): arestas apontam para nós existentes e tudo cabe no viewBox',
    (key, locale) => {
      const spec = getDiagramSpec(key, locale)
      const ids = new Set(spec.nodes.map((n) => n.id))
      expect(ids.size).toBe(spec.nodes.length)
      for (const e of spec.edges) {
        expect(ids.has(e.from)).toBe(true)
        expect(ids.has(e.to)).toBe(true)
      }
      for (const n of spec.nodes) {
        expect(n.x + (n.w ?? 150)).toBeLessThanOrEqual(spec.width)
        expect(n.y + (n.h ?? 58)).toBeLessThanOrEqual(spec.height)
      }
      expect(spec.description.length).toBeGreaterThan(40)
    },
  )
})
