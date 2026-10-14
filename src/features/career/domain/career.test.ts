import { describe, expect, it } from 'vitest'
import { roles } from '../data/roles'
import { currentRole, formatDuration, levelProgress, monthsBetween, timeToReachLevel } from './career'

describe('monthsBetween', () => {
  it('conta meses entre duas datas ano-mês', () => {
    expect(monthsBetween('2021-10', '2022-07')).toBe(9)
    expect(monthsBetween('2021-10', '2024-04')).toBe(30)
  })

  it('é zero para o mesmo mês e rejeita intervalo invertido', () => {
    expect(monthsBetween('2023-09', '2023-09')).toBe(0)
    expect(() => monthsBetween('2024-01', '2023-01')).toThrow()
  })

  it('rejeita formato inválido', () => {
    expect(() => monthsBetween('2024-13', '2025-01')).toThrow()
    expect(() => monthsBetween('24-01', '2025-01')).toThrow()
  })
})

describe('trajetória real', () => {
  it('está em ordem cronológica e com níveis crescentes', () => {
    for (let i = 1; i < roles.length; i++) {
      const prev = roles[i - 1]
      const cur = roles[i]
      if (!prev || !cur) throw new Error('índice inválido')
      expect(monthsBetween(prev.start, cur.start)).toBeGreaterThan(0)
      expect(cur.level).toBeGreaterThan(prev.level)
    }
  })

  it('sustenta a narrativa: de estagiário a sênior em menos de 3 anos', () => {
    const months = timeToReachLevel(roles, 5)
    expect(months).toBe(30)
    expect(months).toBeLessThan(36)
  })

  it('o cargo atual é o de Back-end Sênior', () => {
    expect(currentRole(roles).id).toBe('senior')
  })
})

describe('timeToReachLevel', () => {
  it('retorna null se o nível nunca foi alcançado', () => {
    expect(timeToReachLevel(roles, 9)).toBeNull()
  })
})

describe('levelProgress', () => {
  it('normaliza o nível entre 0 e 1', () => {
    expect(levelProgress(1, 5)).toBe(0.2)
    expect(levelProgress(5, 5)).toBe(1)
  })
})

describe('formatDuration', () => {
  it('formata em pt-BR e en', () => {
    expect(formatDuration(30, 'pt-BR')).toBe('2 anos e 6 meses')
    expect(formatDuration(30, 'en')).toBe('2 years and 6 months')
    expect(formatDuration(12, 'pt-BR')).toBe('1 ano')
    expect(formatDuration(1, 'en')).toBe('1 month')
  })
})
