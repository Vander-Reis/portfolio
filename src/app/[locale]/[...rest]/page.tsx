import { notFound } from 'next/navigation'

// Captura rotas desconhecidas dentro do locale para renderizar o not-found traduzido.
export default function CatchAll() {
  notFound()
}
