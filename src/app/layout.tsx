import type { ReactNode } from 'react'

// O <html> vive em app/[locale]/layout.tsx (precisa do locale). Este layout raiz
// existe apenas para que app/not-found.tsx funcione fora de um locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
