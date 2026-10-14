import { ImageResponse } from 'next/og'
import { site } from '@/shared/config/site'
import { isLocale } from '@/shared/i18n/routing'

export const alt = 'Vander Reis — Senior Back-end Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadFont(family: string, text: string, ital = false): Promise<ArrayBuffer | null> {
  try {
    const query = ital ? `${family}:ital@1` : `${family}:wght@500`
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${query}&text=${encodeURIComponent(text)}`)
    ).text()
    const url = css.match(/src: url\((.+?)\) format/)?.[1]
    return url ? await (await fetch(url)).arrayBuffer() : null
  } catch {
    return null
  }
}

/** Open Graph dinâmico no estilo claro do site. */
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'pt-BR'
  const pt = locale === 'pt-BR'
  const line1 = pt ? 'De estagiário a' : 'From intern to'
  const accent = pt ? 'sênior' : 'senior'
  const line2 = pt ? 'em menos de 3 anos.' : 'in under 3 years.'
  const role = `${site.role[locale]} · ${site.company}`

  const [sans, serif] = await Promise.all([
    loadFont('Geist', `${line1}${line2}${role}${site.name}.NETNode.jsTypeScriptVR`),
    loadFont('Instrument Serif', accent, true),
  ])
  const fonts = [
    ...(sans ? [{ name: 'Geist', data: sans, weight: 500 as const, style: 'normal' as const }] : []),
    ...(serif ? [{ name: 'Instrument', data: serif, weight: 400 as const, style: 'italic' as const }] : []),
  ]

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: '#FAFAF7',
        color: '#111111',
        fontFamily: 'Geist',
        backgroundImage:
          'linear-gradient(#E6E4DC 1px, transparent 1px), linear-gradient(90deg, #E6E4DC 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: '#111',
            color: '#FAFAF7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          VR
        </div>
        <div style={{ fontSize: 28 }}>{site.name}</div>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', fontSize: 92, lineHeight: 1, letterSpacing: -3 }}
      >
        <div style={{ display: 'flex', gap: 22 }}>
          <span>{line1}</span>
          <span style={{ fontFamily: 'Instrument', fontStyle: 'italic', color: '#2B4BFF' }}>{accent}</span>
        </div>
        <div>{line2}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#3B3B38' }}>
        <span>{role}</span>
        <span style={{ color: '#2B4BFF' }}>.NET · Node.js · TypeScript</span>
      </div>
    </div>,
    { ...size, fonts },
  )
}
