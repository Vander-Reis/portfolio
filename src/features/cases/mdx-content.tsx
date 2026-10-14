import * as runtime from 'react/jsx-runtime'

/**
 * Renderiza o MDX compilado pelo Velite. Executa apenas no servidor (Server
 * Component) e só sobre conteúdo do próprio repositório — nunca input externo.
 */
const components = {
  h2: (props: React.ComponentProps<'h2'>) => <h2 className="mt-12 mb-4 text-h3 font-medium" {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="mt-8 mb-3 font-medium" {...props} />,
  p: (props: React.ComponentProps<'p'>) => <p className="my-4 leading-relaxed text-ink-2" {...props} />,
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="my-4 list-disc space-y-2 pl-5 text-ink-2" {...props} />
  ),
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="my-4 list-decimal space-y-2 pl-5 text-ink-2" {...props} />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote className="my-8 border-l-2 border-accent pl-5 text-lead em-serif text-ink" {...props} />
  ),
  a: (props: React.ComponentProps<'a'>) => (
    <a className="text-accent underline underline-offset-4" {...props} />
  ),
}

function useMDXComponent(code: string) {
  const fn = new Function(code)
  return fn({ ...runtime }).default as React.ComponentType<{ components?: typeof components }>
}

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
