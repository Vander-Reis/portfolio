import { describe, expect, it } from 'vitest'
import { formatClock, isWorkingHours, relativeTime } from './time'

describe('formatClock', () => {
  it('formata o horário de Minas Gerais (America/Sao_Paulo, UTC-3)', () => {
    const date = new Date('2026-10-13T15:04:09Z')
    expect(formatClock(date, 'America/Sao_Paulo', 'pt-BR')).toBe('12:04:09')
  })
})

describe('isWorkingHours', () => {
  it('considera 9h–18h em dias úteis no fuso local', () => {
    expect(isWorkingHours(new Date('2026-10-13T15:00:00Z'), 'America/Sao_Paulo')).toBe(true) // ter 12h
    expect(isWorkingHours(new Date('2026-10-13T23:30:00Z'), 'America/Sao_Paulo')).toBe(false) // ter 20h30
    expect(isWorkingHours(new Date('2026-10-11T15:00:00Z'), 'America/Sao_Paulo')).toBe(false) // domingo
  })
})

describe('relativeTime', () => {
  const now = new Date('2026-10-13T12:00:00Z')
  it('descreve diferenças em linguagem natural', () => {
    expect(relativeTime('2026-10-13T11:00:00Z', now, 'pt-BR')).toBe('há 1 hora')
    expect(relativeTime('2026-10-10T12:00:00Z', now, 'en')).toBe('3 days ago')
    expect(relativeTime('2026-10-13T11:59:30Z', now, 'en')).toBe('now')
  })
})
