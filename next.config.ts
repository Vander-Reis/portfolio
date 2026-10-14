import path from 'node:path'
import type { NextConfig } from 'next'
import { securityHeaders } from './src/shared/lib/csp'

// Equivalente ao plugin `next-intl/plugin`, sem carregar @swc/core em runtime
// (o binário nativo dele valida ACLs do diretório de cache e falha em algumas
// máquinas Windows). O plugin só registra este alias. Ver ADR 0003.
const I18N_REQUEST_CONFIG = './src/shared/i18n/request.ts'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
  turbopack: {
    resolveAlias: { 'next-intl/config': I18N_REQUEST_CONFIG },
  },
  webpack(config) {
    config.resolve.alias['next-intl/config'] = path.resolve(I18N_REQUEST_CONFIG)
    return config
  },
  // Headers estáticos valem para TODAS as rotas (inclusive assets e security.txt).
  // A CSP, por depender de nonce por requisição, é aplicada no middleware.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: Object.entries(securityHeaders).map(([key, value]) => ({ key, value })),
      },
      {
        source: '/.well-known/security.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ]
  },
}

export default nextConfig
