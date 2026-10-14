export type DiagramNode = {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  label: string
  sub?: string
  tone?: 'default' | 'ink' | 'accent'
}

export type DiagramEdge = {
  from: string
  to: string
  label?: string
  /** Desenha mensagens fluindo pela aresta. */
  flow?: boolean
  dashed?: boolean
}

export type DiagramGroup = { x: number; y: number; w: number; h: number; label: string }

export type DiagramSpec = {
  width: number
  height: number
  description: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  groups?: DiagramGroup[]
}

export type DiagramKey = 'legacy' | 'subscription' | 'factory' | 'devsecops' | 'safx'
