import { NextRequest, type NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/shared/i18n/routing'
import { buildCsp, createNonce } from '@/shared/lib/csp'

const intl = createIntlMiddleware(routing)

export default function middleware(request: NextRequest): NextResponse {
  const nonce = createNonce()
  const csp = buildCsp({ nonce, isDev: process.env.NODE_ENV === 'development' })

  // O Next lê o nonce do header CSP da *requisição* e o aplica aos próprios scripts.
  // O next-intl copia esses headers para a resposta encaminhada.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('content-security-policy', csp)

  const response = intl(new NextRequest(request, { headers: requestHeaders }))

  // Os demais headers (HSTS, COOP, CORP…) vêm de next.config.ts, para todas as rotas.
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|_vercel|\\.well-known|favicon.ico|icon.svg|robots.txt|sitemap.xml|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
