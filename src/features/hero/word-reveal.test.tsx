import { render, screen } from '@testing-library/react'
import { domAnimation, LazyMotion } from 'motion/react'
import { describe, expect, it } from 'vitest'
import { WordReveal } from './word-reveal'

describe('WordReveal', () => {
  it('mantém a frase completa e legível no DOM', () => {
    render(
      <LazyMotion features={domAnimation}>
        <h1>
          <WordReveal segments={[{ text: 'De estagiário a ' }, { text: 'sênior.', style: 'accent' }]} />
        </h1>
      </LazyMotion>,
    )
    expect(screen.getByRole('heading')).toHaveTextContent('De estagiário a sênior.')
  })

  it('aplica a serif itálica nas palavras de destaque', () => {
    render(
      <LazyMotion features={domAnimation}>
        <WordReveal segments={[{ text: 'Olá ' }, { text: 'mundo', style: 'em' }]} />
      </LazyMotion>,
    )
    expect(screen.getByText('mundo')).toHaveClass('em-serif')
    expect(screen.getByText('Olá')).not.toHaveClass('em-serif')
  })
})
