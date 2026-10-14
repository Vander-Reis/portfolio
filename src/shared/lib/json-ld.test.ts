import { describe, expect, it } from 'vitest'
import { personJsonLd, serializeJsonLd } from './json-ld'

describe('personJsonLd', () => {
  it('descreve a pessoa com cargo, empresa e certificações Oracle', () => {
    const ld = personJsonLd('pt-BR', 'https://example.com')
    expect(ld['@type']).toBe('Person')
    expect(ld.jobTitle).toBe('Desenvolvedor Back-end Sênior')
    expect(ld.worksFor.name).toBe('Tech One')
    expect(ld.hasCredential.some((c) => c.recognizedBy.name === 'Oracle')).toBe(true)
  })

  it('usa o cargo traduzido em inglês', () => {
    expect(personJsonLd('en', 'https://example.com').jobTitle).toBe('Senior Back-end Developer')
  })
})

describe('serializeJsonLd', () => {
  it('impede que conteúdo feche a tag <script>', () => {
    const out = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(out).not.toContain('</script>')
    expect(JSON.parse(out).name).toBe('</script><script>alert(1)</script>')
  })
})
