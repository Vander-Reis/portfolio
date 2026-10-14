import './globals.css'

// Fallback para URLs fora do roteamento por locale (raríssimo — o middleware cobre o resto).
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body className="grid min-h-screen place-content-center bg-bg text-center font-sans text-ink">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-2 text-2xl font-medium">Página não encontrada</h1>
        <a href="/" className="mt-6 underline underline-offset-4">
          Voltar para o início
        </a>
      </body>
    </html>
  )
}
