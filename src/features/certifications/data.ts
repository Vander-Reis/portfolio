import { site } from '@/shared/config/site'

export type Certification = {
  id: string
  title: string
  issuer: 'Oracle' | 'Rocketseat' | 'ProgramadorBr'
  year: number
  featured?: boolean
  /** TODO: trocar pelos links diretos das credenciais (Oracle CertView / Rocketseat). */
  credentialUrl: string
}

const fallback = `${site.linkedin}details/certifications/`

export const certifications: readonly Certification[] = [
  {
    id: 'oracle-erp',
    title: 'Oracle Fusion Cloud Applications ERP Foundations Associate',
    issuer: 'Oracle',
    year: 2025,
    featured: true,
    credentialUrl: fallback,
  },
  {
    id: 'oci-genai',
    title: 'OCI 2024 Generative AI Certified Professional',
    issuer: 'Oracle',
    year: 2024,
    featured: true,
    credentialUrl: fallback,
  },
  { id: 'rs-react', title: 'ReactJS', issuer: 'Rocketseat', year: 2023, credentialUrl: fallback },
  {
    id: 'rs-ignite-node',
    title: 'Ignite Node.js',
    issuer: 'Rocketseat',
    year: 2023,
    credentialUrl: fallback,
  },
  { id: 'rs-explorer', title: 'Explorer', issuer: 'Rocketseat', year: 2022, credentialUrl: fallback },
  {
    id: 'rs-fundamentar',
    title: 'Trilha Fundamentar',
    issuer: 'Rocketseat',
    year: 2022,
    credentialUrl: fallback,
  },
  { id: 'rs-conectar', title: 'Trilha Conectar', issuer: 'Rocketseat', year: 2022, credentialUrl: fallback },
  {
    id: 'programadorbr',
    title: 'Desenvolvimento de software',
    issuer: 'ProgramadorBr',
    year: 2021,
    credentialUrl: fallback,
  },
]
